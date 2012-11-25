///<reference path='rpg2d.ts'/>
///<reference path='Scene_Title.ts'/>

/**
 * Starting point of the application
 */
function main(config) {
// enable High Resource Mode(2x, such as iphone4) and maintains low resource on other devices.
//     director->enableRetinaDisplay(true);

    // turn on display FPS
    rpg2d.SceneDirector.setDisplayStats(config['showFPS']);

    // set FPS. the default value is 1.0/60 if you don't call this
    rpg2d.SceneDirector.setAnimationInterval(1.0 / config['frameRate']);

	rpg2d.SceneDirector.runWithScene(new Scene_Title(), config);
}
