ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'game.entities.bounceable',
	'game.entities.trailPoint',
	'game.entities.projectile'
)
.defines(function(){

EntityPlayer = EntityBounceable.extend({
    
		//sfxJump: new ig.Sound('media/FX/Jump_04.*'),
		
		size: {x: 16, y: 4},
		maxVel: {x: 150, y: 150},
		maximumVelocity: 150,
		offset: {x: 0, y: 0},
		friction: {x: 0, y: 350},
		zIndex: 100,
		gravityFactor: 0,
		active: true,
		superPowerDuration: 22,
		streak: 0,
		dataCollected: 0,
		baseDamage: 5,
		damage: 5,
	
		type: ig.Entity.TYPE.A, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.PASSIVE,
		
		animSheet: new ig.AnimationSheet( 'media/player_sprite.png', 16, 4 ),
		glowImage: new ig.Image('media/player_glow.png', 16, 16),
			
		flip: false,
		accelGround: 500,
		accelAir: 500,
		jump: 130,
		zipDistance: 100,

		direction: 1,
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
	
			// Add the animations

			this.addAnim( 'idle', 0.2, [0] );
			this.trailPointSpawnTimer = new ig.Timer(0.1);
			this.rippleTimer = new ig.Timer(Math.random());
			this.forceBoostTimer = new ig.Timer(0);

			ig.game.screen.x = this.pos.x - ig.system.width/2;
			ig.game.screen.y = 0;

			this.shotCooldown = new ig.Timer(0.4);
			this.shootingTimer = new ig.Timer(0);
			this.zipTimer = new ig.Timer(2);
		},

		freeze: function(){
			this.frozen = true;
			this.currentAnim.alpha = 0;
		},

		activate: function(){
			this.frozen = false;
			this.currentAnim.alpha = 1;
			ig.game.centerObject = false;
		},

		draw: function(){
			if(this.lastPoint && !this.lastPoint._killed && !this.frozen){
				ig.system.context.globalAlpha = 1;
				ig.system.context.beginPath();
				ig.system.context.lineWidth = 4;
				ig.system.context.strokeStyle = '#f8f4f8';
				ig.system.context.moveTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.pos.y - ig.game.screen.y)*ig.system.scale);
				ig.system.context.moveTo((this.pos.x - ig.game.screen.x)*ig.system.scale, (this.lastPoint.pos.y - ig.game.screen.y)*ig.system.scale);
				ig.system.context.lineTo((this.lastPoint.pos.x - ig.game.screen.x)*ig.system.scale, (this.lastPoint.pos.y - ig.game.screen.y)*ig.system.scale);
				ig.system.context.stroke();

				if(this.shootingTimer.delta()<0){
					ig.system.globalAlpha = (0.3 + this.shootingTimer.delta())/0.3;
					ig.system.context.beginPath();
					ig.system.context.lineWidth = 4;
					ig.system.context.strokeStyle = '#f8f4f8';
					ig.system.context.moveTo((this.pos.x + this.size.x/2 - ig.game.screen.x)*ig.system.scale, (this.pos.y - 300 - ig.game.screen.y)*ig.system.scale);
					ig.system.context.lineTo((this.pos.x + this.size.x/2 - ig.game.screen.x)*ig.system.scale, (this.pos.y + 300 - ig.game.screen.y)*ig.system.scale);
					ig.system.context.stroke();
					ig.system.globalAlpha = 1;
				}

				ig.system.context.globalAlpha = 1;
			}
			//ig.game.font.draw(ig.music.volume, this.pos.x - ig.game.screen.x, this.pos.y - ig.game.screen.y - 25);
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

		forceBoost: function(duration){
			this.forceBoostTimer = new ig.Timer(duration);
		},

		collectData: function(object){
			this.dataCollected++;
			this.maximumVelocity = this.maximumVelocity + 10;
			this.maxVel.x = this.maximumVelocity;
		},

		addTime: function(time){
			ig.game.gameTimer = new ig.Timer(Math.ceil(-1*ig.game.gameTimer.delta()) + time);
		},
    
		update: function() {
			
			//ig.music.volume = (this.vel.x + this.maxVel.x +45) / (this.maxVel.x*2);
			if(!this.frozen){
				if(this.trailPointSpawnTimer.delta()>0){
					if(this.rippleTimer.delta()>0){
						var randDir = 1;
						if(Math.random()<0.5){
							randDir = -1;
						}
						this.lastPoint = ig.game.spawnEntity(EntityTrailPoint, this.pos.x + this.size.x/2, this.pos.y+this.size.y/2, {playerTrail: true, otherPoint: this.lastPoint, ripple: randDir*3*Math.random(), rippleDir: 1});
						this.rippleTimer = new ig.Timer(Math.random()*0.5);
					} else {
						this.lastPoint = ig.game.spawnEntity(EntityTrailPoint, this.pos.x + this.size.x/2, this.pos.y+this.size.y/2, {playerTrail: true, otherPoint: this.lastPoint});	
					}
					
					this.trailPointSpawnTimer.reset();
				}
				if(this.closeObject && this.zoomValue > 1){
					ig.game.zoomTo( this.closeObject, this.zoomValue);
				} else {
					this.closeObject = false;
					ig.game.centerObject = false;
				}
				
				//var accel = this.standing ? this.accelGround : this.accelAir;
				if(this.dead){
					this.currentAnim.alpha = this.deadTimer.delta()*-1;
					if(this.deadTimer.delta()>0){
						this.currentAnim.alpha = 0;
						this.kill();
					}
				}
				this.accel.x = 100*this.direction;
				if( (ig.input.state('down') || (ig.input.mouse.y > 160 && ig.input.state('shoot'))) && !this.dead && !this.winner && this.forceBoostTimer.delta()>0) {
						//Moving left
						this.accel.y = 500;
						if(ig.input.pressed('zip') && this.zipTimer.delta()>0){
							this.zipTimer.reset();
							this.pos.y = this.pos.y + this.zipDistance;
						}
						/*
						if (this.vel.y > 0){
								this.accel.y = (accel*4);
						} else {
								this.accel.y = accel;
						}*/
				} else if ( (ig.input.state('up') || (ig.input.mouse.y < 160 && ig.input.state('shoot'))) && !this.dead && !this.winner && this.forceBoostTimer.delta()>0){
						//Moving right
						this.accel.y = -500;
						if(ig.input.pressed('zip') && this.zipTimer.delta()>0){
							this.zipTimer.reset();
							this.pos.y = this.pos.y - this.zipDistance;
						}
						/*
						if (this.vel.y > 0){
								this.accel.y = -(accel*4);
						} else {
								this.accel.y = -accel;
						}*/
				}else {
						this.accel.y = 0;
				}
				if(ig.input.state('right') ){
					if(!this.boosting){
						ig.game.sfxBoost01.play();
					}
					if(ig.input.pressed('zip') && this.zipTimer.delta()>0){
						//this.zipTimer.reset();
						//this.pos.x = this.pos.x + this.zipDistance;
					}
					this.boosting = true;
					this.scale.y = 1.3;
					this.scale.x = 0.6;
					this.accel.x = 600;
					this.maxVel.x = this.maximumVelocity + this.maximumVelocity/10;
				} else if(ig.input.state('left') ){
					if(!this.boosting){
						ig.game.sfxBoost01.play();
					}
					if(ig.input.pressed('zip') && this.zipTimer.delta()>0){
						//this.zipTimer.reset();
						//this.pos.x = this.pos.x + this.zipDistance;
					}
					this.boosting = true;
					this.scale.y = 1.3;
					this.scale.x = 0.6;
					this.accel.x = -600;
					this.maxVel.x = this.maximumVelocity + this.maximumVelocity/10;
				} else if(this.forceBoostTimer.delta()<0){
					this.superBoosting = true;
					this.scale.y = 1.6;
					this.scale.x = 0.3;
					this.accel.x = 600;
					this.maxVel.x = this.maximumVelocity * 2;
				}/* else if(ig.input.state('shoot') && this.shotCooldown.delta()>0){
					this.scale.y = 1.2;
					this.scale.x = 0.8;
					this.accel.x = -600;
					this.shotCooldown.reset();
					this.shooting = true;
					this.shootingTimer = new ig.Timer(0.3);
					//ig.game.spawnEntity(EntityProjectile, this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 -3, {vel: {x: 0, y: 400}});
					//ig.game.spawnEntity(EntityProjectile, this.pos.x + this.size.x/2, this.pos.y + this.size.y/2 -3, {vel: {x: 0, y: -400}});
				}*/ else {
					ig.game.sfxBoost01.stop();
					this.boosting = false;
					this.superBoosting = false;
					this.scale.y = 1;
					this.scale.x = 1;
					this.maxVel.x = this.maximumVelocity;
				}

				this.currentAnim.flip.x = this.flip;
				// move!
				this.parent();

				if(this.pos.y > 320){
					var offset = -Math.abs(ig.game.screen.y) + Math.abs(this.pos.y);
					this.pos.y = 0;
					ig.game.screen.y = 0;
					TweenMax.killTweensOf(ig.game.screen);
					ig.game.setZoom(this, 1, false);
				} else if(this.pos.y < 0){
					var offset = Math.abs(ig.game.screen.y) - Math.abs(this.pos.y);
					this.pos.y = 320;
					ig.game.screen.y = 0;
					TweenMax.killTweensOf(ig.game.screen);
					ig.game.setZoom(this, 1, false);
				}
			}
		},

		hit: function(direction, flipVel){
			this.stretch(0.3, 0.3);

			if(flipVel){
				this.direction = this.direction*-1;
			}
		}
	});
});
