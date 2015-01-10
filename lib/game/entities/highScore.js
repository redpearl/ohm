ig.module(
	'game.entities.highScore'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityHighScore = ig.Entity.extend({
    
		size: {x: 480, y: 320},
		zIndex: 251,
		gravityFactor: 0,
		zoomRadius: 60,
		text: '',
		text2: '',
		revealedText: '',
		cursor: '_',
		blinkTime: 0.5,
		revealRatio: 0.25,
		charactersWritten: 0,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,
		text: 'HIGH SCORES',
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			// Add the animations
			this.blinkTimer = new ig.Timer(this.blinkTime);
			this.textTimer = new ig.Timer(0);
			this.text = '';
			that = this;
			ig.game.highScores.forEach(function(score){
				if(score !== undefined && score !== 0 && score !== null){
					that.text = that.text + '\n' + score.score + ' : ' + score.name;
				}
			})
			//this.mainGameTimer = new ig.Timer(5);
		},
    
		update: function() {
			this.parent();
		},

		draw: function(){
			ig.game.font.draw(this.text, this.pos.x + 150, ig.system.height/2 - ig.system.height/5);
			this.parent();
		},
	});
});
