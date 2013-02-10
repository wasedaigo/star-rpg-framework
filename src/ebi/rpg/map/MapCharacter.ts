/// <reference path='../../collision/CollisionObject.ts' />
/// <reference path='../../collision/CollisionSystem.ts' />
/// <reference path='../../game/Game.ts' />
/// <reference path='../../game/ResourcePreloader.ts' />
/// <reference path='../core/DatabaseManager.ts' />
/// <reference path='../map/Map.ts' />
/// <reference path='../map/MapSprite.ts' />
/// <reference path='../map/MapCharacterChipset.ts' />
/// <reference path='../ui/AnalogInputController.ts' />

module ebi.rpg.map {
    export class MapCharacter {
        private switchFrameDir_: number = 1;
        private frameNo_: number = 0;
        private dir_: number = 0;
        private timer_: number = 0;
        private chipsetId_: number = -1;
        private eventId_: number;
        private mapSprite_: MapSprite = null;
        private charaChipset_: MapCharacterChipset;
        private vx_: number = 0;
        private vy_: number = 0;
        private map_: Map;
        private collisionObject_: ebi.rpg.collision.CollisionObject;
        private controlable_: bool;
        private speed_: number;

        private setImage(src :string): void {
            if (this.mapSprite_) {
                this.mapSprite_.dispose();
                this.mapSprite_ = null;
            }

            if (src) {
                var image = ebi.game.ResourcePreloader.getImage(src);
                this.mapSprite_ = new ebi.rpg.map.MapSprite(image, this.map_);
                this.mapSprite_.srcX = 0;
                this.mapSprite_.srcY = 0;
                this.mapSprite_.srcWidth  = this.charaChipset_.size[0];
                this.mapSprite_.srcHeight = this.charaChipset_.size[1];
            }
        }

        constructor(eventId: number, map: Map) {
            this.map_ = map;
            // Initializing chipset through accessor
            this.chipsetId = 0;
            this.dir_ = 0;
            this.speed_ = 3;
            this.frameNo_ = this.charaChipset_.defaultFrameNo;
            this.eventId_ = eventId;

            // Setup collision object
            // Even for non-colliding character, 
            //we need this to manipulte its position
            this.collisionObject_ = ebi.rpg.collision.CollisionSystem.createCollisionRect(
                this.charaChipset_.hitRect[0],
                this.charaChipset_.hitRect[1],
                this.charaChipset_.hitRect[2] - 1,
                this.charaChipset_.hitRect[3] - 1
            );
            this.collisionObject_.setCategory(ebi.rpg.collision.Category.Character);

            this.updateVisual(); 
        }

        public dispose(): void {
            this.collisionObject_.dispose();
        }

        public setPosition(x: number, y: number): void {
            this.collisionObject_.setPos(x, y);
        }

        public set ignoreTile(ignore: bool) {
            this.collisionObject_.setIgnoreCategory(ebi.rpg.collision.Category.Tile, ignore);
        }

        public set ignoreCharacter(ignore: bool) {
            this.collisionObject_.setIgnoreCategory(ebi.rpg.collision.Category.Character, ignore);
        }
       
        public set ignoreTrigger(ignore: bool) {
            this.collisionObject_.ignoreTrigger = ignore;
        }

        public get width(): number {
            return this.charaChipset_.size[0];
        }

        public get height(): number {
            return this.charaChipset_.size[1];
        }

        public get screenX(): number {
            return this.collisionObject_.x;
        }

        public get screenY(): number {
            return this.collisionObject_.y;
        }

        public get controlable(): bool {
            return this.controlable_;
        }

        public set controlable(value: bool) {
            this.controlable_ = value;
        }

        public get speed(): number {
            return this.speed_;
        }

        public set speed(value: number) {
            this.speed_ = value;
        }

        public get chipsetId(): number {
            return this.chipsetId_;
        }

        public set chipsetId(id: number) {
            if (this.chipsetId_ != id) {
                this.chipsetId_ = id;
                this.charaChipset_ = core.DatabaseManager.getCharaChipsetData(id);
                this.setImage(this.charaChipset_.src);
            }
        }

        public update(): void {
            // Save previous moving state
            var wasMoving: bool = this.isMoving;

            // Setup velocity
            if (this.controlable) {
                this.setVelocity(this.speed_ * ui.AnalogInputController.inputDx, this.speed_ * ui.AnalogInputController.inputDy);
            } else {
                this.setVelocity(0, 0);
            }

            this.updateDir();

            // Detect move stop event
            if (!this.isMoving && wasMoving) {
                this.onMoveStop();
            }

            // Update character state
            
            this.updateFrame();
            this.updateVisual();
        }

        private onMoveStop(): void {
            this.frameNo_ = this.charaChipset_.defaultFrameNo;
        }

        private get isMoving(): bool {
            return (this.vx_ !== 0 || this.vy_ !== 0);
        }

        private setVelocity(vx: number, vy: number): void {
            this.vx_ = vx;
            this.vy_ = vy;
            this.collisionObject_.setVelocity(vx, vy);
        }

        private updateDir(): void {
            if (!this.isMoving) {
                return;
            }

            var t = Math.atan2(this.vy_, this.vx_) / Math.PI; // -1.0 ~ 1.0
            // Match the angle with chipset image format
            var angle = 1.0 - (0.5 * t + 0.75 - (1 / (2 * this.charaChipset_.dirCount))) % 1.0; // 0.0 ~ 1.0
            this.dir_ = Math.floor(angle * this.charaChipset_.dirCount) % this.charaChipset_.dirCount;
        }

        private updateFrame(): void {
            if (!this.isMoving) {
                return;
            }

            this.timer_++;
            if (this.timer_ > 10) {
                this.timer_ = 0;
                this.frameNo_ += this.switchFrameDir_;

                // switching the animation frame to the right
                if (this.frameNo_ >= this.charaChipset_.frameCount - 1) {
                    this.frameNo_ = this.charaChipset_.frameCount - 1;
                    this.switchFrameDir_ = -1;
                }

                // switching the animation frame to the left
                if (this.frameNo_ <= 0) {
                    this.frameNo_ = 0;
                    this.switchFrameDir_ = 1;
                }
            }
        }

        private updateVisual(): void {
            if (this.mapSprite_) {
                // Update animation frame
                this.mapSprite_.srcX = (this.charaChipset_.srcIndex[0] * this.charaChipset_.frameCount + this.frameNo_) * this.charaChipset_.size[0];
                // Update animation dir
                this.mapSprite_.srcY = (this.charaChipset_.srcIndex[1] * this.charaChipset_.dirCount + this.dir_) * this.charaChipset_.size[1];

                this.mapSprite_.x = this.collisionObject_.x;
                this.mapSprite_.y = this.collisionObject_.y;
            }
        }
    }
}
