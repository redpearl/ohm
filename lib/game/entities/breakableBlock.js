ig.module(
	'game.entities.breakableBlock'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBreakableBlock = ig.Entity.extend({
    
		size: {x: 32, y: 32},
		zIndex: 251,
		gravityFactor: 0,
		zoomRadius: 120,
		color: '#2b031d',
		strokeColor: '#ddb7d5',
		lineWidth: 4,
		health: 5,
		startHealth: 5,
		geometry: true,

		xScale: 1,
		yScale: 1,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.hitCooldown = new ig.Timer(0.1);
			// Add the animations
		},

		check: function(other){
			if(other === ig.game.player && this.hitCooldown.delta()>0){
				if(ig.game.player.boosting){
					this.health = this.health - ig.game.player.damage;
				}
				ig.game.player.vel.x = -ig.game.player.vel.x + -ig.game.player.vel.x/10;

				this.hitCooldown.reset();
				ig.game.player.hit('front', this.flipVel);
				if(ig.game.player.pos.x > this.pos.x){
					ig.game.createSmallParticleExplosion(other.pos.x + other.size.x/2+2, other.pos.y + other.size.y/2, 1);
				} else {
					ig.game.createSmallParticleExplosion(other.pos.x + other.size.x/2+2, other.pos.y + other.size.y/2, -1);
				}
				ig.game.sfxHit.play();
				this.squash();

				
				if(this.health < 1){
					this.kill();
				}
			} else if(other.geometry){
				this.kill();
			}
		},

		squash: function(){
			this.xScale = 0.5;
			TweenMax.to(this, 0.5, {xScale: 1});
			this.yScale = 1.2;
			TweenMax.to(this, 0.5, {yScale: 1});
		},
    
		update: function() {
			// move!
			/*
			if(this.distanceTo(ig.game.player) < this.zoomRadius || this === ig.game.player.closeObject){
				ig.game.player.closeObject = this;
				ig.game.player.zoomValue = this.zoomRadius/this.distanceTo(ig.game.player);
			}*/
			//this.currentAnim.update();
			//this.parent();
		},

		draw: function(){
			if(this.pos.x > ig.game.screen.x - this.size.x && this.pos.x < ig.game.screen.x + ig.system.width){
				if(this.pos.y > ig.game.screen.y  - this.size.y && this.pos.y < ig.game.screen.y + ig.system.height){
					ig.system.context.save();
					ig.system.context.translate((this.pos.x + this.size.x/2 - ig.game.screen.x)*ig.system.scale, (this.pos.y + this.size.y/2 - ig.game.screen.y)*ig.system.scale);
					ig.system.context.lineWidth = this.lineWidth;
					ig.system.context.fillStyle = this.color;
					ig.system.context.strokeStyle = this.strokeColor;

					ig.system.context.scale(this.xScale, this.yScale);
					ig.system.context.fillRect(-this.size.x/2*ig.system.scale*(this.health/this.startHealth), -this.size.y/2*ig.system.scale*(this.health/this.startHealth), this.size.x*ig.system.scale*(this.health/this.startHealth), this.size.y*ig.system.scale*(this.health/this.startHealth));

					ig.system.context.strokeRect(-this.size.x/2*ig.system.scale*(this.health/this.startHealth), -this.size.y/2*ig.system.scale*(this.health/this.startHealth), this.size.x*ig.system.scale*(this.health/this.startHealth), this.size.y*ig.system.scale*(this.health/this.startHealth));
					ig.system.context.restore();
				}
			}
		}
	});
});
