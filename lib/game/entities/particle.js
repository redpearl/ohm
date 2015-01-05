ig.module(
	'game.entities.particle'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityParticle = EntityBounceable.extend({
    
		size: {x: 4, y: 4},
		zIndex: -5,
		gravityFactor: 0,
		zoomRadius: 60,
		timeToLive: 1,
		scale: {x: 1, y: 1},
	
		type: ig.Entity.TYPE.NONE, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,

		animSheet: new ig.AnimationSheet( 'media/particle.png', 4, 4),
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 1, [0] );
			this.addAnim( 'white', 1, [1] );
			this.lifeTime = new ig.Timer(0);
			TweenMax.to(this.scale, 2, {x: 0, y: 0});
			this.rotateFactor = Math.random();
			this.vel.x = this.vel.x + Math.random();
			this.vel.y = this.vel.y + Math.random();
			if(this.color === 'white'){
				this.currentAnim = this.anims.white;
			}
			// Add the animations
		},
    
		update: function() {
			// move!
			this.parent();
			if(this.lifeTime.delta() > this.timeToLive){
				this.kill();
			}
			this.currentAnim.angle += this.rotateFactor;
			this.currentAnim.alpha = 1 - this.lifeTime.delta();
		},

		draw: function(){
			/*
			ig.system.context.save();
			ig.system.context.globalCompositeOperation = 'lighter';
			*/
			this.parent();
			/*
			ig.system.context.globalCompositeOperation = 'source-over';
			ig.system.context.restore();
			*/
		}
	});
});
