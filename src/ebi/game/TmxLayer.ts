/// <reference path='../../cc/cocos2d.d.ts' />
/// <reference path='../IDrawable.ts' />

module ebi.game {

    export class TmxLayer implements IDrawable {
        private id_: number;
        private z_: number = 0;
        private ccTmxLayer_: cc.TMXLayer = null;

        constructor(ccTmxLayer: cc.TMXLayer) {
            var id = DisplayObjects.add(this);
            this.id_ = id;
            this.z = 0;

            this.ccTmxLayer_ = ccTmxLayer;
            this.ccTmxLayer_.setTag(this.id_);
        }

        public get z(): number {
            return this.z_;
        }

        public set z(z) {
            if (this.z_ !== z) {
                this.z_ = z;
                DisplayObjects.addDrawableToReorder(this);
            }
        }

        public get innerObject(): cc.TMXLayer {
            return this.ccTmxLayer_;
        }
        
        public dispose(): void {
            DisplayObjects.remove(this);
        }
    }

}
