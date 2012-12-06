/// <reference path='./cocos2d.d.ts' />
/// <reference path='./ebi.ts' />

module ebi {

    module game {

        /*
         * Audio: Singleton class
         */
        export class Audio {
            private static _instance: Audio = null;
            private audioEngine_;

            constructor() {
                this.audioEngine_ = cc.AudioEngine.getInstance();
            }

            public static get instance():Audio {
                if (!Audio._instance) {
                    Audio._instance = new Audio();
                }
                return Audio._instance;
            }

            public playMusic(path: string, repeat: bool): void {
                this.audioEngine_.playMusic(path, repeat);
            }

            public stopMusic(): void {
                this.audioEngine_.stopMusic();
            }

            public playEffect(path: string, repeat: bool): string {
                return this.audioEngine_.playEffect(path, repeat);
            }

            public stopEffect(id: string): void {
                this.audioEngine_.stopEffect(id);
            }   
        }

    }

}
