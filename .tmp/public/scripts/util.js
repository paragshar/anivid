(function(){
	if(!anivid.constant){
		console.error("Required constants not yet defined.");
		return;
	}

	if(!anivid.util){
		anivid.util = {};
	}

	var getCharacterAssetPath = function(options){
		options.action = (options.action) ? options.action : 'standing';
		var path = anivid.constant.CHARACTERS_LOCATION + options.name +"/"+ options.action;
		if(options.emotion)
			path = path + "-"+options.emotion;
		if(options.speaking)
			path = path + "-speaking";
		if(options.frameIndex != undefined)
			path = path + "-" + options.frameIndex;
		
		path = path + ".svg";
		return path;

		// if(options.frameIndex == undefined){
		// 	if(options.emotion)
		// 		return anivid.constant.CHARACTERS_LOCATION + options.name+"/"+options.action+"-"+options.emotion+".svg";
		// 	else
		// 		return anivid.constant.CHARACTERS_LOCATION + options.name+"/"+options.action+".svg";
		// }else{
		// 	if(options.emotion)
		// 		return anivid.constant.CHARACTERS_LOCATION + options.name+"/"+options.action+"-"+options.emotion+"-"+options.frameIndex+".svg";
		// 	else
		// 		return anivid.constant.CHARACTERS_LOCATION + options.name+"/"+options.action+"-"+options.frameIndex+".svg";
		// }
	};

	var getCharacterAssetKey = function(options){
		options.action = (options.action) ? options.action : 'standing';
		var key = anivid.constant.CHARACTERS_LOCATION + options.name +"/"+ options.action;
		if(options.emotion)
			key = key + "-"+options.emotion;
		if(options.speaking)
			key = key + "-speaking";
		if(options.frameIndex != undefined)
			key = key + "-" + options.frameIndex;
		return key;
	};

	var getBackgroundAssetPath = function(background){
		return anivid.constant.BACKGROUNDS_LOCATION + background+".svg";
	};

	var getLoadingAssetPath = function(){
		return anivid.constant.BACKGROUNDS_LOCATION + background+".svg";
	};

	var setProperties = function(object, data){
		for(propertyName in data){
			if(object.hasOwnProperty(propertyName)){
				object[propertyName] = data[propertyName];
			}else if(object.prototype.hasOwnProperty(propertyName)){
				object.prototype[propertyName] = data[propertyName];
			}
		}
	}

	var populateWithProperties = function(object, data, properties){
		if(!properties || !properties instanceof Array){
			//complete this
		}else{
			properties.forEach(function(property){
				object[property] = data[property]
			});
		}
	}

	var setPropertyToSprites = function(sprites, property, value){
			for(var j = 0; j < sprites.length; j++){
				sprites[j][property] = value;
			}
		}

	return anivid.util = {
		getCharacterAssetPath : getCharacterAssetPath,
		getCharacterAssetKey : getCharacterAssetKey,
		getBackgroundAssetPath : getBackgroundAssetPath,
		setProperties : setProperties,
		populateWithProperties : populateWithProperties,
		setPropertyToSprites : setPropertyToSprites
	}

})()