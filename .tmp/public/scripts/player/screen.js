(function(){
	var Screen = function(name, stage, screenManager, isPopup,background) {
	    //Attributes
		this.index = -1;
		this.name = name;
	    this.stage = stage;
	    this.screenManager = screenManager;
	    this.isPopup = isPopup;
	    this.isExit = false;
	    this.coveredByOtherScreen = false;
		this.isPopupHidden;
		this.guiElements = new Array();
		this.background = background;
	}

	/*
	 * Gets the covered by other screen status.
	 * @return Boolean variable to determine whether the screen is covered by other screen or not.
	 * */
	Screen.prototype.GetCoverByOtherScreen = function () {
	    return this.coveredByOtherScreen;
	};

	/*
	 * Sets the covered by other screen status.
	 * @param Boolean variable to set the screen covered by other screen.
	 * */
	Screen.prototype.SetCoverByOtherScreen = function (value) {
	    this.coveredByOtherScreen = value;
	};

	/*
	 * Loads all the assets related to this screen.
	 * */
	Screen.prototype.LoadContent = function () {
	};

	/*
	 * Clears and removed all the unnecesary stuff.
	 * */
	Screen.prototype.UnloadContent = function () {
		var shapes = this.layer.getShapes();
		var prueba = new Array();
		console.log('clearing');
		//Clear screen
	    this.layer.clear();
		
		//Remove shapes
	    for (i in shapes)
		{
			if(shapes[i].name != undefined)
			{
				if(shapes[i].name != this.name)
					prueba.push(shapes[i]);
			}
			
			this.layer.remove(shapes[i]);
		}
		
		for(i in prueba)
			this.layer.add(prueba[i]);
			
		prueba.length = 0;
	};

	/*
	 * Update all the logic stuff.
	 * @param{Time} Current time.
	 * */
	Screen.prototype.Update = function (time) {
		var mousePos = this.stage.getMousePosition();
		
		document.body.style.cursor = 'default';
		for (i in this.guiElements)
			this.guiElements[i].Update(time,mousePos);	
	};

	/*
	 * Draws the screen elements.
	 * */
	Screen.prototype.Draw = function () {
		var context = this.layer.getContext();
		var canvas = this.layer.getCanvas();

		//Draw veil
		if(this.isPopup)
		{
			context.beginPath();
	        context.rect(0,0,canvas.width,canvas.height);     
	        context.fillStyle = "rgba(84, 39, 108,0.6)";
	        context.fill();
		}
		
		//background
		if(this.background != undefined)
			context.drawImage(this.background,(canvas.width/2) - (this.background.width/2),(canvas.height/2) - (this.background.height/2));
		
		for (i in this.guiElements)
			this.guiElements[i].Draw(context);	
	};

	/*
	 * Loads a new screen.
	 * $param{Screen} Initialized screen.
	 * */
	Screen.prototype.LoadScreen = function (screen) {
	    this.screens.push(screen);
	};

	/*
	 * Exits this screen.
	 * */
	Screen.prototype.Exit = function () {
	    this.isExit = true;
	};

	/*
	 * Put all the screen elements on the top -in contrast with the the rest of the screens-
	 * */
	Screen.prototype.MoveToTop = function () {
		for (i in this.guiElements)
		{
			if(this.guiElements[i].bounding != undefined)
				this.guiElements[i].bounding.moveToBottom();
		}
	};

	return anivid.player.Screen = Screen;
})
