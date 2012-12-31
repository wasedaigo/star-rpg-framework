/// <reference path='./MapCharacter.ts' />
module ebi.rpg {
    export class MapCamera {
        private static focusX_: number;
        private static focusY_: number;
        public static focusTarget: MapCharacter;
        public static update(): void {
            if (focusTarget) {
                focusX_ = focusTarget.x;
                focusY_ = focusTarget.y;
            }
        }

        public static get focusX(): number {
            return focusX_;
        }

        public static get focusY(): number {
            return focusY_;
        }
    }
}
