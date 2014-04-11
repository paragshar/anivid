var anivid = anivid || {};
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

if(!anivid.canvas)
	anivid.canvas = new fabric.Canvas('fabcon');

anivid.scenes = [];
anivid.activeScene = undefined;
anivid.counter = 0;

anivid.createScene = function(){
	var scene = new anivid.Scene(anivid.canvas);
	this.loadScene(scene);
}

anivid.loadScene = function(scene){
	if(anivid.activeScene){
		anivid.activeScene.unloadContent();
	}
	anivid.scenes.push(scene);
	anivid.activeScene = scene;
}

anivid.addBackgroundToActiveScene = function(backgroundKey){
	anivid.activeScene.setBackgroundKey(backgroundKey);
}

anivid.addCharacterToActiveScene = function(options){
	options.canvas = anivid.canvas;
	var character = new anivid.Character(options);
	anivid.activeScene.addCharacter(character);
}

anivid.onCharacterSelected = function(character){
	console.log('char select');
}

anivid.onCharacterDeselected = function(){
	console.log('char deselect');
}

anivid.addMotionToActiveCharacter = function(options){
	var entryMotion = new anivid.Motion('enter');
	var exitMotion = new anivid.Motion('exit');
	if(!options){
		entryMotion.setMovement({duration:2, timing:'with-previous', style:'slide', direction:'ttb'});
		exitMotion.setMovement({duration:1, timing:'with-previous', style:'slide', direction:'rtl'});
	}
	if(anivid.activeScene.characterSelected){
		anivid.activeScene.characterSelected.motions.push(entryMotion);
		anivid.activeScene.characterSelected.motions.push(exitMotion);
	}
}

anivid.addNarrationToActiveCharacter = function(options){
	if(anivid.activeScene.speakingCharacter)
		anivid.activeScene.speakingCharacter.speaking = false;

	anivid.activeScene.characterSelected.speaking = true;
	anivid.activeScene.speakingCharacter = anivid.activeScene.characterSelected;
	if(!options){
		
	}
}

anivid.prepare = function(){
	var data = JSON.stringify(anivid.scenes);
	$.post('video.php', {data:data}, function(response){
		// console.log(response);
	});
}

anivid.loop = function(lastTime){
	anivid.counter++;
	var date = new Date();
    var time = date.getTime();
    var timeDiff = time - lastTime;
    if(anivid.activeScene){
    	this.update(timeDiff);
	    this.draw();
	    that = this;
    }

    requestAnimFrame(function () {
			// if(anivid.counter < 100)
				anivid.loop(time);
	});
	    
};

anivid.update = function(timeDiff){
	anivid.activeScene.update(timeDiff);
};

anivid.draw = function(){
	anivid.activeScene.draw();
}

var date = new Date();
var time = date.getTime();
anivid.loop(time);