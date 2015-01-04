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

		animSheet: new ig.AnimationSheet( 'media/small_block.png', 24, 24),
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			var frame = Math.round(Math.random()*3);
			this.addAnim( 'idle', 0.2, [frame] );

			var rotation = Math.random()/7;
			TweenMax.to(this.currentAnim, 0.7, {angle: rotation, onComplete: this.rotateBack.bind(this)});
			TweenMax.to(this.pos, 0.8, {x: this.pos.x + this.mod.x, y: this.pos.y + this.mod.y, onComplete: this.moveBack.bind(this)});
			// Add the animations
		},

		rotateBack: function(){
			TweenMax.to(this.currentAnim, 0.25, {angle: 0});
		},

		moveBack: function(){
			TweenMax.to(this.pos, 0.25, {x: this.pos.x - this.mod.x, y: this.pos.y - this.mod.y});
		},
    
		update: function() {
			// move!
			this.currentAnim.update();
			//this.parent();
		},

		draw: function(){
			this.parent();
		}
	});
});
