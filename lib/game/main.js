ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'game.entities.particle',
	'game.entities.nonPlayer',
	'game.entities.sign',
	'game.entities.block',
	'game.entities.dataPacket',
	'game.entities.platform',
	'game.entities.barrier',
	'game.entities.highScore',
	'game.entities.storyText',
	'game.entities.startMenu',
	'game.entities.breakableBlock',
	'game.entities.submitButton',
	'game.entities.checkPoint',
	'game.entities.debris',
	'game.levels.test',
	'game.levels.level00',
	'game.levels.level01',
	//'impact.debug.debug',
	'plugins.scalingPlugin',
	'plugins.impact-storage',
	'plugins.gamepads'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/courier16_white.png' ),
	font_small: new ig.Font( 'media/courier_8_white.png' ),
	big: false,
	scaleFactor: 1,

	tweenColorsByTime: false,
	clearColor: '#af0c27',
	currentColor: '#af0c27',
	newColor: '#af0c27',
	defaultColor: '#af0c27',
	darkColor: '#100710',
	mediumDarkColor: '#320221',

	mainRedColor: '#af0c27',
	mainWhiteColor: '#f8f4f8',

	init: function() {
		// Initialize your game here; bind keys etc.
		ig.game.storage = new ig.Storage();
		ig.game.highScores = [0,0,0,0,0,0,0,0,0,0];
		ig.game.getHighScores();
		
		ig.Sound.enabled = true;
		ig.game.initKeys();
		ig.game.loadMusicTracks();
		ig.game.loadSoundEffects();
		ig.game.slowMotionTimer = new ig.Timer(0);
		ig.game.loadGameMode('spark');
	},

	loadMusicTracks: function(){
		ig.music.add('media/music/atmospheric2.*', 'atmospheric2');
		ig.music.add('media/music/epic.*', 'epic');
		/*
		ig.music.add('media/music/theme.*', 'theme');
		ig.music.add('media/music/atmospheric.*', 'atmospheric');
		
		ig.music.add('media/music/interference.*', 'interference');
		ig.music.add('media/music/interference2.*', 'interference2');
		ig.music.add('media/music/transmission.*', 'transmission');
		ig.music.add('media/music/transmission2.*', 'transmission2');
		*/
		ig.music.loop = true;
		ig.music.volume = 1;
	},

	switchMusicTrack: function(musicName, time){
		TweenMax.to(ig.music, time, {volume: 0, onComplete: ig.game.playMusicAndFadeUpVolume.bind(ig.game, musicName, time)});
	},

	playMusicAndFadeUpVolume: function(musicName, time){
		ig.music.play(musicName);
		TweenMax.to(ig.music, time, {volume: 1});
	},

	loadSoundEffects: function(){
		ig.game.sfxHit = new ig.Sound('media/sound/sfx_hit.*');
		ig.game.sfxHit.volume = 0.5;
		ig.game.sfxBoom = new ig.Sound('media/sound/boom.*');
		ig.game.sfxShortBoom = new ig.Sound('media/sound/short_boom.*');
		ig.game.sfxSuperBoom = new ig.Sound('media/sound/super_boom.*');
		ig.game.sfxText01 = new ig.Sound('media/sound/sfx_text_01.*');
		ig.game.sfxText02 = new ig.Sound('media/sound/sfx_text_02.*');
		ig.game.sfxText03 = new ig.Sound('media/sound/sfx_text_03.*');
		ig.game.sfxText04 = new ig.Sound('media/sound/sfx_text_04.*');
		ig.game.sfxText05 = new ig.Sound('media/sound/sfx_text_05.*');
		ig.game.sfxText06 = new ig.Sound('media/sound/sfx_text_06.*');
		ig.game.textSfx = [ig.game.sfxText01, ig.game.sfxText02, ig.game.sfxText03, ig.game.sfxText04, ig.game.sfxText05, ig.game.sfxText06];

		ig.game.sfxBoost01 = new ig.Sound('media/sound/sfx_fullspeed.*');
		ig.game.sfxBoost02 = new ig.Sound('media/sound/sfx_holdingboost.*');

		ig.game.sfxArrow01 = new ig.Sound('media/sound/sfx_arrow1.*');
		ig.game.sfxArrow02 = new ig.Sound('media/sound/sfx_arrow2.*');
		ig.game.sfxArrow03 = new ig.Sound('media/sound/sfx_arrow3.*');
		ig.game.sfxArrow04 = new ig.Sound('media/sound/sfx_arrow4.*');
		ig.game.arrowSfx = [ig.game.sfxArrow01, ig.game.sfxArrow04];
		/*
		ig.game.sfxTextIdle01 = new ig.Sound('media/sound/sfx_text_idle01.*');
		ig.game.sfxTextIdle02 = new ig.Sound('media/sound/sfx_text_idle02.*');
		ig.game.sfxTextIdle03 = new ig.Sound('media/sound/sfx_text_idle03.*');
		*/
	},

	playRandomTextSfx: function(){
		ig.game.textSfx[Math.round((ig.game.textSfx.length-1)*Math.random())].play();
	},

	playRandomArrowSfx: function(){
		//ig.game.sfxArrow01.play();
		ig.game.arrowSfx[Math.round((ig.game.arrowSfx.length-1)*Math.random())].play();
	},

	translateColorToString: function(r, g, b){
		var rr = r.toString(16);
		var gg = g.toString(16);
		var bb = b.toString(16);
		if(rr.length < 2){
			rr = '0' + rr;
		} else if( gg.length < 2) {
			gg = '0' + gg;
		} else if( bb.length < 2) {
			bb = '0' + bb;
		}
		var color = '#' + rr + gg + bb;
		return color;
	},

	tweenColors: function(newColor, time, callback){
		this.tweenColorsByTime = true;
		this.tweenColorDuration = time;
		this.newColor = newColor;
		this.colorTweenTimer = new ig.Timer(time);
		ig.game.colorTweenCallback = callback;
	},

	startSpawningDataPackets: function(){
		ig.game.dataPacketTimer = new ig.Timer(0.5);
	},

	tweenColorsTime: function(distance, maxDistance, currentColor, clearColor){
		var defR = parseInt(currentColor.substring(1,3), 16);
		var defG = parseInt(currentColor.substring(3,5), 16);
		var defB = parseInt(currentColor.substring(5,7), 16);

		var newR = parseInt(clearColor.substring(1,3), 16);
		var newG = parseInt(clearColor.substring(3,5), 16);
		var newB = parseInt(clearColor.substring(5,7), 16);
		var ratio = (maxDistance - distance)/maxDistance;

		var r = Math.floor(defR + (-defR + newR) * ratio);
		var g = Math.floor(defG + (-defG + newG) * ratio);
		var b = Math.floor(defB + (-defB + newB) * ratio);
		var sanitycheck = String.valueOf(r).length;
		if( r.toString().length < 2){
			r = '0' + r;
		} else if( g.toString().length < 2) {
			g = '0' + g;
		} else if( b.toString().length < 2) {
			b = '0' + b;
		}
		return this.translateColorToString(r, g, b);
	},

	resetColors: function(){
		ig.game.tweenColors(ig.game.mainRedColor, 0.5, false);
	},

	loadGameMode: function(mode){
		if(mode === 'spark'){
			ig.music.play('atmospheric2');
			ig.game.mode = mode;
			ig.game.scaleFactor = 1;
			ig.game.zoomed = false;
			//TweenMax.to(this, 1, {clearColor: '#af0c27'});
			this.currentColor = '#af0c27';
			ig.game.loadLevel(LevelLevel01);
			ig.game.text = ig.game.spawnEntity(EntityStoryText, 0, 0);
			ig.game.player = ig.game.spawnEntity(EntityPlayer, 100, 100);
			ig.game.spawnEntity(EntityDataPacket, 500, 100);
			ig.game.backgroundSpawnTimer = new ig.Timer(1.5);
			ig.game.spawnCheckPoints();
		} else if(mode === 'text') {
			//ig.music.play('transmission2');
			ig.game.mode = mode;
			this.currentColor = '#000000';
			ig.game.loadLevel(LevelTest);
			ig.game.spawnEntity(EntityStoryText, 0, 0);
		} else {
			ig.game.mode = 'intro';
			this.currentColor = '#000000';
			ig.game.loadLevel(LevelTest);
			ig.game.spawnEntity(EntityStartMenu, 0, 0);
		}
	},

	createParticleExplosion: function(x, y){
		var velocity = 35;
		for (var i = 9; i > 0; i--) {
			ig.game.spawnEntity(EntityParticle, x, y, {scale: {x: 0.5, y: 0.5}, vel: {x: velocity * Math.cos(-0.2*i), y: velocity * Math.sin(-0.2*i) }})
		};
		for (var i = 9; i > 0; i--) {
			ig.game.spawnEntity(EntityParticle, x, y, {scale: {x: 0.5, y: 0.5}, vel: {x: velocity * Math.cos(0.2*i), y: velocity * Math.sin(0.2*i) }})
		};
		velocity = 25;
		for (var i = 9; i > 0; i--) {
			ig.game.spawnEntity(EntityParticle, x, y, {scale: {x: 0.8, y: 0.8}, vel: {x: velocity * Math.cos(-0.2*i), y: velocity * Math.sin(-0.2*i) }})
		};
		for (var i = 9; i > 0; i--) {
			ig.game.spawnEntity(EntityParticle, x, y, {scale: {x: 0.8, y: 0.8}, vel: {x: velocity * Math.cos(0.2*i), y: velocity * Math.sin(0.2*i) }})
		};
		velocity = 15;
		for (var i = 9; i > 0; i--) {
			ig.game.spawnEntity(EntityParticle, x, y, {vel: {x: velocity * Math.cos(-0.2*i), y: velocity * Math.sin(-0.2*i) }})
		};
		for (var i = 9; i > 0; i--) {
			ig.game.spawnEntity(EntityParticle, x, y, {vel: {x: velocity * Math.cos(0.2*i), y: velocity * Math.sin(0.2*i) }})
		};
		ig.game.sortEntitiesDeferred();
	},

	createSmallParticleExplosion: function(x, y, xdir){
		var velocity = 80;
		for (var i = 5; i > 0; i--) {
			ig.game.spawnEntity(EntityParticle, x, y, {color: 'white', vel: {x: xdir * velocity * Math.cos(-0.25*i), y: velocity * Math.sin(-0.2*i) }})
		};
		for (var i = 5; i > 0; i--) {
			ig.game.spawnEntity(EntityParticle, x, y, {color: 'white', vel: {x: xdir * velocity * Math.cos(0.25*i), y: velocity * Math.sin(0.2*i) }})
		};
		ig.game.sortEntitiesDeferred();
	},

	initKeys: function(){
		ig.input.bind( ig.KEY.M, 'mute' );
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.LEFT_ARROW, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.RIGHT_ARROW, 'right' );
		ig.input.bind( ig.KEY.UP_ARROW, 'up' );
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.DOWN_ARROW, 'down' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.MOUSE1, 'shoot' );
		//ig.input.bind( ig.KEY.SPACE, 'shoot' );
		ig.input.bind( ig.KEY.Z, 'zip' );

		ig.input.bind( ig.GAMEPAD1.PAD_LEFT, 'left');
		ig.input.bind( ig.GAMEPAD1.PAD_RIGHT, 'right');

		//ig.input.bind( ig.GAMEPAD1.FACE_3, 'dodge');

		//ig.input.bind( ig.GAMEPAD1.LEFT_SHOULDER_BOTTOM, 'up');
		ig.input.bind( ig.GAMEPAD1.FACE_1, 'zip');
		ig.input.bind( ig.GAMEPAD1.FACE_2, 'zip');
		ig.input.bind( ig.GAMEPAD1.FACE_4, 'zip');
		ig.input.bind( ig.GAMEPAD1.PAD_TOP, 'up');
		//ig.input.bind( ig.GAMEPAD1.SELECT, 'down');
		ig.input.bind( ig.GAMEPAD1.PAD_BOTTOM, 'down');
	},

	zoomTo: function(object, amount, speed, easing, onComplete){
		if(!speed){
			speed = 2;
		}
		if(!easing){
			easing = Power1.easeOut;
		}
		//if(!this.zoomed){
			TweenMax.killTweensOf(this);
			this.centerObject = object;
			if(onComplete){
				TweenMax.to(this, speed, {scaleFactor: amount, ease: easing, onComplete: onComplete});
			} else {
				TweenMax.to(this, speed, {scaleFactor: amount, ease: easing});
			}
			this.zoomed = true;
		//}
	},

	setZoom: function(object, amount, zoomed){
		TweenMax.killTweensOf(this);
		ig.game.scaleFactor = amount;
		if(zoomed){
			ig.game.zoomed = true;
		} else {
			ig.game.zoomed = false;
		}
	},

	unZoom: function(){
		TweenMax.to(this, 2, {scaleFactor: 1});
		ig.game.zoomed = false;
	},

	getRandomY: function(y, range){
		var rand = Math.random();
		if(rand > 0.5){
			y = y - Math.random()*range;
		} else {
			y = y + Math.random()*range;
		}
		return y;
	},

	spawnCheckPoints: function(){
		ig.game.checkPoints = [];
		for (var i = 0; i < 100; i++) {
			ig.game.checkPoints.push(ig.game.spawnEntity(EntityCheckPoint, 3000 + 3000 *i*i/2 , -200));
		};
	},

	youLose: function(){
		ig.game.gameTimer = undefined;
		ig.game.spawnEntity(EntitySign, 0, 0, {gameover: true});
		ig.game.player.freeze();
		ig.game.score = Math.floor(ig.game.player.pos.x) + ig.game.player.dataCollected * 1000;
		showInputBox();
		//ig.game.spawnEntity(EntitySubmitButton, ig.game.screen.x + ig.system.width/2, ig.game.screen.y + ig.system.height - ig.system.height/4);
	},

	getHighScores: function(){
		ig.game.highScores = [];
		for (var i = 0; i < 10; i++) {
			var score = ig.game.storage.get('highscore'+i);
			ig.game.highScores.push(score);
		};
	},

	setHighScores: function(){
		var i = 0;
		ig.game.highScores.forEach(function(score){
			ig.game.storage.set('highscore'+i, score);
			i++;
		});
	},

	addHighScore: function(name){
		var highScore = ig.game.score = Math.floor(ig.game.player.pos.x) + ig.game.player.dataCollected * 1000;
		var inserted = false;
		insertAt = 0;
		var arrayPlacement = 0;
		ig.game.highScores.forEach(function(score){
			if(!inserted){
				if(score == null || highScore > score.score){
					insertAt = arrayPlacement;
					inserted = true;
				}
			}
			arrayPlacement++;
		})
		if(inserted){
			ig.game.highScores.splice(insertAt, 0, {name: name, score: highScore});
			ig.game.highScores.splice(10, 1);
			ig.game.setHighScores();
			ig.game.spawnEntity(EntityHighScore, 0, 0);
			return true;
		} else {
			ig.game.spawnEntity(EntityHighScore, 0, 0);
			return false;
		}

	},
	
	update: function() {
		/*
		gpads = navigator.getGamepads();
		if(gpads && gpads.length > 0){
			this.gamepadSupport = true;
		}*/
		// Update all entities and backgroundMaps
		ig.game.clearColor = ig.game.currentColor;
		this.parent();
		
		if(ig.game.backgroundSpawnTimer && ig.game.backgroundSpawnTimer.delta()>0){
			this.spawnEntity(EntityNonPlayer, ig.game.player.pos.x - 300, ig.game.getRandomY(ig.game.player.pos.y, 150));
			
			this.spawnEntity(EntityDebris, ig.game.player.pos.x + 500, ig.game.getRandomY(ig.game.player.pos.y, 150));
			this.spawnEntity(EntityDebris, ig.game.player.pos.x + 500, ig.game.getRandomY(ig.game.player.pos.y, 150));
			this.spawnEntity(EntityDebris, ig.game.player.pos.x + 500, ig.game.getRandomY(ig.game.player.pos.y, 150));
			
			ig.game.backgroundSpawnTimer.reset();
		}

		if(this.centerObject){
			if(!this.centerObject.hasSplit){
           		TweenMax.to(this.screen, 0.5, {x: this.centerObject.pos.x + this.centerObject.size.x/2 - ig.system.width/2});
           	} else {
           		this.centerObject = undefined;
           	}
		} else if(ig.game.player) {
			var offsetX = 0;
			if(ig.game.player.vel.x > 0){
				offsetX = 100;
			} else {
				offsetX = -100;
			}
			if(ig.game.zoomed){
				ig.game.unZoom();
			}
			TweenMax.to(this.screen, 0.5, {x: this.player.pos.x + offsetX - ig.system.width/2});
		}

		if(ig.game.cameraShakeTimer && ig.game.cameraShakeTimer.delta()<0){
			ig.game.cameraShake(10);
		}

		if(ig.game.slowMotionTimer.delta()<0){
			ig.Timer.timeScale = 0.33;
			this.setTimeScaleOnTweens(ig.Timer.timeScale);
		} else {
			if(ig.Timer.timeScale === 0.33){
				this.setTimeScaleOnTweens(1);
				this.deactivateSlowMotion();
			}
		}

		if(ig.game.gameTimer && ig.game.gameTimer.delta()>0){
			ig.game.youLose();
		}

		if(ig.game.dataPacketTimer && ig.game.dataPacketTimer.delta()>0){
			ig.game.dataPacketTimer.reset();
			var sign = (Math.random()>0.5 ? 1 : -1);
			var flipVel = (Math.random()>0.85 ? true : undefined);
			ig.game.spawnEntity(EntityDataPacket, ig.game.player.pos.x + 600, ig.game.player.pos.y + Math.random()*300*sign);
			ig.game.spawnEntity(EntityPlatform, ig.game.player.pos.x + 600+ Math.random()*150*sign, ig.game.player.pos.y + Math.random()*300*sign, {flipVel: flipVel});
			ig.game.spawnEntity(EntityBreakableBlock, ig.game.player.pos.x + 600+ Math.random()*150*sign, ig.game.player.pos.y + Math.random()*300*sign);
		}
	},

	activateSlowMotion: function(duration){
		ig.game.slowMotionTimer = new ig.Timer(duration);
	},

	deactivateSlowMotion: function(){
		ig.Timer.timeScale = 1;
	},

	setTimeScaleOnTweens: function(timeScale){
		var tweens = TweenMax.getAllTweens();
		tweens.forEach(function(tween){
			tween._timeScale = timeScale;
		})
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		if(this.tweenColorsByTime){
			if(this.colorTweenTimer.delta()<0){
				ig.game.clearColor = this.tweenColorsTime(Math.abs(this.colorTweenTimer.delta()), this.tweenColorDuration, ig.game.currentColor, ig.game.newColor);
			} else {
				this.clearColor = ig.game.newColor;
				this.currentColor = ig.game.newColor;
				if(ig.game.colorTweenCallback){
					ig.game.colorTweenCallback();
					ig.game.colorTweenCallback = undefined;
				}
			}
		}
		//if(this.big){
			ig.system.context.save();
			ig.system.context.fillStyle = ig.game.clearColor;
			ig.system.context.fillRect(0, 0, ig.system.width*ig.system.scale, ig.system.height*ig.system.scale);
			var scaleFactor = this.scaleFactor;
			ig.system.context.save();
			var newWidth = ig.system.width * scaleFactor;
			var newHeight = ig.system.height * scaleFactor;
			ig.system.context.translate( -(newWidth - ig.system.width)/2*ig.system.scale, -(newHeight - ig.system.height)/2*ig.system.scale );
		    ig.system.context.scale( scaleFactor, scaleFactor );
		//}

	    this.parent();

	    //if(this.big){
	    	ig.system.context.restore();
	    	ig.system.context.restore();
	    //}
	},

	cameraShake: function(camShakePower){
		if(!camShakePower){
			this.camShakePower = 5;
		}
		var mod = 1;
			if(Math.random()>0.5){
				mod = -1;
			}
		ig.game.screen.x = ig.game.screen.x + Math.random()*3*mod;
		ig.game.screen.y = ig.game.screen.y + Math.random()*3*mod;
	},
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 480, 320, 2 );

});
