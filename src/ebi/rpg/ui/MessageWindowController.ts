/// <reference path='./MessageWindow.ts' />
/// <reference path='../map/MapCharacter.ts' />

module ebi.rpg.ui {
    export class MessageWindowController
    {
        private messageWindow_: MessageWindow = null;
        public showMessage(mapCharacter: map.MapCharacter, text: string): void {
            if (this.messageWindow_) {
                this.messageWindow_.dispose();
            }
            this.messageWindow_ = new MessageWindow([100, 50]);
            this.messageWindow_.x = mapCharacter.screenX;
            this.messageWindow_.y = mapCharacter.screenY;
            this.messageWindow_.showText(text);  
        }

        public hideMessage(mapCharacter: map.MapCharacter, text: string): void {
            this.messageWindow_.dispose();
            this.messageWindow_ = null;
        }            
    }
}
