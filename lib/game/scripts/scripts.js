ig.module(
	'game.scripts.scripts'
)
.requires(
)
.defines( function(){
	ig.Scripts = ig.Class.extend({

		hello:
		'actor game startLetterboxing true ' +
		'actor player1 run 240 100 ' +
		'wait 0.8 ' + 
		'actor player2 run 350 100 ' +
		'wait 0.8 ' + 
		'actor player1 breathe true ' +
		'wait 1 ' + 
		'actor player2 breathe true ' +
		'wait 2 ' + 
		'actor guardian angry true ' +
		'wait 0.5 ' + 
		'actor player1 scared true ' +
		'actor player2 scared true ' +
		'wait 1.5 ' + 
		'actor guardian fly true ' +
		'actor guardian run 260 100 ' +
		'wait 0.8 ' + 
		'actor guardian smash true ' +
		'wait 0.05 ' + 
		'actor player2 tumble true ' + 
		'actor player2 run 550 100 ' +
		'wait 0.6 ' + 
		'actor camera walk 50 0 ' +
		'actor guardian idle true ' +
		'wait 0.1 ' + 
		'actor player1 stopping true ' +
		'wait 3 ' + 
		'actor guardian point true ' +
		'wait 0.3 ' + 
		'actor guardian pointLoop true ' +
		'wait 2 ' + 
		'actor game endLetterboxing true ' 
		

	});
})

