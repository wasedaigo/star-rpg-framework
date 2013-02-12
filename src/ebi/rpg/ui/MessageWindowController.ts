/// <reference path='./MessageWindow.ts' />
/// <reference path='../map/Map.ts' />
/// <reference path='../map/MapCharacter.ts' />

module ebi.rpg.ui {
    export class MessageWindowController
    {
        private messageWindow_: MessageWindow = null;
        private map_: rpg.map.Map;

        constructor(map: rpg.map.Map) {
            this.map_ = map;
        }

        public showMessage(mapCharacter: rpg.map.MapCharacter, text: string): void {
            if (this.messageWindow_) {
                this.messageWindow_.dispose();
            }
            this.messageWindow_ = new MessageWindow([100, 50]);
            this.messageWindow_.x = mapCharacter.screenX + this.map_.scrollX;
            this.messageWindow_.y = mapCharacter.screenY + this.map_.scrollY;
            this.messageWindow_.showText(text);  
        }

        public hideMessage(mapCharacter: rpg.map.MapCharacter, text: string): void {
            this.messageWindow_.dispose();
            this.messageWindow_ = null;
        }            
    }
}
