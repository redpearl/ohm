ig.module(
	'game.entities.block'
)
.requires(
	'impact.entity',
	'game.entities.smallBlock'

)
.defines(function(){

EntityBlock = EntityBounceable.extend({
    
		size: {x: 48, y: 48},
		zIndex: 251,
		gravityFactor: 0,
		zoomRadius: 100,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,

		sysText: 'HIT PPU\nApply Power',

		animSheet: new ig.AnimationSheet( 'media/block.png', 48, 48),
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.2, [0] );
			this.hitCooldown = new ig.Timer(0.1);
			this.cameraReleaseTimer = new ig.Timer(0);
			// Add the animations
		},

		check: function(other){
			if(other === ig.game.player && this.hitCooldown.delta()>0 && !ig.game.player.boosting && !this.hasSplit){
				ig.game.player.vel.x = -ig.game.player.vel.x + -ig.game.player.vel.x/10;
				this.hitCooldown.reset();
				ig.game.player.hit('front');
				if(this.plaque){
					this.plaque.remove();
				}
				//this.stretch(0.1, 0.5);
				//this.plaque = ig.game.spawnEntity(EntityTextPlaque, other.pos.x - 100, other.pos.y - 50, {text: this.sysText, origin: {x: other.pos.x + other.size.x, y: other.pos.y + other.size.y/2}});
				//ig.game.spawnParticleExplosion(this.pos.x, this.pos.y);
				//this.kill();
				//ig.game.player.pickupCoin();
			} else if(other === ig.game.player && this.hitCooldown.delta()>0 && !this.hasSplit){
				this.hasSplit = true;
				ig.game.player.freeze();
				this.split();
				this.currentAnim.alpha = 0;
				//ig.game.setZoom(this, 3, true);
				//ig.game.cameraShake(5);
				ig.game.sfxSuperBoom.play();
				ig.game.tweenColors(ig.game.mainWhiteColor, 0.5, ig.game.resetColors);
			}
		},

		activateTargets: function(){
			var target = ig.game.getEntityByName(this.targetName);
			target.activate(this);
			this.releaseCamera();
		},

		blowUp: function(){
			this.currentAnim.alpha = 0;
			this.blocks.forEach(function(smallBlock){
				smallBlock.blowUp();
			})
		},

		releaseCamera: function(){
			this.cameraReleaseTimer = new ig.Timer(4);
		},

		split: function(){
			this.blocks = [];
			this.blocks.push(ig.game.spawnEntity(EntitySmallBlock, this.pos.x, this.pos.y, {parentBlock: this, mod: {x: -2, y: -2}}));
			this.blocks.push(ig.game.spawnEntity(EntitySmallBlock, this.pos.x + 24, this.pos.y, {parentBlock: this, mod: {x: 2, y: -2}}));
			this.blocks.push(ig.game.spawnEntity(EntitySmallBlock, this.pos.x, this.pos.y + 24, {parentBlock: this, mod: {x: -2, y: 2}}));
			this.blocks.push(ig.game.spawnEntity(EntitySmallBlock, this.pos.x + 24, this.pos.y + 24, {parentBlock: this, leader: true, mod: {x: 2, y: 2}}));
		},
    
		update: function() {
			// move!
			if((this.cameraReleaseTimer.delta()>0) && !this.hasSplit && (this.distanceTo(ig.game.player) < this.zoomRadius || this === ig.game.player.closeObject)){
				ig.game.player.closeObject = this;
				ig.game.player.zoomValue = this.zoomRadius/this.distanceTo(ig.game.player);
			} else if(ig.game.player.closeObject === this){
				ig.game.player.closeObject = undefined;
			}
			this.currentAnim.update();
			//this.parent();
		},

		draw: function(){
			this.parent();
		}
	});
});
