(function(){

	var getLoadingAssetPath = anivid.util.getLoadingAssetPath;

	var Loading = function () {
	    this.loadingImage = null;
	    this.rotation = 0;
	    this.loadingImageAddedToCanvas = null;
	}

	Loading.prototype.LoadContent = function () {
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

	Loading.prototype.update = function (time) {
		this.rotation = this.rotation + time/100;
		if(this.rotation >=360)
			this.rotation = 0;
	};

	Loading.prototype.draw = function () {
		if(this.loadingImageAddedToCanvas)
			anivid.player.canvas.remove(this.loadingImageAddedToCanvas);

		if(this.loadingImage){
			this.loadingImage.set({angle:this.rotation});
			anivid.player.canvas.add(this.loadingImage);
			this.loadingImageAddedToCanvas = this.loadingImage;
		}
	};

	return anivid.player.Loading = Loading;
})()
