ig.module(
	'game.entities.checkPoint'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityCheckPoint = ig.Entity.extend({
    
		size: {x: 12, y: 6000},
		zIndex: -10,
		gravityFactor: 0,
		zoomRadius: 60,
		darkColor: '#100710',
		mediumDarkColor: '#320221',
	
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
			if(other === ig.game.player && !this.broken){
				this.broken = true;
				other.addTime(20);
				ig.game.spawnEntity(EntitySign, 0, 0);
				ig.game.checkPoints.erase(this);
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
			
			this.parent();
		}
	});
});
