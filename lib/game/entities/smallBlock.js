ig.module(
	'game.entities.smallBlock'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntitySmallBlock = ig.Entity.extend({
    
		size: {x: 24, y: 24},
		zIndex: 251,
		gravityFactor: 0,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,
		colors: ['#f7fb7b', '#f1d472', '#ecbc70', '#18012a'],
		tweenDuration: 1,

		animSheet: new ig.AnimationSheet( 'media/small_block.png', 24, 24),
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			var frame = Math.round(Math.random()*3);
			this.addAnim( 'idle', 0.2, [frame] );
			this.color = this.colors[Math.round(Math.random()*(this.colors.length-1))];
			this.originalColor = this.color;

			var rotation = Math.random()/7;
			TweenMax.to(this.currentAnim, 0.7, {angle: rotation, onComplete: this.rotateBack.bind(this)});
			TweenMax.to(this.pos, 0.8, {x: this.pos.x + this.mod.x, y: this.pos.y + this.mod.y, onComplete: this.moveBack.bind(this)});
			// Add the animations
		},

		tweenColor: function(){
			this.tweenColorTimer = new ig.Timer(this.tweenDuration);
			this.newColor = '#f8f4f8';
			this.tweeningColor = true;
		},

		tweenColorBack: function(){
			this.tweenDuration = 0.5;
			this.newColor = this.originalColor;
			this.originalColor = this.color;
			this.tweenColorTimer = new ig.Timer(this.tweenDuration);
			this.tweeningColor = true;
		},

		rotateBack: function(){
			TweenMax.to(this.currentAnim, 0.25, {angle: 0});
		},

		moveBack: function(){
			TweenMax.to(this.pos, 0.25, {x: this.pos.x - this.mod.x, y: this.pos.y - this.mod.y, onComplete: this.glow.bind(this)});
		},

		glow: function(){
			this.tweenColor();
		},

		update: function() {
			// move!
			this.currentAnim.update();
			//this.parent();
			if(this.tweenColorTimer && this.tweenColorTimer.delta()<0 && this.tweeningColor){
				this.color = ig.game.tweenColorsTime(this.tweenColorTimer.delta() + this.tweenDuration, this.tweenDuration, this.newColor, this.originalColor);
			} else if (this.tweeningColor && !this.tweeningColorBack){
				this.tweenColorBack();
				this.tweeningColorBack = true;
				this.color = this.originalColor;
			} else {
				this.tweeningColor = false;
				this.tweeningColorBack = false;
			}
		},

		draw: function(){
			//this.parent();
			ig.system.context.save();
			ig.system.context.translate((this.pos.x + this.size.x/2 - ig.game.screen.x)*ig.system.scale, (this.pos.y + this.size.y/2 - ig.game.screen.y)*ig.system.scale);
			ig.system.context.rotate(this.currentAnim.angle);
			ig.system.context.fillStyle = this.color;
			ig.system.context.fillRect(-this.size.x/2*ig.system.scale, -this.size.y/2*ig.system.scale, this.size.x*ig.system.scale, this.size.y*ig.system.scale);
			ig.system.context.restore();
		}
	});
});
