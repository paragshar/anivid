(function(){

	var getLoadingAssetPath = anivid.util.getLoadingAssetPath;

	var Ending = function () {
	    this.loadingImage = null;
	    this.rotation = 0;
	    this.loadingImageAddedToCanvas = null;
	}

	Ending.prototype.LoadContent = function () {
		var that = this;
		var path = anivid.constant.COMMONS_LOCATION + "loading.svg";
		fabric.loadSVGFromURL(path, function(objects, options){
			var characterImg;
			if (objects.length > 1) {
				characterImg = new fabric.PathGroup(objects, options);
			} else {
				characterImg = objects[0];
			}
			
			that.loadingImage = characterImg;
			that.loadingImage.set({left:350, top:150});
		});
	};

	Ending.prototype.update = function (time) {
		this.rotation = this.rotation + time/10;
	};

	Ending.prototype.draw = function () {
		if(this.loadingImageAddedToCanvas)
			anivid.player.canvas.remove(this.loadingImageAddedToCanvas);

		if(this.loadingImage){
			this.loadingImage.set({angle:this.rotation});
			anivid.player.canvas.add(this.loadingImage);
			this.loadingImageAddedToCanvas = this.loadingImage;
		}
	};

	return anivid.player.Ending = Ending;
})()
