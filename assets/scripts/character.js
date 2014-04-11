(function(){
	
	var getCharacterAssetPath = anivid.util.getCharacterAssetPath;
	
	Character = function(options){
		this.type = 'Character';
		
		this.canvas = options.canvas;
		this.name = options.name;
		this.action = options.action;
		this.speaking = options.speaking;
		this.emotion = options.emotion;
		this.nFrames = options.nFrames;
		this.looking = options.looking;
		this.defaultSpeed = options.defaultSpeed;

		if(!this.looking)
			this.looking = 'right';
		/**
			Speed in pixels/sec
		**/
		if(!this.defaultSpeed){
			this.defaultSpeed = 10;
		}

		this.motions = [];
		this.currentIndex = 0;
		this.showingIndex = 0;
		this.showingCharacter = null;
		this.characterChangedAt = null;
		this.characterAnimating = true;
		this.sprites = [];
		this.walkingShadow = null;
		this.walkingShadowAddedToCanvas = null;
		this.showWalkingShadow = true;
		this.movement = 200;
		
		this.initialLeft = 0;
		this.initialTop = 0;
		this.initialScaleX = 1;
		this.initialScaleY = 1;
		this.shadowFinalLeft = null;
		this.shadowFinalTop = null;
		this.shadowFinalScaleX = 1;
		this.shadowFinalScaleY = 1;

		this.playingEntryMotion = false;
		this.entryMotionDistance = null;
		this.entryMotionSpeed = null;
		this.finalSpriteTop = null;
		this.entryMotionStartTop = null;
		this.entryMotionStartPropertiesRead = false;

		this.playingExitMotion = false;
		
		if(this.action instanceof Array){
			var actString = '';
			this.action.forEach(function(act){
				if(actString == '')
					actString = act;
				else
					actString = actString + '-' + act;
			});
			this.action = actString;
		}

		this.downloadSprites();

		if(this.action.indexOf('walking') != -1){
			this.motions.push(new anivid.Motion('movement'));
		}

		this.showingInVideo = false;
	};


	Character.prototype.setProperties = function(data){
		var that = this;
		for(propertyName in data){
			if(propertyName != 'canvas' && data.hasOwnProperty(propertyName)){
				if(propertyName == 'motion'){
					var motion = new anivid.Motion();
					for(motionProp in data['motion']){
						if(data['motion'].hasOwnProperty(motionProp)){
							motion[motionProp] = data['motion'][motionProp];
						}
					}
					this['motion'] = motion;
				}else if(propertyName == 'sprites'){
					var sprites = data['sprites'];
					this.sprites = [];
					sprites.forEach(function(sprite, i){
						var img = null;
						var key = anivid.util.getCharacterAssetKey({
																		name:data.name, 
																		action:data.action, 
																		emotion: data.emotion, 
																		speaking: data.speaking, 
																		frameIndex: i
																	});
						img = anivid.assetManager.imageAssets[key];
						// fabric.util.populateWithProperties(img, sprite);
						anivid.util.populateWithProperties(img, sprite, ['top', 'left', 'height', 'width']);
						that.sprites[i] = img;
					});

				}else{
					this[propertyName] = data[propertyName];
				}
				
			}
		}
	};

	Character.prototype.downloadSprites = function(){
		var that = this;
		for(var i = 0; i < this.nFrames; i++){
			var opt = {name:this.name, action: this.action, emotion: this.emotion, speaking: this.speaking, frameIndex: i};
			var key = anivid.util.getCharacterAssetKey(opt);

			if(!anivid.assetManager.imageAssets[key]){
				var path = getCharacterAssetPath(opt);
				fabric.loadSVGFromURL(path, (function(index){
					return function(objects, options){
						var characterImg;
						if (objects.length > 1) {
							characterImg = new fabric.PathGroup(objects, options);
						} else {
							characterImg = objects[0];
						}
						
						that.sprites[index] = characterImg;
						
						characterImg.on('mousedown', function(){
							that.characterAnimating = false;
							anivid.activeScene.onCharacterSelected(that);
						});
						characterImg.on('mouseup', function(){
							if(that.action.indexOf('walking') != -1){
								if(!that.walkingShadow){
									characterImg.clone(function(clone){
										clone.set({opacity:0.5});
										if(that.looking == 'left')
											clone.left = characterImg.left - that.movement;
										else
											clone.left = characterImg.left + that.movement;
										that.walkingShadow = clone;
										that.shadowFinalLeft = characterImg.left + that.movement;
										that.shadowFinalTop = characterImg.top;
									});
								}
								that.showWalkingShadow = true;
								
							}
						});

						that.canvas.on('mouse:down', function(e){
							var target = e.target;
							if(!target || target != that.showingCharacter)
								anivid.activeScene.onCharacterDeselected();
						});

						that.canvas.on('object:scaling', function(e){
							var target = e.target;
							if(target == that.showingCharacter){
								that.sprites.forEach(function(obj){
									obj.scaleX = target.scaleX;
									obj.scaleY = target.scaleY;
									that.initialScaleX = target.scaleX;
									that.initialScaleY = target.scaleY;
								});
							}else if(target == that.walkingShadow){
								that.shadowFinalScaleX = target.scaleX;
								that.shadowFinalScaleY = target.scaleY;
							}
						});

						that.canvas.on('object:moving', function(e){
							var target = e.target;
							if(target == that.showingCharacter){
								that.sprites.forEach(function(obj){
									obj.left = target.left;
									obj.top = target.top;
									that.initialLeft = target.left;
									that.initialTop = target.top;

								});
							}else if(target == that.walkingShadow){
								that.shadowFinalLeft = target.left;
								that.shadowFinalTop = target.top;
							}
						});
					}
				})(i));
			}else{
				this.sprites[i] = anivid.assetManager.imageAssets[key];
				console.log('found image in asset manager');
			}
			
			
		}

		this.canvas.on('mouse:down', function(e){
			var p = e.target;
			if(p != that.showingCharacter && p != that.walkingShadow){
				that.characterAnimating = true;
				if(that.walkingShadow){
					that.canvas.remove(that.walkingShadow);
					that.showWalkingShadow = false;
				}
			}
		});
	};

	Character.prototype.remove = function(){
		this.canvas.remove(this.showingCharacter);
	};

	Character.prototype.draw = function(){
		var characterImg = this.sprites[this.currentIndex];
		
		if(this.sprites.length > 1 && characterImg && this.characterAnimating){
			//several characters in sprite
			this.canvas.remove(this.showingCharacter);
			this.canvas.add(characterImg);
			this.showingCharacter = characterImg;

		}else if(characterImg && !this.showingCharacter){
			//single character in sprite
			this.canvas.add(characterImg);
			this.showingCharacter = characterImg;
		}

		if(this.walkingShadow && !this.showWalkingShadow){
			this.canvas.remove(this.walkingShadow);
			this.walkingShadowAddedToCanvas = false;
		}
		if(this.walkingShadow && !this.walkingShadowAddedToCanvas && this.showWalkingShadow){
			this.canvas.add(this.walkingShadow);
			this.walkingShadowAddedToCanvas = true;
		}
	};

	Character.prototype.initMotions = function(){
		var that = this;
		this.motions.forEach(function(motion){
			if(motion.type == 'enter'){
				that.entryMotion = motion;
			}else if(motion.type == 'exit'){
				that.exitMotion = motion;
			}
		});
	}

	Character.prototype.PlayEntryMotions = function(time, timeDiff){
		if(this.entryMotion && time < (anivid.player.activeSceneStartTime+this.entryMotion.movement.duration*1000)){
			var movement = this.entryMotion.movement;
			
			if(this.sprites.length > 0 && !this.playingEntryMotion){
				var sprite = this.sprites[0];
				this.finalSpriteTop = sprite.top;
				this.finalSpriteLeft = sprite.left;
				
				this.entryMotionTtBDistance =  sprite.height + sprite.top;
				this.entryMotionTtBSpeed = this.entryMotionTtBDistance/(movement.duration*1000);

				this.entryMotionBtTDistance =  anivid.constant.CANVAS_HEIGHT - sprite.top;
				this.entryMotionBtTSpeed = this.entryMotionBtTDistance/(movement.duration*1000);

				this.entryMotionLtRDistance = sprite.width + sprite.left;
				this.entryMotionLtRSpeed = this.entryMotionLtRDistance/(movement.duration*1000);

				this.entryMotionRtLDistance = anivid.constant.CANVAS_WIDTH-sprite.left;
				this.entryMotionRtLSpeed = this.entryMotionRtLDistance/(movement.duration*1000);
				
				
				this.entryMotionStartTop = -sprite.height;
				this.entryMotionStartLeft = -sprite.width;
				this.playingEntryMotion = true;
			}

			for(var i = 0; i < this.sprites.length; i++){
				var sprite = this.sprites[i];
				if(movement.direction == 'btt'){
					if(!this.entryMotionStartPropertiesRead){
						anivid.util.setPropertyToSprites(this.sprites, 'top', anivid.constant.CANVAS_HEIGHT);
						this.entryMotionStartPropertiesRead = true;
					}
					if(sprite.top > this.finalSpriteTop){
						sprite.top = sprite.top - this.entryMotionBtTSpeed * timeDiff;
					}
				}else if(movement.direction == 'ttb'){
					if(!this.entryMotionStartPropertiesRead){
						anivid.util.setPropertyToSprites(this.sprites, 'top', this.entryMotionStartTop);
						this.entryMotionStartPropertiesRead = true;
					}
					if(sprite.top < this.finalSpriteTop){
						sprite.top = sprite.top + this.entryMotionTtBSpeed * timeDiff;
					}
				}else if(movement.direction == 'ltr'){
					if(!this.entryMotionStartPropertiesRead){
						anivid.util.setPropertyToSprites(this.sprites, 'left', this.entryMotionStartLeft);
						this.entryMotionStartPropertiesRead = true;
					}
					if(sprite.left < this.finalSpriteLeft){
						sprite.left = sprite.left + this.entryMotionLtRSpeed * timeDiff;
					}
				}else if(movement.direction == 'rtl'){
					if(!this.entryMotionStartPropertiesRead){
						anivid.util.setPropertyToSprites(this.sprites, 'left', anivid.constant.CANVAS_WIDTH);
						this.entryMotionStartPropertiesRead = true;
					}
					if(sprite.left > this.finalSpriteLeft){
						sprite.left = sprite.left - this.entryMotionRtLSpeed * timeDiff;
					}
				}

			}
		}
	}

	Character.prototype.PlayExitMotions = function(time, timeDiff){
		var activeSceneEndTime = anivid.player.activeSceneStartTime + anivid.player.activeScene.duration*1000;
		if(this.exitMotion){
			var activeSceneExitMotionStartTime = activeSceneEndTime - this.exitMotion.movement.duration*1000;
			if(time > activeSceneExitMotionStartTime){
				var exitMotionMovement = this.exitMotion.movement;
				if(this.sprites.length > 0 && !this.playingExitMotion){
					var sprite = this.sprites[0];
					this.entryMotionBtTSpeed = (sprite.top + sprite.height)/(this.exitMotion.movement.duration*1000);
					this.entryMotionTtBSpeed = (anivid.constant.CANVAS_HEIGHT - sprite.top + sprite.height)/(this.exitMotion.movement.duration*1000);
					this.entryMotionRtLSpeed = (sprite.left + 2*sprite.width)/(this.exitMotion.movement.duration*1000);
					this.entryMotionLtRSpeed = (anivid.constant.CANVAS_WIDTH - sprite.left)/(this.exitMotion.movement.duration*1000);
					this.playingExitMotion = true;
				}

				for(var i = 0; i < this.sprites.length; i++){
					var sprite = this.sprites[i];
						if(exitMotionMovement.direction == 'btt'){
							sprite.top = sprite.top - this.entryMotionBtTSpeed * timeDiff;
						}else if(exitMotionMovement.direction == 'ttb'){
							sprite.top = sprite.top + this.entryMotionTtBSpeed * timeDiff;
						}else if(exitMotionMovement.direction == 'ltr'){
							sprite.left = sprite.left + this.entryMotionLtRSpeed * timeDiff;
						}else if(exitMotionMovement.direction == 'rtl'){
							sprite.left = sprite.left - this.entryMotionRtLSpeed * timeDiff;
						}
				}
			}
		}
	}

	Character.prototype.update = function(timeDiff){
		if(timeDiff > 20)timeDiff = 20;
		
		var date = new Date();
		var time = date.getTime();
		var that = this;

		var setPropertyToSprites = function(sprites, property, value){
			for(var j = 0; j < sprites.length; j++){
				sprites[j][property] = value;
			}
		}

		if(anivid.player){
			this.PlayEntryMotions(time, timeDiff);
		}

		if(time-this.characterChangedAt>200){
			this.currentIndex++;
			if(anivid.player){
				if(!this.entryMotion || time > (anivid.player.activeSceneStartTime+this.entryMotion.movement.duration*1000)){
					this.playingEntryMotion = false;
					if(time-this.characterChangedAt>200){
						// this.currentIndex++;
						this.sprites.forEach(function(sprite){
							if(!sprite.left)
								sprite.left = that.initialLeft;
							if(!sprite.top)
								sprite.top = that.initialTop;
			
							if(that.shadowFinalLeft && that.shadowFinalLeft > that.initialLeft && sprite.left < that.shadowFinalLeft)
								sprite.set({left:sprite.left+timeDiff});
							else if(that.shadowFinalLeft && that.shadowFinalLeft < that.initialLeft && sprite.left > that.shadowFinalLeft)
								sprite.set({left:sprite.left-timeDiff});

							if(that.shadowFinalLeft && that.shadowFinalTop > that.initialTop && sprite.top < that.shadowFinalTop)
								sprite.set({top:sprite.top+timeDiff});
							else if(that.shadowFinalLeft && that.shadowFinalTop < that.initialTop && sprite.top > that.shadowFinalTop)
								sprite.set({top:sprite.top-timeDiff});

							if(!sprite.scaleX)
								sprite.scaleX = that.initialScaleX;
							if(!sprite.scaleY)
								sprite.scaleY = that.initialScaleY;

							var scaleXRate = (that.shadowFinalScaleX - that.initialScaleX)/(Math.abs(that.shadowFinalLeft-that.initialLeft));
							var scaleYRate = (that.shadowFinalScaleY - that.initialScaleY)/(Math.abs(that.shadowFinalLeft-that.initialLeft));
							
							sprite.scaleX = that.initialScaleX + scaleXRate * Math.abs(sprite.left-that.initialLeft);
							sprite.scaleY = that.initialScaleY + scaleYRate * Math.abs(sprite.left-that.initialLeft);
						});
					}
				}
			}
			
			
			this.characterChangedAt = time;
			if(this.currentIndex > this.nFrames-1){
				this.currentIndex = 0;
			}	
		}

		if(anivid.player){
			this.PlayExitMotions(time, timeDiff);
		}
	};

	return anivid.Character = Character;
})();