(function(){
	var getBackgroundAssetPath = anivid.util.getBackgroundAssetPath;

	Background = function(canvas){
		this.canvas = canvas;
		this.activeBackgroundKey = null;
		this.activeBackground = null;
	}

	Background.prototype.setBackgroundKey = function(backgroundKey){
		this.backgroundKey = backgroundKey;
	}

	Background.prototype.remove = function(){
		this.canvas.remove(this.activeBackground);
	}

	Background.prototype.addToCanvas = function(){
			var that = this;
			var fn = function(background){
					that.canvas.add(background);
					background.selectable = false;

					if(that.activeBackground){
						that.canvas.remove(that.activeBackground);
					}
					
					that.activeBackgroundKey = that.backgroundKey;
					that.activeBackground = background;
				};

			if(this.backgroundKey != this.activeBackgroundKey){
				if(bg = anivid.assetManager.imageAssets[this.backgroundKey]){
					console.log('getting bg from cache');
					fn(bg);
				}
				else{
					console.log('fetching bg from internet');
					fabric.Image.fromURL(getBackgroundAssetPath(this.backgroundKey), fn);
				}
			}
			
	};

	return anivid.Background = Background;

})()