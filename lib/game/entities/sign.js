ig.module(
	'game.entities.sign'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntitySign = ig.Entity.extend({
    
		size: {x: 250, y: 40},
		zIndex: 1110,
		gravityFactor: 0,
		zoomRadius: 60,
	
		type: ig.Entity.TYPE.NONE, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,

		color: '#ddb7d5',

		animSheet: new ig.AnimationSheet( 'media/checkpoint.png', 250, 40 ),
		animSheet2: new ig.AnimationSheet( 'media/gameover.png', 250, 40 ),

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			if(this.gameover){
				this.animSheet = this.animSheet2
			}
			this.addAnim( 'idle', 0.2, [0] );
			if(!this.gameover){
				TweenMax.to(this.currentAnim, 1.5, {alpha: 0, onComplete: this.kill.bind(this)});
			}
			// Add the animations
		},
    
		update: function() {
			// move!
			this.pos.x = ig.game.screen.x + ig.system.width/4;
			this.pos.y = ig.system.height/2 - ig.system.height/3;
			//this.parent();
		},

		draw: function(){
		
			this.parent();
		}
	});
});
