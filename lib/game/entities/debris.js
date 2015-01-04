ig.module(
	'game.entities.debris'
)
.requires(
	'impact.entity',
	'game.entities.bounceable'

)
.defines(function(){

EntityDebris = EntityBounceable.extend({
    
		size: {x: 24, y: 24},
		zIndex: 1,
		gravityFactor: 0,
		zoomRadius: 60,
		maxVel: {x: 3000, y: 300},
	
		type: ig.Entity.TYPE.NONE, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,

		animSheet: new ig.AnimationSheet( 'media/debris.png', 24, 24),
		animSheet2: new ig.AnimationSheet( 'media/debris2.png', 24, 24),
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.2, [0] );
			this.currentAnim.alpha = 0.25;
			if(Math.random()>0.5){
				this.animSheet = this.animSheet2;
				this.addAnim( 'idle', 0.2, [0] );
				this.currentAnim.alpha = 0.15;
			}
			
			this.randomCooldown = new ig.Timer(Math.random()*3);
			
			this.lifeTimer = new ig.Timer(3);
			// Add the animations
			this.vel.x = -700 - 1500*Math.random();
			//this.rotation = Math.random();
			this.scale.x = 4*Math.random();
			this.scale.y = this.scale.x;
		},
    
		update: function() {
			// move!
			this.parent();
			//this.currentAnim.angle += this.rotation/20;
			if(this.lifeTimer.delta()>0){
				this.kill();
			}
			//this.parent();
		},

		draw: function(){
			this.parent();
		}
	});
});
