ig.module(
	'game.entities.storyText'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityStoryText = ig.Entity.extend({
    
		size: {x: 480, y: 320},
		zIndex: 251,
		gravityFactor: 0,
		zoomRadius: 60,
		text: 'Hello?',
		revealedText: '',
		cursor: '_',
		blinkTime: 0.5,
		revealRatio: 0.4,
		charactersWritten: 0,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,

			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			// Add the animations
			this.blinkTimer = new ig.Timer(this.blinkTime);
			this.textTimer = new ig.Timer(0);
			this.mainGameTimer = new ig.Timer(5);
		},
    
		update: function() {
			this.parent();
			this.calculateRevealedText();

			// fix this biz
			if(this.mainGameTimer.delta()>0 && !this.ended){
				var obj = {pos:{ x: 35, y: 10}, size:{x: 5, y: 5}};
				ig.game.zoomTo(obj, 0.1, 7, Linear.noEase, function(){ ig.game.loadGameMode('spark') });
				this.ended = true;
				//ig.game.loadGameMode('spark');
			}
		},

		draw: function(){
			if(this.blinkTimer.delta()>this.blinkTime){
				ig.game.font.draw(this.revealedText, this.pos.x - ig.game.screen.x + 10, this.pos.y - ig.game.screen.y + 10);
				this.blinkTimer.reset();
			} else if(this.blinkTimer.delta()>0){
				ig.game.font.draw(this.revealedText + this.cursor, this.pos.x - ig.game.screen.x + 10, this.pos.y - ig.game.screen.y + 10);
			} else {
				ig.game.font.draw(this.revealedText, this.pos.x - ig.game.screen.x + 10, this.pos.y - ig.game.screen.y + 10);
			}
			this.parent();
		},

		calculateRevealedText: function() {
			var revealedChars = Math.floor(this.textTimer.delta()/this.revealRatio);
			if(revealedChars > this.charactersWritten && revealedChars <= this.text.length){
				ig.game.playRandomTextSfx();
				this.charactersWritten = revealedChars;
			}
			if(revealedChars >= this.text.length){
				this.revealedText = this.text;
				this.revealed = true;
			} else {
				this.revealedText = this.text.substr(0, revealedChars);
			}
		}

	});
});
