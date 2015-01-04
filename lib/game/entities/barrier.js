ig.module(
	'game.entities.barrier'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityBarrier = ig.Entity.extend({
    
		size: {x: 12, y: 6000},
		zIndex: -10,
		gravityFactor: 0,
		zoomRadius: 60,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,

		color: '#ddb7d5',

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.hitCooldown = new ig.Timer(0.1);
			// Add the animations
		},

		check: function(other){
			if(other === ig.game.player && this.hitCooldown.delta()>0 && !ig.input.state('boost') && !this.broken){
				ig.game.player.vel.x = -ig.game.player.vel.x + -ig.game.player.vel.x/10;
				this.hitCooldown.reset();
				ig.game.player.hit('front');
				//ig.game.spawnParticleExplosion(this.pos.x, this.pos.y);
				//this.kill();
				//ig.game.player.pickupCoin();
			} else if(!this.broken){
				this.broken = true;
				ig.game.sfxBoom.play();
				ig.game.activateSlowMotion(1);
				ig.game.createParticleExplosion(this.pos.x + 2, other.pos.y + other.size.y/2);
				this.currentAnim.alpha = 0.3;
				TweenMax.to(this, 1, {alpha: 1});
			}
		},

		isOnScreen: function(){
			if((this.pos.x > ig.game.screen.x && this.pos.x < ig.game.screen.x + ig.system.width) || (this.pos.x + this.size.x > ig.game.screen.x && this.pos.x + this.size.x > ig.game.screen.x + ig.system.width)){
				return true;
			} else if((this.pos.y > ig.game.screen.y && this.pos.y < ig.game.screen.y + ig.system.height) || (this.pos.y + this.size.y > ig.game.screen.y && this.pos.y + this.size.y > ig.game.screen.y + ig.system.height)){
				return true;
			} else {
				return false;
			}
		},
    
		update: function() {
			// move!
			if(this.distanceTo(ig.game.player) < this.zoomRadius || this === ig.game.player.closeObject){
				ig.game.player.closeObject = this;
				ig.game.player.zoomValue = this.zoomRadius/this.distanceTo(ig.game.player);
			}
			//this.parent();
		},

		draw: function(){
			if(this.isOnScreen()){
				ig.system.context.globalAlpha = 1;
				ig.system.context.fillStyle = ig.game.darkColor;
				ig.system.context.fillRect((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y - ig.game.screen.y)*ig.system.scale, 3000, 6000 );
				ig.system.context.fillStyle = ig.game.mediumDarkColor;
				ig.system.context.globalAlpha = 0.8;
				ig.system.context.fillRect((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y - ig.game.screen.y)*ig.system.scale, 150 - (this.pos.x - ig.game.player.pos.x)/4, 6000 );
				ig.system.context.globalAlpha = 1;
				ig.system.context.fillStyle = this.color;
				ig.system.context.fillRect((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y - ig.game.screen.y)*ig.system.scale, 4, 6000 );
			}
			/*
			ig.system.context.beginPath();
			ig.system.context.moveTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y + 3000 - ig.game.screen.y)*ig.system.scale);
			ig.system.context.lineTo((this.pos.x + 4 - ig.game.screen.x)*ig.system.scale, (this.pos.y - 3000 - ig.game.screen.y)*ig.system.scale);
			ig.system.context.stroke();
			*/
			
			this.parent();
		}
	});
});
