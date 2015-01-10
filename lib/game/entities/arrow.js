ig.module(
	'game.entities.arrow'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityArrow = ig.Entity.extend({
    
		size: {x: 18, y: 24},
		zIndex: 251,
		gravityFactor: 0,
		color: '#f7fb7b',
		active: 'true',
		alpha: 1,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,

		animSheet: new ig.AnimationSheet( 'media/arrow_medium.png', 18, 24),
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.2, [0] );
			this.currentAnim.flip.x = true;
			this.hitCooldown = new ig.Timer(1);
			// Add the animations
		},

		check: function(other){
			if(other === ig.game.player && this.active == 'true'){
				other.forceBoost(1.5);
				this.hitCooldown.reset();
				ig.game.activateSlowMotion(0.05);
			}
		},

		activate: function(parentActivator){
			if(parentActivator){
				this.parentActivator = parentActivator;
			}
			this.alpha = 0;
			this.active = 'true';
			this.takeCameraFocus();
			ig.game.playRandomArrowSfx();
		},

		takeCameraFocus: function(){
			if(!this.nextName){
				ig.game.zoomTo(this, 2, 0.35, false, this.done.bind(this, this.parentActivator));
			} else {
				ig.game.zoomTo(this, 2, 0.35, false, this.doneNext.bind(this, this.parentActivator));
			}
			TweenMax.to(this, 0.25, {alpha: 1});
		},

		done: function(parentActivator){
			this.parentActivator = parentActivator;
			ig.game.zoomTo(ig.game.player, 2, 1, false, ig.game.player.activate.bind(ig.game.player));
			this.parentActivator.blowUp();
		},

		doneNext: function(parentActivator){
			this.parentActivator = parentActivator;
			var entity = ig.game.getEntityByName(this.nextName);
			ig.game.zoomTo(entity, 2, 0.35, false, entity.activate.bind(entity, parentActivator));
		},
    
		update: function() {
			// move!
			if(this.active == 'true'){
				this.currentAnim.update();
			}
			//this.parent();
		},

		draw: function(){
			if(this.active == 'true'){
				//this.parent();

				ig.system.context.save();
				ig.system.context.globalAlpha = this.alpha;
				ig.system.context.translate((this.pos.x + this.size.x/2 - ig.game.screen.x)*ig.system.scale, (this.pos.y + this.size.y/2 - ig.game.screen.y)*ig.system.scale);
				ig.system.context.fillStyle = this.color;
				//ig.system.context.fillRect(-this.size.x/2*ig.system.scale, -this.size.y/2*ig.system.scale, 20*ig.system.scale, 10*ig.system.scale);
				ig.system.context.rotate(0.8);
				ig.system.context.fillRect(-this.size.x/2*ig.system.scale, -this.size.y/2*ig.system.scale, 16*ig.system.scale, 10*ig.system.scale);
				ig.system.context.rotate(1.60);
				ig.system.context.translate(-6, 9);
				ig.system.context.fillRect(-this.size.x/2*ig.system.scale, -this.size.y/2*ig.system.scale, 16*ig.system.scale, 10*ig.system.scale);
				ig.system.context.restore();
			}
		}
	});
});
