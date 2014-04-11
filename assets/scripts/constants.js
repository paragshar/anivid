(function(){
	var ASSETS_LOCATION = "assets/";
	var BACKGROUNDS_LOCATION = ASSETS_LOCATION + "backgrounds/";
	var CHARACTERS_LOCATION = ASSETS_LOCATION + "characters/";
	var COMMONS_LOCATION = ASSETS_LOCATION + "common/";
	var CANVAS_WIDTH = 636;
	var CANVAS_HEIGHT = 400;

	if(anivid){
		anivid.constant = {
			ASSETS_LOCATION : ASSETS_LOCATION,
			BACKGROUNDS_LOCATION : BACKGROUNDS_LOCATION,
			CHARACTERS_LOCATION : CHARACTERS_LOCATION,
			COMMONS_LOCATION : COMMONS_LOCATION,
			CANVAS_WIDTH : CANVAS_WIDTH,
			CANVAS_HEIGHT : CANVAS_HEIGHT
		}
	}else{
		console.error("anivid not defined, can't set constants. Exiting :(");
	}
	
})()