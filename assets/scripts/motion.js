(function(){
	
	/**
		type : enter/movement/exit
	**/
	var Motion = function(type){
		this.type = type;
		this.movement = {};
		this.movement.lastsForWholeScene = true;
	}

	/**
		timing : with-previous/after-previous
		style : slide, pop, etc.
		direction : applicable if style is slide, possible values can be btt, ttb, ltr, rtl(right to left), 
		rttrb(right-top to right-bottom), etc
	**/
	Motion.prototype.setMovement = function(options){
		if(options.duration)
			this.movement.lastsForWholeScene = false;
		
		this.movement.timing = options.timing;
		this.movement.referenceCharacter = options.referenceCharacter;
		this.movement.delay = options.delay;
		this.movement.duration = options.duration;
		this.movement.style = options.style;
		this.movement.direction = options.direction;
	}

	return anivid.Motion = Motion;

})();