ig.module(
	'game.entities.dataPacket'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityDataPacket = ig.Entity.extend({
    
		size: {x: 12, y: 12},
		zIndex: 251,
		gravityFactor: 0,
		zoomRadius: 120,
		color: '#2b031d',
		strokeColor: '#ddb7d5',
		lineWidth: 4,

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
			this.timeStep = new ig.Timer(60/124);
		},

		check: function(other){
			if(other === ig.game.player && this.hitCooldown.delta()>0 && !this.removed){
				//ig.game.sfxHit.play();
				this.remove();
				ig.game.sfxArrow04.play();
				ig.game.player.collectData(this);
			} else if(other.geometry || other.platform){
				this.kill();
			}
		},

		remove: function(){
			this.timeStep = new ig.Timer(222);
			TweenMax.to(this, 0.2, {scale: 0, onComplete: this.kill.bind(this)})
			this.removed = true;
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
			//this.parent();
			if(this.timeStep.delta()>0){
				this.timeStep.reset();
				if(this.scale === 0.5){
					this.scale = 1;
				} else {
					this.scale = 0.5;
				}
			}
			this.xScale = this.scale;
			this.yScale = this.scale;
		},

		draw: function(){
			if(this.pos.x > ig.game.screen.x - this.size.x && this.pos.x < ig.game.screen.x + ig.system.width){
				if(this.pos.y > ig.game.screen.y - this.size.y && this.pos.y < ig.game.screen.y + ig.system.height){
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
			}
		}
	});
});
