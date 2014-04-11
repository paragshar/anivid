(function(){
	var assetManager = new AssetManager();
	var getCharacterAssetKey = anivid.util.getCharacterAssetKey;
	var getCharacterAssetPath = anivid.util.getCharacterAssetPath;
	var getBackgroundAssetPath = anivid.util.getBackgroundAssetPath;
	var mainTheme;
	var gameTheme;

	anivid.LoadGUIAssets = function(scenesData){
		
		scenesData.forEach(function(sceneData){
			var background = sceneData.background.backgroundKey;
			assetManager.QueueDownload(background, getBackgroundAssetPath(background));
			
			var objects = sceneData.objects;
			objects.forEach(function(object){
				if(object.type == 'Character'){
					for(var i = 0; i < object.nFrames; i++){
						var options = {name: object.name, action:object.action, emotion:object.emotion, speaking: object.speaking, frameIndex:i};
						var key = getCharacterAssetKey(options);
						var path = getCharacterAssetPath(options);
						assetManager.QueueDownload(key, path);
					}
				}
			});
		});
		
		assetManager.DownloadAll();
	}

	function AssetManager() {
		  this.downloadQueue = [];
		  this.downloadSoundsQueue = [];
		  this.successCount = 0;
		  this.errorCount = 0;
		  this.imageAssets = new Array();
		  this.gameSprites = new Array();
		  this.videoSounds = new Array();
		  this.webkitWorking = true;
		  try
		  {
			this.audioContext = new webkitAudioContext();
		  }
		  catch(e)
		  {
			this.webkitWorking = false;
		  }
		  this.soundI = 0;
	}

	AssetManager.prototype.QueueDownload = function(name,path) {
		this.downloadQueue.push([name,path]);
	}

	AssetManager.prototype.QueueSound = function(name,path,onLoadHandler) {
		this.downloadSoundsQueue.push([name,path,onLoadHandler]);
	}

	AssetManager.prototype.DownloadAll = function(downloadCallback) {
		var _self = this;
		//Images
		for (var i = 0; i < this.downloadQueue.length; i++){
			var path = this.downloadQueue[i][1];

			fabric.loadSVGFromURL(path, (function(index){
					return function(objects, options){
						var characterImg;
						if (objects.length > 1) {
							characterImg = new fabric.PathGroup(objects, options);
						} else {
							characterImg = objects[0];
						}
						_self.successCount += 1;
						_self.imageAssets[_self.downloadQueue[index][0]] = characterImg;
					};
			})(i));
		}
		
		//Sounds
		// for (var i = 0; i < this.downloadSoundsQueue.length;i++) 
		// 	this.LoadSound(this.downloadSoundsQueue[i][1],_self.downloadSoundsQueue[i][0]);
	}

	AssetManager.prototype.LoadSound = function(url,index) {
		var _self = this;
		var request = new XMLHttpRequest();
		
		request.open('GET',url, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function(a) {
			if(_self.webkitWorking)
			{
				_self.audioContext.decodeAudioData(request.response, function(buffer) {
				_self.videoSounds[index] = new Sound(buffer);
				_self.successCount += 1;
				});
			}
			else
			{
				_self.videoSounds[index] = new Audio(url);//Sound(a.target.response);
				_self.successCount += 1;
			}
		}
			
		request.send(null);
	}

	AssetManager.prototype.IsDone = function() {
		return ((this.downloadSoundsQueue.length + this.downloadQueue.length) == (this.successCount + this.errorCount));
	}

	AssetManager.prototype.GetImage = function(name){
		return this.imageAssets[name];
	}

	AssetManager.prototype.GetSound = function(name){
		return this.videoSounds[name];
	}

	AssetManager.prototype.PlaySound = function(name,loop) {
	  var sound = this.gameSounds[name];
	  if(this.webkitWorking)
	  {
		  sound.source = this.audioContext.createBufferSource(); // creates a sound source
		  sound.source.buffer = sound.buffer;                    // tell the source which sound to play
		  if(loop != undefined)
			sound.source.loop = loop;
		  sound.source.connect(this.audioContext.destination);       // connect the source to the context's destination (the speakers)
		  sound.isPlaying = true;
		  sound.source.noteOn(0);                          // play the source now
	  }
	  else
	  {
		sound.play();                          // play the source now
	  }
	}

	AssetManager.prototype.PauseSound = function(name) {
	  var sound = this.gameSounds[name];
	  if(sound != undefined)
	  {
		if(this.webkitWorking)
		{
		  if(sound.isPlaying)
			sound.source.noteOff(0);
		}
		else
		{
			sound.pause();
		}
	   }
	}

	return anivid.assetManager = assetManager;

})();
