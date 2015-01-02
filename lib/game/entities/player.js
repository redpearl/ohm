ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'game.entities.bounceable',
	'game.entities.trailPoint'
)
.defines(function(){

EntityPlayer = EntityBounceable.extend({
    
		//sfxJump: new ig.Sound('media/FX/Jump_04.*'),
		
		size: {x: 16, y: 4},
		maxVel: {x: 150, y: 150},
		offset: {x: 0, y: 0},
		friction: {x: 0, y: 350},
		zIndex: 100,
		gravityFactor: 0,
		active: true,
		superPowerDuration: 22,
		streak: 0,
		score: 0,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		animSheet: new ig.AnimationSheet( 'media/player_sprite.png', 16, 4 ),
		glowImage: new ig.Image('media/player_glow.png', 16, 16),
			
		flip: false,
		accelGround: 500,
		accelAir: 500,
		jump: 130,
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
	
			// Add the animations
			this.addAnim( 'idle', 0.2, [0] );
			this.trailPointSpawnTimer = new ig.Timer(0.1);
			this.rippleTimer = new ig.Timer(Math.random());
		},

		draw: function(){
			this.currentAnim.scaleY = this.spritescaley;
			this.currentAnim.scaleX = this.spritescalex;

			if(this.lastPoint && !this.lastPoint._killed){
				ig.system.context.globalAlpha = 1;
				ig.system.context.beginPath();
				ig.system.context.lineWidth = 4;
				ig.system.context.strokeStyle = '#f8f4f8';
				ig.system.context.moveTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y - ig.game.screen.y)*ig.system.scale);
				ig.system.context.moveTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.lastPoint.pos.y - ig.game.screen.y)*ig.system.scale);
				ig.system.context.lineTo((this.lastPoint.pos.x - ig.game.screen.x)*ig.system.scale, (this.lastPoint.pos.y - ig.game.screen.y)*ig.system.scale);
				ig.system.context.stroke();
				ig.system.context.globalAlpha = 1;
			}

			this.parent();
			//this.glowImage.draw(this.pos.x - ig.game.screen.x - 4, this.pos.y - ig.game.screen.y - 6);
		},

		hurt: function(enemy){
			if(this.superPowerTimer.delta()<0){
				this.streak++;
				this.score += enemy.scoreValue * this.streak;
				ig.game.spawnEntity(EntityBoard, enemy.pos.x, enemy.pos.y, {text: enemy.scoreValue * this.streak});
				enemy.die();
			} else if(this.hurtTimer.delta()>0){
				this.hurtTimer = new ig.Timer(2);
				ig.game.sfxHurt.play();
				this.loseHealth();
			}
		},

		win: function(){
			this.winner = true;
		},

		loseHealth: function(){
			ig.game.healthBar[ig.game.healthBar.length-1].die();
			ig.game.healthBar.erase(ig.game.healthBar[ig.game.healthBar.length-1]);
			ig.game.cameraShakeTimer = new ig.Timer(0.5);
			if(ig.game.healthBar.length === 0){
				this.die();
			}
		},

		die: function(){
			this.dead = true;
			this.deadTimer = new ig.Timer(1);
			ig.game.cameraShakeTimer = new ig.Timer(3);
		},

		gainSuperPower: function(){
			this.superPowerTimer = new ig.Timer(this.superPowerDuration);
			ig.music.play('super');
			this.isPlayingSuper = true;
			this.streak = 0;
		},

		loseSuperPower: function(){
			ig.music.play('main');
			ig.game.loadAllCoins();
			ig.game.checkIfLastEnemy();
		},

		pickupCoin: function(){
			this.score += 10;
			ig.game.spawnEntity(EntityBoard, this.pos.x, this.pos.y, {text: 10});
			ig.game.sfxCoin.play();
			var coins = ig.game.getEntitiesByType(EntityCoin);
			var last = true;
			coins.forEach(function(coin){
				if(!coin._killed){
					last = false;
				}
			})
			if(last === true){
				this.gainSuperPower();
			}
		},

		go: function(dir){
			this.direction = dir;
		},
    
		update: function() {
			if(this.trailPointSpawnTimer.delta()>0){
				if(this.rippleTimer.delta()>0){
					var randDir = 1;
					if(Math.random()<0.5){
						randDir = -1;
					}
					this.lastPoint = ig.game.spawnEntity(EntityTrailPoint, this.pos.x + this.size.x/2, this.pos.y+this.size.y/2, {otherPoint: this.lastPoint, ripple: randDir*3*Math.random(), rippleDir: 1});
					this.rippleTimer = new ig.Timer(Math.random()*0.5);
				} else {
					this.lastPoint = ig.game.spawnEntity(EntityTrailPoint, this.pos.x + this.size.x/2, this.pos.y+this.size.y/2, {otherPoint: this.lastPoint});	
				}
				
				this.trailPointSpawnTimer.reset();
			}
			if(this.closeObject && this.zoomValue > 1){
				ig.game.zoomTo( this.closeObject, this.zoomValue);
			} else {
				this.closeObject = false;
				ig.game.centerObject = false;
			}
			
			var accel =this.accelGround ;
			//var accel = this.standing ? this.accelGround : this.accelAir;
			if(this.dead){
				this.currentAnim.alpha = this.deadTimer.delta()*-1;
				if(this.deadTimer.delta()>0){
					this.currentAnim.alpha = 0;
					this.kill();
				}
			}
			this.accel.x = 100;
			if( ig.input.state('down') && !this.dead && !this.winner) {
					this.go('down');
					//Moving left
					this.accel.y = 500;
					/*
					if (this.vel.y > 0){
							this.accel.y = (accel*4);
					} else {
							this.accel.y = accel;
					}*/
			} else if ( ig.input.state('up') && !this.dead && !this.winner){
					this.go('up');
					//Moving right
					this.accel.y = -500;
					/*
					if (this.vel.y > 0){
							this.accel.y = -(accel*4);
					} else {
							this.accel.y = -accel;
					}*/
			}else {
					this.accel.y = 0;
			}
			if(ig.input.state('boost')){
				if(this.vel.x < 0){
					this.accel.x = -600;	
				} else {
					this.accel.x = 600;
				}
			}
			this.currentAnim.flip.x = this.flip;
			// move!
			this.parent();

		},

		hit: function(direction){
			if(direction === 'front'){
				this.stretch(0.3, 0.3);
				//this.dip(-2, 0.3);
			}
		}
	});
});
