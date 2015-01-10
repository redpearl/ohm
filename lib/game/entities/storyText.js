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

			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			// Add the animations
			this.blinkTimer = new ig.Timer(this.blinkTime);
			this.textTimer = new ig.Timer(0);
			//this.mainGameTimer = new ig.Timer(5);
		},
    
		update: function() {
			this.parent();
			//this.calculateRevealedText();
			if(ig.game.gameTimer){
				this.text = Math.floor(ig.game.gameTimer.delta()*-1);
			}
			this.text2 = Math.floor(ig.game.player.vel.x) + '/' +  ig.game.player.maxVel.x;
			this.text3 = Math.floor(ig.game.player.pos.x);
			/* fix this biz
			if(this.mainGameTimer.delta()>0 && !this.ended){
				var obj = {pos:{ x: 35, y: 10}, size:{x: 5, y: 5}};
				ig.game.zoomTo(obj, 0.1, 7, Linear.noEase, function(){ ig.game.loadGameMode('spark') });
				ig.game.tweenColorsByTime = true;
				ig.game.colorTweenTimer = new ig.Timer(6);
				this.ended = true;
				//ig.game.loadGameMode('spark');
			}*/
		},

		appendText: function(text){
			this.charactersWritten = this.text.length;
			this.text = this.text + text;
			this.textTimer = new ig.Timer(-this.charactersWritten*this.revealRatio);
		},

		draw: function(){
			if(this.blinkTimer.delta()>this.blinkTime){
				ig.game.font.draw('TIME: ' + this.text, this.pos.x + 10, this.pos.y + 10);
				ig.game.font.draw('SPD: ' + this.text2, this.pos.x + 300, this.pos.y + 10);
				ig.game.font.draw('DIST: ' + this.text3, this.pos.x + 300, this.pos.y + 240);
				this.blinkTimer.reset();
			} else if(this.blinkTimer.delta()>0){
				ig.game.font.draw('TIME: ' + this.text + this.cursor, this.pos.x + 10, this.pos.y + 10);
				ig.game.font.draw('SPD: ' + this.text2 + this.cursor, this.pos.x + 300, this.pos.y + 10);
				ig.game.font.draw('DIST: ' + this.text3, this.pos.x + 300, this.pos.y + 240);
			} else {
				ig.game.font.draw('TIME: ' + this.text, this.pos.x + 10, this.pos.y + 10);
				ig.game.font.draw('SPD: ' + this.text2, this.pos.x + 300, this.pos.y + 10);
				ig.game.font.draw('DIST: ' + this.text3, this.pos.x + 300, this.pos.y + 240);
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
				this.revealedText = this.text.toString().substr(0, revealedChars);
			}
		}

	});
});
