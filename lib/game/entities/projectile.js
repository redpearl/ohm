ig.module(
	'game.entities.projectile'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityProjectile = ig.Entity.extend({
    
		size: {x: 6, y: 6},
		maxVel: {x: 1500, y: 500},
		zIndex: 251,
		gravityFactor: 0,
		zoomRadius: 120,
		color: '#FFFFFF',
		strokeColor: '#ddb7d5',
		lineWidth: 1,

		scale: 1,
		xScale: 1,
		yScale: 1,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,

		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.hitCooldown = new ig.Timer(0.1);
			// Add the animations
			this.xScale = this.scale;
			this.yScale = this.scale;
		},

		check: function(other){
			if(other === ig.game.player && this.hitCooldown.delta()>0){
				//ig.game.sfxHit.play();
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
			//this.currentAnim.update();
			this.parent();
		},

		draw: function(){
			ig.system.context.save();
			ig.system.context.translate((this.pos.x + this.size.x/2 - ig.game.screen.x)*ig.system.scale, (this.pos.y + this.size.y/2 - ig.game.screen.y)*ig.system.scale);
			ig.system.context.lineWidth = this.lineWidth;
			ig.system.context.fillStyle = this.color;
			ig.system.context.strokeStyle = this.strokeColor;
			ig.system.context.scale(this.xScale, this.yScale);
			ig.system.context.fillRect(-this.size.x/2*ig.system.scale, -this.size.y/2*ig.system.scale, this.size.x*ig.system.scale, this.size.y*ig.system.scale);
			ig.system.context.strokeRect(-this.size.x/2*ig.system.scale, -this.size.y/2*ig.system.scale, this.size.x*ig.system.scale, this.size.y*ig.system.scale);
			ig.system.context.restore();
		}
	});
});
