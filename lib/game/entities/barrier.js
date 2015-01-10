ig.module(
	'game.entities.barrier'
)
.requires(
	'impact.entity',
	'game.entities.textPlaque'

)
.defines(function(){

EntityBarrier = ig.Entity.extend({
    
		size: {x: 12, y: 6000},
		zIndex: -10,
		gravityFactor: 0,
		zoomRadius: 60,
		darkColor: '#100710',
		mediumDarkColor: '#320221',
		sysText: 'HIT Firewall\nToo low SPD',
	
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
			if(other === ig.game.player && this.hitCooldown.delta()>0 && !ig.game.player.superBoosting && !this.broken){
				ig.game.player.vel.x = -ig.game.player.vel.x + -ig.game.player.vel.x/10;
				this.hitCooldown.reset();
				ig.game.player.hit('front');
				ig.game.createSmallParticleExplosion(this.pos.x, this.pos.y);
				if(!this.appended){
					this.appended = true;
					//ig.game.text.appendText(this.sysText);
				}
				if(this.plaque){
					this.plaque.remove();
				}
				//this.plaque = ig.game.spawnEntity(EntityTextPlaque, other.pos.x - 150, other.pos.y - 50, {text: this.sysText, origin: {x: other.pos.x + other.size.x, y: other.pos.y + other.size.y/2} });
				//this.kill();
				//ig.game.player.pickupCoin();
			} else if(other === ig.game.player && !this.broken && ig.game.player.superBoosting){
				ig.game.gameTimer = new ig.Timer(30);
				this.broken = true;
				ig.game.sfxSuperBoom.play();
				ig.game.switchMusicTrack('epic', 0);
				ig.game.activateSlowMotion(1);
				ig.game.startSpawningDataPackets();
				ig.game.createParticleExplosion(this.pos.x + 2, other.pos.y + other.size.y/2);
				this.alpha = 0.3;
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
			if(this.isOnScreen() || ig.editor){
				ig.system.context.globalAlpha = 1;
				ig.system.context.fillStyle = this.darkColor;
				ig.system.context.fillRect((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y - ig.game.screen.y)*ig.system.scale, 3000, 6000 );
				ig.system.context.fillStyle = this.mediumDarkColor;
				ig.system.context.globalAlpha = 0.8;
				if(!ig.editor){
					ig.system.context.fillRect((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y - ig.game.screen.y)*ig.system.scale, 150 - (this.pos.x - ig.game.player.pos.x)/4, 6000 );
				} else {
					ig.system.context.fillRect((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y - ig.game.screen.y)*ig.system.scale, 150 - (400)/4, 6000 );
				}
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
