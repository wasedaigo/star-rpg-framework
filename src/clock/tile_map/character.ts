/// <reference path='../interval.ts' />

module clock.tileMap {
        // Temp
        class CharacterChipset {
            constructor(a, b, c, d, e, f) {}
        }

        var CollisionType = {
            "UP": 1, 
            "RIGHT": 2, 
            "DOWN": 4, 
            "LEFT": 8

        };

        var CharacterSpeedType = {
            "VERY_SLOW": 1,
            "SLOW": 2, 
            "NORMAL": 4, 
            "FAST": 8, 
            "VERY_FAST": 16,
            "MAX": 16
        };

        export class Character {

        //
        // private members
        //
        private map_: any;
        private id_: number;
        private mapX_: number;
        private mapY_: number;
        private allowDiagonalMovement_: bool;
        private x_: number;
        private y_: number;
        private sx_: number;
        private sy_: number;
        private sprite_: any;
        private speedType_: number;
        private speed_: number;
        private wait_: number;
        private a_: number;
        private moveInterval_: interval.IInterval;
        private waitInterval_: interval.IInterval;
        private commands_: any;
        private checkedObjects_: any[];
        private touchedObjects_: any[];
        private walkCounter_: number;
        private walkAnimeDir_: number;
        private chipset_: any;

        //
        // public members
        //
        public hitX: number;
        public hitY: number;
        public offsetX: number;
        public offsetY: number;
        public passCharacter: bool;
        public passTile: bool;
        public passEvent: bool;
        public dirFix: bool;
        public stayAnime: bool;
        public moveAnime: bool;
        public layer: any;
        public alpha: number;
        public visible: bool;
        public dirX: number;
        public dirY: number;
        public pause: bool;
        public frameNo: number;
          
        //
        // accessors
        //          
        public get mapX(): number {return this.mapX_;}
        public get mapY(): number {return this.mapY_;}
        public get id(): number {return this.id_;}
        public get wait(): number {return this.wait_;}
        public get chipset(): any {return this.chipset_;}
        public get sx(): number {return this.sx_;}
        public get sy(): number {return this.sy_;}
        public get speedType(): number {return this.speedType_;}
        public set speedType(type: number) {
            this.speedType_ = type;
            if (this.speedType_ < 0) {
                this.speedType_ = 0;
            }
            if (this.speedType_ >= CharacterSpeedType.MAX) {
                this.speedType_ = CharacterSpeedType.MAX;
            }
            this.speed_ = CharacterSpeedType[this.speedType_];
        }

        //
        // * Initialize character;
        //        chip                                    : Character Chipset;
        //        id                                                                                    : Selected character ID;
        //        mapX                                                                    : characters map position x;
        //        mapY                                                                     : characters map position y;
        //        speed                                                                        : amount of movement character does each frame;
        //        allowDiagonalMovement : Allow movement in diagonal directino;
        //
        constructor(map: any, 
                    chipset: any, 
                    sx: number, 
                    sy: number, 
                    id: number, 
                    mapX: number, 
                    mapY: number, 
                    allowDiagonalMovement: bool = false) {
            this.setChip(chipset, sx, sy);
            this.map_ = map;
            this.id_ = id;
            this.mapX_ = mapX;
            this.mapY_ = mapY;
            this.allowDiagonalMovement_ = allowDiagonalMovement;
            this.x_ = this.mapX_ * this.map_.gridWidth;
            this.y_ = this.mapY_ * this.map_.gridHeight;
            this.hitX = 1;
            this.hitY = 1;
            this.offsetX = 0;
            this.offsetY = 0;
            this.sx_ = sx;
            this.sy_ = sy;

            // Options;
            this.passCharacter = true;
            this.passTile = true;
            this.passEvent = true;
            this.dirFix = false;
            this.stayAnime = false;
            this.moveAnime = false;
            //this.sprite_ = new Sprite(null, this.screenX, this.screenY, :srcWidth => this.width, :srcHeight => this.height);
            this.speedType_ = 0;
            this.speed_ = CharacterSpeedType.SLOW;
            this.layer = 1;
            this.wait_ = 0;
            this.alpha = 255;
            this.visible = true;
            this.a_ = 1 // Frame change direction(to right = 1, to left = -1);
            this.dirX = 0 // Character's direction x;
            this.dirY = -1 // Character's direction y;
            this.moveInterval_ = interval.Empty;
            this.waitInterval_ = interval.Empty;
            this.commands_ = [];
            this.checkedObjects_ = [];
            this.touchedObjects_ = [];
            this.pause = false;
            this.walkCounter_ = 0;
            this.walkAnimeDir_ = 1;
            this.frameNo = 0;
        }
        //
        // * Set character position;
        // 
        public setPosition(mapX: number, mapY: number): void {
            this.mapX_ = mapX;
            this.mapY_ = mapY;
            this.resetPosition();
        }
        
        //
        // * Set character chipset;
        //
        public setChip(chipset: any, sx: number, sy: number): void {
            if (!chipset) {
                chipset = new CharacterChipset(null, null, 16, 16, 1, 1);
            }
            this.chipset_ = chipset;
            this.sx_ = sx;
            this.sy_ = sy;
            //this.sprite_.swapTexture(chip.texture);
            //this.sprite_.srcWidth = this.width;
            //this.sprite_.srcHeight = this.height;
        }
        //
        // * Character center x-coordinate;
        //
        public get centerX(): number {
            return this.screenX + this.width / 2;
        }
        //
        // * Character center y-coordinate;
        //
        public get centerY(): number {
            return this.screenY + this.height / 2;
        }
        //
        // * Character render x-coordinate;
        //
        public get screenX(): number {
            return this.x_ - (this.width % this.map_.gridWidth) / 2 + this.offsetX * this.map_.gridWidth;
        }
        //
        // * Character render y-coordinate;
        //
        public get screenY(): number {
            return this.y_ + this.map_.gridHeight - this.height + this.offsetY * this.map_.gridHeight;
        }
        //
        // * Character systematic x-coordinate;
        //
        public get x(): number {
            return this.x_;
        }
        //
        // * Character systematic y -coordinate;
        //
        public get y(): number {
            return this.y_;
        }
        //
        // * Character hit area;
        //
        public hitRect(): any {

            // TODO Rectangle?
            //new Rectangle((this.x + this.chipset_.hitRect.left, this.y + this.chipset_.hitRect.top, this.chipset_.hitRect.width, this.chipset_.hitRect.height);
            return null;
        }
        //
        // * Character width;
        //
        public get width(): number {
            if (this.chipset_) {
                return this.chipset_.sizeX;
            } else {
                return this.map_.gridWidth;
            }
        }
        //
        // * Character height;
        //
        public get height(): number {
            if (this.chipset_) {
                return this.chipset_.sizeY;
            } else {
                return this.map_.gridHeight;
            }
        }

        //
        // * Divide character direction into dx, dy;
        //
        public devideDir(dir): number[] {
            var dx: number = 0;
            var dy: number = 0;
            switch (dir) {
                case 0: dy = -1;
                case 1: dx = 1;
                case 2: dy = 1;
                case 3: dx = -1;
            }
            return [dx, dy];
        }

        //
        // * Character direction from dx, dy;
        //
        public getDir(dx, dy): number {
            if (this.dirX > 0) {
                return 1;
            }
            if (this.dirX < 0) {
                return 3;
            }
            if (this.dirY > 0) {
                return 2;
            }
            if (this.dirY < 0) {
                return 0;
            }
            return 0;
        }

        //
        // * Set character's direction;
        //
        public setDir(dir: number): void {
            var t: number[] = this.devideDir(dir);
            this.dirX = t[0];
            this.dirY = t[1];
        }

        //
        // * Set character's direction facing to target;
        //
        public faceTo(target: Character): void {
            var tx: number = target.mapX - this.mapX;
            this.dirX = 0;
            this.dirY = 0;
            if (tx > 0) {
                this.dirX = 1;
            }
            if (tx < 0) {
                this.dirX = -1;
            }
            var ty: number = target.mapY - this.mapY;
            if (ty > 0) {
                this.dirY = 1;
            }
            if (ty < 0) {
                this.dirY = -1;
            }
            if (Math.abs(tx) > Math.abs(ty)) {
                this.dirY = 0;
            } else {
                this.dirX = 0;
            }
        }
        //
        // * Character direction;
        //
        public getCurrentDir(): number {
            return this.getDir(this.dirX, this.dirY);
        }
        //
        // * Whether the chracte can go through selected tile or not;
        //     map             : map object;
        //     vx                 : x component of character speed;
        //     vy                 : y component of character speed;
        //
        public isPassable(vx: number, vy: number): bool {
            // hit direction for the chip where the character exists;
            var dir1: number = 0;
            if (vx > 0) {
                dir1 += CollisionType.RIGHT;
            }
            if (vx < 0) {
                dir1 += CollisionType.LEFT;
            }
            if (vy > 0) {
                dir1 += CollisionType.DOWN;
            }
            if (vy < 0) {
                dir1 += CollisionType.UP;
            }
            // hit direction for the chip where the character is going to go;
            var dir2: number = 0;
            if (vx > 0) {
                dir2 += CollisionType.LEFT;
            }
            if (vx < 0) {
                dir2 += CollisionType.RIGHT;
            }
            if (vy > 0) {
                dir2 += CollisionType.UP;
            }
            if (vy < 0) {
                dir2 += CollisionType.DOWN;
            }
            if (vx != 0 && vy != 0) {
                // hit direction for the chip where the character is going to go;
                var dir3: number = 0;
                if (vx > 0) {
                    dir3 += CollisionType.LEFT;
                }
                if (vx < 0) {
                    dir3 += CollisionType.RIGHT;
                }
                if (vy > 0) {
                    dir3 += CollisionType.DOWN;
                }
                if (vy < 0) {
                    dir3 += CollisionType.UP;
                }
                // hit direction for the chip next to the chip where the character is going to go;
                var dir4: number = 0;
                if (vx > 0) {
                    dir4 += CollisionType.RIGHT;
                }
                if (vx < 0) {
                    dir4 += CollisionType.LEFT;
                }
                if (vy > 0) {
                    dir4 += CollisionType.UP;
                }
                if (vy < 0) {
                    dir4 += CollisionType.DOWN;
                }
                return !((this.map_.isObstacle(this, this.mapX_, this.mapY_, dir1)) || 
                         (this.map_.isObstacle(this, this.mapX_ + vx, this.mapY_, dir3)) || 
                         (this.map_.isObstacle(this, this.mapX_, this.mapY_ + vy, dir4)) ||    
                         (this.map_.isObstacle(this, this.mapX_ + vx, this.mapY_ + vy, dir2)));
            } else {
                !((this.map_.isObstacle(this, this.mapX_, this.mapY_, dir1)) || (this.map_.isObstacle(this, this.mapX_ + vx, this.mapY_ + vy, dir2)));
            }
        }
        //
        // * Character Interval Running?
        //
        public get isRunning(): bool {
            return !(this.moveInterval_.isDone && this.waitInterval_.isDone);
        }

        //
        // * Character Movement;
        //     time            : require frame to execute this interval;
        //     vx                 : x component of character speed;
        //     vy                 : y component of character speed;
        //
        public moveInterval(time: number, vx: number, vy: number): interval.IInterval {
            var tx: number = 0;
            var ty: number = 0;
            return new interval.Parallel([
                new interval.Func(() => {
                    tx = this.x_;
                    ty = this.y_;
                }),
                new interval.Lerp(time, 0, vx * time, "linear", (v) => {
                    this.x_ = v + tx;
                }),
                new interval.Lerp(time, 0, vy * time, "linear", (v) => {
                    this.y_ = v + ty;
                })
            ]);
        }

        //
        // * Character Walk;
        //
        public walkInterval(time: number, vx: number, vy: number): interval.IInterval {
            return new interval.Parallel([
                this.moveInterval(time, vx, vy)
            ]);
        }

        //
        // * Collision between character and map;
        //
        public collide(vx: number, vy: number): number[] {
            if (!this.isPassable(vx, vy)) {
                vx = 0;
                vy = 0;
            }
            return [vx, vy];
        }

        //
        // * Check character state;
        //
        public checked(object: Character): void {
            this.checkedObjects_.push(object);
        }

        //
        // * Already be checked or not;
        //
        public isChecked(object: Character): bool {
            return this.checkedObjects_.indexOf(object) != -1;
        }

        //
        // * Get current direction;
        //
        public dir(): number {
            return this.getDir(this.dirX, this.dirY);
        }

        //
        // * Touch character state;
        //
        public touched(object: Character): void {
            this.touchedObjects_.push(object);
        }

        //
        // * Already be touched or not;
        //
        public isTouched(object: Character): bool {
            return this.touchedObjects_.indexOf(object) != -1;
        }

        //
        // * Reset character state;
        //
        public reset(): void {
            this.checkedObjects_ = [];
            this.touchedObjects_ = [];
        }

        //
        // * Character Update;
        //
        public update(): void {
            this.animate();
            // TODO
            this.moveInterval_.update(1);
            this.waitInterval_.update(1);
        }
        
        public animate(): void {
            if (this.speed_ <= 8 && (this.stayAnime || (!this.moveInterval_.isDone && this.moveAnime))) {
                this.walkCounter_ += 1;
                if (this.walkCounter_ >= (8 / this.speed_)) {
                    this.walkCounter_ = 0;
                    var t: number = this.frameNo + this.walkAnimeDir_;
                    if (t < 0 || t >= this.chipset_.animationFrameNumber ) {
                        this.walkAnimeDir_ *= -1;
                    }
                    this.frameNo += this.walkAnimeDir_;
                }
            } else {
                if (this.moveAnime) {
                    if (this.frameNo > this.chipset_.defaultFrameNo) {
                        this.walkAnimeDir_ = -1;
                    } else {
                        this.walkAnimeDir_ = 1;
                    }
                    this.frameNo = this.chipset_.defaultFrameNo;
                    this.walkCounter_ = 0;
                }
            }
        }
        //
        // * Input keys;
        // * keys            :input keyboard keys;
        //
        public inputKeys(keys: number[]): any {
                if (this.isRunning) {
                    return;
                }

                if (this.pause) {
                    return;
                }
                
                var vx: number = 0;
                var vy: number = 0;
                keys.forEach((key: number) => {
                    switch(key) {
                        case 1: vy = -1;
                        case 2: vy =-1;
                        case 4: vx = -1;
                        case 8: vx = 1;
                    }
                });
                
                this.setMovement(vx, vy);
        }

        //
        // *    Set character's Wait;
        //
        public setWait(wait: number): void {
            this.waitInterval_ = new interval.Wait(wait);
        }

        //
        // *    Set character's Movement;
        //
        public setMovement(vx: number, vy: number, options = {}): bool {
            if (vx == 0 && vy == 0) {
                return false;
            }

            // Round number
            vx = (vx > 1) ? 1 : vx;
            vx = (vy > 1) ? 1 : vy;

            // Set direction
            if (!this.dirFix) {
                if (vy != 0) {
                    this.dirX = 0;
                    this.dirY = vy;
                }
                if (vx != 0) {
                    this.dirX = vx; 
                    this.dirY = 0;
                }
            }

            // Remove this character from map to avoid self-collision
            this.map_.removeObject(this.mapX_, this.mapY_, this);
            //this.map_.setObjectCollision(this.mapX_, this.mapY_, this.map_.getChipCollision(this.mapX_, this.mapY_));
            
            // Check x-direction collision
            vx = this.collide(vx, 0)[0];
            
            // Check y-direction collision
            vy = this.collide(0, vy)[1];

            // Check xy-direction collision
            var t: number[] = this.collide(vx, vy);
            vx = t[0];
            vy = t[1];

            //this.map_.setObjectCollision(this.mapX_ + vx, this.mapY_ + vy, CollisionType.ALL);
            if (vx == 0 && vy ==0) {
                this.map_.setObject(this.mapX_, this.mapY_, this);
                if (!this.moveInterval_.isDone) {
                    // TODO
                    this.moveInterval_.update(1);
                }
                return false;
            } else {
                this.mapX_ += vx;
                this.mapY_ += vy;

                this.map_.setObject(this.mapX_, this.mapY_, this);

                // walk interval
                // touch interval
                var intervals: interval.interval.IInterval[] = [
                    this.walkInterval(
                        this.map_.gridWidth / this.speed_, 
                        vx * this.speed_, 
                        vy * this.speed_
                    ),
                    new interval.Func(() => {
                        var t = this.map_.getObject(this.mapX_, this.mapY_);
                        if (t) {
                            t.touched(this);
                        }
                    })
                ];
                // If option is specified, add after-interval
                if(options['afterInterval']) {
                    intervals.push(options['afterInterval']);
                }
                this.moveInterval_ = new interval.Sequence(intervals);

                if (!this.moveInterval_.isDone) {
                    // TODO
                    this.moveInterval_.update(1);
                }
                return true;
            }
        }

        //
        // * Reset Character;
        //
        public resetPosition(): void {
            //this.pause = false;
            this.moveInterval_ = interval.Empty;
            this.waitInterval_ = interval.Empty;
            this.x_ = this.mapX_ * this.map_.gridWidth;
            this.y_ = this.mapY_ * this.map_.gridHeight;
        }

        //
        // * Render Character;
        //        s             : Destination Texture;
        //        dx            : offset x;
        //        dy            : offset y;
        //
        /*
        public render(s, dx, dy): any {
            if !(this.chipset_ && this.visible) {
                return;
            }
            
            this.chipset_.render(s, this.screenX + dx, this.screenY + dy, this.sx_, this.sy_, this.frameNo, this.getCurrentDir, :alpha => this.alpha);
        }
        */
    }
}
