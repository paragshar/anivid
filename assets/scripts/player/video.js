var anivid = anivid || {};
anivid.player = anivid.player || {};

window.requestAnimFrame = (function (callback) {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) 
            {
                window.setTimeout(callback, 1000 / 60);
            };
})();

if(!anivid.player.canvas)
	anivid.player.canvas = new fabric.StaticCanvas('preview');

anivid.player.scenesData = null;
anivid.player.activeScene = null;
anivid.player.activeSceneData = null;
anivid.player.activeSceneIndex = -1;
anivid.player.allScenesOver = false;

var date = new Date();
anivid.player.videoStartTime = null;
anivid.player.activeSceneStartTime = null;

anivid.player.firstSceneLoaded = false;

anivid.player.preview = function(){
	$.get('data.json', function(response){
		anivid.player.scenesData = response;
		var date = new Date();
	    this.videoStartTime = date.getTime();
		anivid.LoadGUIAssets(anivid.player.scenesData);
		
		anivid.player.loadingScene = new anivid.player.Loading();
		anivid.player.endingScene = new anivid.player.Ending();
		anivid.player.loadScene(anivid.player.loadingScene);
		anivid.player.loop(anivid.player.videoStartTime);
	});
}

anivid.player.loop = function(lastTime){
	var that = this;
	var date = new Date();
    var time = date.getTime();
    var timeDiff = time - lastTime;

    if(anivid.assetManager.IsDone()){
		if(!anivid.player.firstSceneLoaded){
			anivid.player.activeSceneStartTime = time;
			anivid.player.activeSceneIndex = 0;
			this.prepareActiveScene();
			anivid.player.firstSceneLoaded = true;
		}
	}else{
		console.log('asset manager is not yet done');
	}

	anivid.player.update(time, lastTime);
    anivid.player.draw();

    requestAnimFrame(function () {
		if(!that.allScenesOver){
			that.loop(time);
		}
			
	});
};

anivid.player.draw = function(){
	if(this.activeScene){
		this.activeScene.draw();
	}else if(this.loadingScene){
		this.loadingScene.draw();
	}else if(this.endingScene){
		this.endingScene.draw();
	}
};

anivid.player.prepareActiveScene = function(time){
	this.activeScene = new anivid.Scene(anivid.player.canvas);
	var sceneData = this.scenesData[this.activeSceneIndex];
	var durationType = sceneData.durationType;
	if(durationType == 'fitToAllSceneContent'){
		this.activeScene.setBackgroundKey(sceneData.background.backgroundKey);
		var objects = sceneData.objects;
		objects.forEach(function(object){
			if(object.type == 'Character'){
				var character = new Character({
					canvas: anivid.player.canvas, 
					name: object.name, 
					action: object.action, 
					emotion: object.emotion,
					speaking : object.speaking, 
					nFrames: object.nFrames, 
					looking: object.looking, 
					defaultSpeed: object.defaultSpeed
				});
				character.setProperties(object);
				character.initMotions();
				anivid.player.activeScene.addCharacter(character);
			}
		});
	}
};

anivid.player.update = function(time, lastTime){
	if(this.activeSceneIndex > -1 && this.activeScene && time-this.activeSceneStartTime >= this.activeScene.duration*1000){
		//scene over, transitioning to new scene
		this.loadingScene = null;
		if(this.activeSceneIndex < this.scenesData.length -1){
			this.activeSceneIndex++;
			this.activeSceneStartTime = date.getTime();
			this.prepareActiveScene(time);
		}else{
			//all scenes over
			this.allScenesOver = true;
			this.activeScene = null;
		}
	}else if(this.activeSceneIndex > -1 && this.activeScene && time-this.activeSceneStartTime < this.activeScene.duration*1000){
		//running scene
		// this.activeScene.objects.forEach(function(obj){
		// 	obj.update(time-lastTime);
		// });
		this.activeScene.update(time-lastTime);
		
	}else if(this.loadingScene){
		console.log('still loading');
		this.loadingScene.update(time - lastTime);
	}else{
		// this.endingScene.update(time - lastTime);
	}
};

anivid.player.loadScene = function (scene) {
	scene.LoadContent();
};


