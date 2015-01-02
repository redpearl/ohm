ig.module(
	'game.entities.block'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityBlock = ig.Entity.extend({
    
		size: {x: 24, y: 24},
		zIndex: 251,
		gravityFactor: 0,
		zoomRadius: 60,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,

		animSheet: new ig.AnimationSheet( 'media/block.png', 24, 24),
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.2, [0] );
			this.hitCooldown = new ig.Timer(0.1);
			// Add the animations
		},

		check: function(other){
			if(other === ig.game.player && this.hitCooldown.delta()>0){
				ig.game.player.vel.x = -ig.game.player.vel.x + -ig.game.player.vel.x/10;
				this.hitCooldown.reset();
				ig.game.player.hit('front');
				//ig.game.spawnParticleExplosion(this.pos.x, this.pos.y);
				//this.kill();
				//ig.game.player.pickupCoin();
			}
		},
    
		update: function() {
			// move!
			if(this.distanceTo(ig.game.player) < this.zoomRadius || this === ig.game.player.closeObject){
				ig.game.player.closeObject = this;
				ig.game.player.zoomValue = this.zoomRadius/this.distanceTo(ig.game.player);
			}
			this.currentAnim.update();
			//this.parent();
		},

		draw: function(){
			this.parent();
		}
	});
});
