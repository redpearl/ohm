ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'game.entities.bounceable'
)
.defines(function(){

EntityPlayer = EntityBounceable.extend({
    
		//sfxJump: new ig.Sound('media/FX/Jump_04.*'),
		
		size: {x: 8, y: 4},
		maxVel: {x: 150, y: 150},
		offset: {x: 0, y: 0},
		friction: {x: 50, y: 50},
		zIndex: 100,
		gravityFactor: 0,
		active: true,
		superPowerDuration: 22,
		streak: 0,
		score: 0,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		animSheet: new ig.AnimationSheet( 'media/player_sprite.png', 8, 4 ),
			
		flip: false,
		accelGround: 160,
		accelAir: 200,
		jump: 130,
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
	
			// Add the animations
			this.addAnim( 'idle', 0.2, [0] );
			/*
			this.addAnim( 'walk', 0.1, [1,2,3] );
			this.addAnim( 'jump', 1, [3] );
			this.addAnim( 'fall', 1, [2] );*/
			this.hurtTimer = new ig.Timer(0);
			this.superPowerTimer = new ig.Timer(0);
			this.superParticleTimer = new ig.Timer(0.1);
		},

		draw: function(){
			this.currentAnim.scaleY = this.spritescaley;
			this.currentAnim.scaleX = this.spritescalex;
			this.parent();
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
			//Left
			if( ig.input.state('left') && !this.dead && !this.winner) {
					this.go('left');
					//Moving left
					this.vel.y = 0;
					this.currentAnim.angle = 0;
					this.vel.x = -100;
					/*
					if (this.vel.x > 0){
							this.vel.x = -100;
					} else {
							this.accel.x = -accel;
					}*/
					this.flip = true;
			} else if ( ig.input.state('right') && !this.dead && !this.winner){
					this.go('right');
					//Moving right
					this.vel.y = 0;
					this.currentAnim.angle = 0;
					this.vel.x = 100;
					/*
					if (this.vel.x < 0){
							this.accel.x = accel*4
					} else {
							this.accel.x = accel;
					}*/
					this.flip = false;
			} else if( ig.input.state('down') && !this.dead && !this.winner) {
					this.go('down');
					//Moving left
					this.vel.x = 0;
					this.currentAnim.angle = 1.57079633;
					this.vel.y = 100;
					/*
					if (this.vel.y > 0){
							this.accel.y = (accel*4);
					} else {
							this.accel.y = accel;
					}*/
			} else if ( ig.input.state('up') && !this.dead && !this.winner){
					this.go('up');
					//Moving right
					this.vel.x = 0;
					this.currentAnim.angle = 1.57079633;
					this.vel.y = -100;
					/*
					if (this.vel.y > 0){
							this.accel.y = -(accel*4);
					} else {
							this.accel.y = -accel;
					}*/
			}/*else {
					this.go('no');
					this.vel.x = 0;
					this.vel.y = 0;
			}*/
									
			/*
			if( this.standing && ig.input.pressed('jump') && !this.dead && !this.winner){
					//Jumping
					this.stretch(0.3, 0.3);
					this.vel.y = -this.jump;
					ig.game.sfxJump.play();
			}*/

			this.currentAnim.flip.x = this.flip;
			// move!
			this.parent();

			if(this.standing && !this.standingLastFrame){
				this.squash(0.3, 0.3);
				this.dip(-2, 0.3);
			}
		}
	});
});
