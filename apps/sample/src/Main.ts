///<reference path='rpg2d.ts'/>
///<reference path='Scene_Title.ts'/>

/**
 * Starting point of the application
 */
function main(config) {
	rpg2d.SceneDirector.runWithScene(new Scene_Title(), config);
}