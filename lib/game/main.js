ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',
	'game.entities.player',
	'game.entities.nonPlayer',
	'game.entities.block',
	'game.entities.barrier',
	'game.entities.debris',
	'game.levels.test',
	'impact.debug.debug',
	'plugins.scalingPlugin'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	big: false,
	scaleFactor: 1,
	clearColor: '#af0c27',
	darkColor: '#100710',
	mediumDarkColor: '#320221',

	init: function() {
		// Initialize your game here; bind keys etc.
		ig.game.initKeys();
		ig.game.loadLevel(LevelTest);
		ig.game.player = ig.game.spawnEntity(EntityPlayer, 100, 100);
		ig.game.spawnEntity(EntityBlock, 550, 100);
		ig.game.spawnEntity(EntityBarrier, 1550, -1500);
		ig.game.backgroundSpawnTimer = new ig.Timer(1.5);
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
		ig.input.bind( ig.KEY.SPACE, 'boost' );
	},

	zoomTo: function(object, amount){
		//if(!this.zoomed){
			TweenMax.killTweensOf(this);
			this.centerObject = object;
			TweenMax.to(this, 2, {scaleFactor: amount});
			this.zoomed = true;
		//}
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
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		if(ig.game.backgroundSpawnTimer.delta()>0){
			this.spawnEntity(EntityNonPlayer, ig.game.player.pos.x - 300, ig.game.getRandomY(ig.game.player.pos.y, 150));
			
			this.spawnEntity(EntityDebris, ig.game.player.pos.x + 500, ig.game.getRandomY(ig.game.player.pos.y, 150));
			this.spawnEntity(EntityDebris, ig.game.player.pos.x + 500, ig.game.getRandomY(ig.game.player.pos.y, 150));
			this.spawnEntity(EntityDebris, ig.game.player.pos.x + 500, ig.game.getRandomY(ig.game.player.pos.y, 150));
			
			ig.game.backgroundSpawnTimer.reset();
		}
		// Add your own, additional update code here

		if(ig.input.pressed('mute')){
			
		}

		if(this.centerObject){
           	TweenMax.to(this.screen, 0.5, {x: this.centerObject.pos.x + this.centerObject.size.x/2 - ig.system.width/2});
           	TweenMax.to(this.screen, 0.5, {y: this.centerObject.pos.y + this.centerObject.size.y/2- ig.system.height/2});
		} else {
			if(ig.game.zoomed){
				ig.game.unZoom();
			}
			TweenMax.to(this.screen, 0.5, {x: this.player.pos.x - ig.system.width/2});
           	TweenMax.to(this.screen, 0.5, {y: this.player.pos.y - ig.system.height/2});
		}

		if(ig.game.cameraShakeTimer && ig.game.cameraShakeTimer.delta()<0){
			ig.game.cameraShake(10);
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		//if(this.big){
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
		ig.game.screen.x = Math.random()*3*mod;
		ig.game.screen.y = Math.random()*3*mod;
	},
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 480, 320, 2 );

});
