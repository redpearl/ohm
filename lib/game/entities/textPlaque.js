ig.module(
	'game.entities.textPlaque'
)
.requires(
	'impact.entity'

)
.defines(function(){

EntityTextPlaque = ig.Entity.extend({
    
		size: {x: 100, y: 30},
		zIndex: 251,
		gravityFactor: 0,
		zoomRadius: 60,
		text: 'Placeholder.',
		revealedText: '',
		cursor: '_',
		blinkTime: 0.5,
		revealRatio: 0.025,
		charactersWritten: 0,
		alpha: 0.8,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,

			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			// Add the animations
			this.blinkTimer = new ig.Timer(this.blinkTime);
			this.textTimer = new ig.Timer(0);
			//this.mainGameTimer = new ig.Timer(5);
			this.calculatePosition();
		},

		remove: function(){
			TweenMax.to(this, 0.5, {alpha: 0, onComplete: this.kill.bind(this)});
		},
    
		update: function() {
			//this.parent();
			this.calculateRevealedText();

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

		calculatePosition: function(){
			var y = ig.game.player.pos.y - 100;
			var x = this.origin.x - 120;
			TweenMax.to(this.pos, 1, {x: x, y: y});
		},

		draw: function(){
			ig.game.font_small.alpha = this.alpha;
			if(this.blinkTimer.delta()>this.blinkTime){
				ig.game.font_small.draw(this.revealedText, this.pos.x - ig.game.screen.x + 10, this.pos.y - ig.game.screen.y + 15);
				this.blinkTimer.reset();
			} else if(this.blinkTimer.delta()>0){
				ig.game.font_small.draw(this.revealedText + this.cursor, this.pos.x - ig.game.screen.x + 10, this.pos.y - ig.game.screen.y + 15);
			} else {
				ig.game.font_small.draw(this.revealedText, this.pos.x - ig.game.screen.x + 10, this.pos.y - ig.game.screen.y + 15);
			}
			if(this.revealed && !this.killTimer){
				this.killTimer = new ig.Timer(5);
			}
			ig.system.context.globalAlpha = this.alpha;
			ig.system.context.strokestyle = '#000000';
			ig.system.context.strokeRect((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y - ig.game.screen.y + 10)*ig.system.scale, this.size.x*ig.system.scale, this.size.y*ig.system.scale);
			ig.system.context.beginPath();
			ig.system.context.moveTo((this.pos.x - ig.game.screen.x)*ig.system.scale + this.size.x*ig.system.scale, (this.pos.y - ig.game.screen.y + 10)*ig.system.scale + this.size.y*ig.system.scale);
			ig.system.context.lineTo((this.origin.x - ig.game.screen.x)*ig.system.scale, (this.origin.y - ig.game.screen.y)*ig.system.scale);
			ig.system.context.stroke();
			ig.system.context.globalAlpha = 1;
			if(this.killTimer && this.killTimer.delta()>0){
				this.kill();
			}
			this.parent();
			ig.game.font_small.alpha = 1;
		},

		calculateRevealedText: function() {
			var revealedChars = Math.floor(this.textTimer.delta()/this.revealRatio);
			if(revealedChars > this.charactersWritten && revealedChars <= this.text.length){
				//ig.game.playRandomTextSfx();
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
