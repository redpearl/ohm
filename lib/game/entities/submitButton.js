ig.module(
	'game.entities.submitButton'
)
.requires(
	'impact.entity',
	'game.entities.bounceable'

)
.defines(function(){

EntitySubmitButton = EntityBounceable.extend({
    
		size: {x: 160, y: 40},
		zIndex: 1,
		gravityFactor: 0,
		zoomRadius: 60,
		maxVel: {x: 3000, y: 300},
	
		type: ig.Entity.TYPE.NONE, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,

		animSheet: new ig.AnimationSheet( 'media/submit.png', 160, 40),
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			this.addAnim( 'idle', 0.2, [0] );
			this.currentAnim.alpha = 0.25;
			// Add the animations
			//this.rotation = Math.random();
		},

		isMouseOverMe: function(){
			if (ig.input.mouse.x + ig.game.screen.x >= this.pos.x && ig.input.mouse.x + ig.game.screen.x <= this.pos.x + this.size.x && ig.input.mouse.y + ig.game.screen.y >= this.pos.y && ig.input.mouse.y + ig.game.screen.y <= this.pos.y + this.size.y){
				return true;
			} else {
				return false;
			}
		},
    
		update: function() {
			// move!
			this.parent();
			//this.currentAnim.angle += this.rotation/20;
			//this.parent();
			if(this.isMouseOverMe && ig.input.pressed('shoot')){

				hideInputBox();
			}
		},

		draw: function(){
			this.parent();
		}
	});
});
