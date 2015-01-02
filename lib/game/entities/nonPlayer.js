ig.module(
	'game.entities.nonPlayer'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityNonPlayer = ig.Entity.extend({
    
		size: {x: 2, y: 2},
		zIndex: 251,
		maxVel: {x: 200, y: 100},
		gravityFactor: 0,
		deathTime: 3,
		dimChance: 0.3,
		breakChance: 0.1,
		brokenOffset: 0,
	
		type: ig.Entity.TYPE.NONE, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,

		animSheet: new ig.AnimationSheet( 'media/player_sprite.png', 2, 2 ),

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.2, [0] );
			this.trailPointSpawnTimer = new ig.Timer(0.8);
			this.vel.x = ig.game.player.vel.x + Math.random()*50;
			this.lifeTimer = new ig.Timer(8);
			this.currentAnim.alpha= 0.6;
		},
    
		update: function() {
			// move!
			
			this.parent();
			//this.parent();
			if(this.lifeTimer.delta()>0){
				this.kill();
			}
			if(this.trailPointSpawnTimer.delta()>0){
				this.lastPoint = ig.game.spawnEntity(EntityTrailPoint, this.pos.x + this.size.x/2, this.pos.y+this.size.y/2, {otherPoint: this.lastPoint, small: true});
				this.trailPointSpawnTimer.reset();
			}
		},

		draw: function(){
			this.parent();

			if(this.lastPoint && !this.lastPoint._killed){
				var transparency = -this.lifeTimer.delta()/this.deathTime;
				ig.system.context.globalAlpha = transparency;
				ig.system.context.beginPath();
				ig.system.context.lineWidth = 1;
				ig.system.context.strokeStyle = '#f8f4f8';
				ig.system.context.moveTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y + this.brokenOffset - ig.game.screen.y)*ig.system.scale);
				ig.system.context.lineTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.lastPoint.pos.y + this.brokenOffset - ig.game.screen.y)*ig.system.scale);
				ig.system.context.lineTo((this.lastPoint.pos.x - ig.game.screen.x)*ig.system.scale, (this.lastPoint.pos.y + this.brokenOffset- ig.game.screen.y)*ig.system.scale);
				ig.system.context.stroke();
				ig.system.context.globalAlpha = 1;
			}
		}
	});
});
