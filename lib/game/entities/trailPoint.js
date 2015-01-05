ig.module(
	'game.entities.trailPoint'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityTrailPoint = ig.Entity.extend({
    
		size: {x: 24, y: 24},
		zIndex: 1,
		gravityFactor: 0,
		deathTime: 3,
		dimChance: 0.3,
		breakChance: 0.1,
		ripple: 0,
	
		type: ig.Entity.TYPE.NONE, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.lifeTimer = new ig.Timer(this.deathTime);
			this.rippleTimer = new ig.Timer(0.2);
			var rand = Math.random();
			if(rand<this.dimChance){
				this.dim = true;
				//this.brokenOffset = 5;
			}
			if(!this.small){
				this.lifeTimer = new ig.Timer(this.deathTime/3);
			}
			/*
			if(this.ripple){
				this.setRipple
				if(this.ripple === 5){
					this.rippleDir = -1;
				}
				this.rippleOffset = this.ripple;
				this.transparent = true;
			}*/
			ig.game.sortEntitiesDeferred();
		},

		setRipple: function(amount, dir){
			this.ripple = amount;
			this.rippleDir = dir;
			
			if(this.ripple > 5){
				this.rippleDir = -1;	
			} else if(this.ripple < -5){
				this.rippleDir = 1;	
			} else {
				this.rippleDir = dir;
			}
			this.rippleTimer = new ig.Timer(0.2);
		},
    
		update: function() {
			// move!
			if(this.ripple && this.rippleTimer && this.rippleTimer.delta()>0){
				if(this.otherPoint){
					this.otherPoint.setRipple( this.ripple , this.rippleDir);
					this.ripple = 0;
					this.transparent = false;
				}
				this.rippleTimer = false;
			}
			this.parent();
			//this.parent();
			if(this.lifeTimer.delta()>0){
				this.kill();
			}
		},

		draw: function(){
			//this.parent();
			if(this.otherPoint && !this.otherPoint._killed){
				if(!this.small){
					var transparency = -this.lifeTimer.delta()/(this.deathTime/3);
				} else {
					var transparency = -this.lifeTimer.delta()/this.deathTime;
				}
				
				if(this.dim){
					transparency = transparency/2;
				} else if(this.transparent){
					transparency = 0.5;
				}
				ig.system.context.globalAlpha = transparency;
				ig.system.context.beginPath();
				if(this.small){
					ig.system.context.lineWidth = 1;
				} else {
					ig.system.context.lineWidth = 2;
				}

				
				ig.system.context.strokeStyle = '#f8f4f8';
				ig.system.context.moveTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y + this.ripple - ig.game.screen.y)*ig.system.scale);
				ig.system.context.lineTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.otherPoint.pos.y + this.ripple - ig.game.screen.y)*ig.system.scale);
				ig.system.context.stroke();
				if(!this.small){
					if(this.lifeTimer.delta()>-this.deathTime/2){
						ig.system.context.lineWidth = 2;
					} else {
						ig.system.context.lineWidth = 4;	
					}
				}

				if(this.playerTrail){
					if(ig.game.player.boosting){
						ig.system.context.strokeStyle = '#f7fb7b';
						ig.system.context.lineWidth = 8;
					} else if (ig.game.player.superBoosting){
						ig.system.context.strokeStyle = '#ec914f';
						ig.system.context.lineWidth = 12;
					}
				}
				ig.system.context.beginPath();
				ig.system.context.moveTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.otherPoint.pos.y + this.ripple - ig.game.screen.y)*ig.system.scale);
				ig.system.context.lineTo((this.otherPoint.pos.x - ig.game.screen.x)*ig.system.scale, (this.otherPoint.pos.y + this.ripple- ig.game.screen.y)*ig.system.scale);
				ig.system.context.stroke();
				ig.system.context.globalAlpha = 1;
			}
		}
	});
});
