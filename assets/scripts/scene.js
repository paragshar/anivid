(function(){

	Scene = function(canvas){
		this.objects = [];
		this.background = null;
		this.backgroundKey = null;
		this.defaultDuration = 5;
		this.duration = 5;
		this.customDurationTime = 0;
		this.durationType = 'fitToAllSceneContent';
		this.canvas = canvas;
		this.characterSelected = null;
		this.startTime = null;
		this.speakingCharacter = null;
		this.init();
	}

	Scene.prototype.init = function(){
		this.background = new anivid.Background(this.canvas);
	}

	Scene.prototype.unloadContent = function(){
		if(this.background)
			this.background.remove();
		this.objects.forEach(function(obj){
			obj.remove();
		});
	}

	Scene.prototype.setBackgroundKey = function(backgroundKey){
		this.backgroundKey = backgroundKey;
		this.background.setBackgroundKey(backgroundKey);
		this.attachBackground();
	}

	Scene.prototype.attachBackground = function(){
		if(this.background){
			this.background.addToCanvas();
		}
	}

	Scene.prototype.addCharacter = function(object){
		this.objects.push(object);
	}

	Scene.prototype.setCustomDuration = function(seconds){
		this.customDurationTime = seconds;
	}

	Scene.prototype.setDurationType = function(type, duration){
		if(type == 'fitToAllSceneContent'){
			this.durationType = 'fitToAllSceneContent';
		}else if(type == 'fitToAllSpeechDuration'){
			this.durationType = 'fitToAllSpeechDuration';
		}else if(type == 'custom'){
			this.durationType = 'custom';
			this.setCustomDuration(duration);
		}
	}

	Scene.prototype.onCharacterSelected = function(character){
		this.characterSelected = character;
		anivid.onCharacterSelected(character);
	}

	Scene.prototype.onCharacterDeselected = function(){
		this.characterSelected = null;
		anivid.onCharacterDeselected();
	}

	Scene.prototype.draw = function(){
		this.objects.forEach(function(obj){
			if(obj instanceof Character){
				obj.draw();
			}
			
		});
	}

	Scene.prototype.update = function(timeDiff){
		this.objects.forEach(function(obj){
			if(obj instanceof Character){
				obj.update(timeDiff);
			}
			
		});
	}

	return anivid.Scene = Scene;
 
})()