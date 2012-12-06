/// <reference path='./cocos2d.d.ts' />
/// <reference path='./ebi.ts' />

module ebi {

    export module game {

        /*
         * Audio
         */
        export class Audio {
            private static audioEngine_ = cc.AudioEngine.getInstance();;

            public static playMusic(path: string, repeat: bool): void {
                audioEngine_.playMusic(path, repeat);
            }

            public static stopMusic(): void {
                audioEngine_.stopMusic();
            }

            public static playEffect(path: string, repeat: bool): string {
                return audioEngine_.playEffect(path, repeat);
            }

            public static stopEffect(id: string): void {
                audioEngine_.stopEffect(id);
            }   
        }

    }

}
