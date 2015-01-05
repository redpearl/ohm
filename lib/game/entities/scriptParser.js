ig.module(
	'game.entities.scriptParser'
)
.requires(
	'impact.entity',
	'game.scripts.scripts'
)
.defines(function(){

EntityScriptParser = ig.Entity.extend({
    
		size: {x: 64, y:64},
		zIndex: -650,
		gravityFactor: 0,
		functionQueue: [],
		wait: false,
		
		type: ig.Entity.TYPE.NONE, // Player friendly group
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,
			
		init: function( x, y, settings ) {
			this.parent( x, y, settings );
			
		},

		triggerFunction: function(){
			this.start();
		},

		start: function(){
			if(!ig.editor && !this.parsed){
				this.initWordList();
				// Load the scriptfile
				if(ig.game.languageSetting){
					this.scriptFile = this.scriptFile + ig.game.languageSetting;
				}
				this.script = this.loadScript(this.scriptFile);
				this.triggered =false;
				// Parse script
				this.parseScript(this.script);
				this.parsed = true;
			}
		},

		ready: function(){
			if(!ig.editor && !this.triggered && !this.parsed){
				this.initWordList();
				// Load the scriptfile
				if(ig.game.languageSetting){
					this.scriptFile = this.scriptFile + ig.game.languageSetting;
				}
				this.script = this.loadScript(this.scriptFile);

				// Parse script
				this.parseScript(this.script);
				this.parsed = true;
			}
		},

		initWordList: function(){
			// All recognized verbs
			this.words = [];
			this.words.push('startNextLevel');
			this.words.push('playSound');
			this.words.push('playMusic');
			this.words.push('grow');
			this.words.push('shrink');
			this.words.push('fadeOut');
			this.words.push('tweenIn');
			this.words.push('shakeCamera');
			this.words.push('actor');
			this.words.push('startLetterboxing');
			this.words.push('endLetterboxing');
			this.words.push('endLevel');
			this.words.push('say');
			this.words.push('wait');
		},

		parseScript: function(script){
			var that = this;
			var scriptArray = script.split(' ');
			var actor = 0;
			var verb = '';
			var parameters = [];
			var parameterLength = 0;
			var nextIsActorName = false;

			scriptArray.forEach(function(scriptEntry){

				for (var i = 0; i < that.words.length; i++) {
					if(i === 0 && nextIsActorName){
						actor = ig.game.getEntityByName(scriptEntry);
						if(scriptEntry === "game"){
							actor = ig.game;	
						} else if(actor === undefined){
							actor = scriptEntry;
						}
						nextIsActorName = false;
					} else if (i === 0 && parameterLength>0){
						parameters.push(scriptEntry);
						parameterLength--;
						if(parameterLength === 0){
							that.pushNewFunctionToQueue(verb, actor, parameters);	
							verb = '';
							actor = 0;
							parameters = [];
						}
					} else if (scriptEntry === that.words[i]){
						// All verbs are assumed to have one parameter, unless you make an exception here
						 if(scriptEntry === 'actor'){
							nextIsActorName = true;
						} else if (scriptEntry === 'shakeCamera'){
							parameterLength = 2;
							verb = scriptEntry;
						} else if (scriptEntry === 'wait'){
							actor = 0;
							parameterLength = 1;
							verb = scriptEntry;
						} else {
							parameterLength = 1;
							verb = scriptEntry;
						}
					} else {
						if(i === that.words.length-1){
							//console.log("verb not found.")
						}
					}
				};
			})
		},

		pushNewFunctionToQueue: function(verb, actor, parameters){
			var func = {};
			func.verb = verb;
			func.actor = actor;
			func.parameters = parameters;
			this.functionQueue.unshift(func);
		},

		executeFunctionByName: function(functionName, context , args ) {
			if(typeof context === 'string'){
				context = ig.game.getEntityByName(context);
			}
		    var args = Array.prototype.slice.call(arguments, 2);
		    var namespaces = functionName.split(".");
		    var func = namespaces.pop();
		    for (var i = 0; i < namespaces.length; i++) {
		        context = context[namespaces[i]];
		    }
		    return context[func].apply(context, args);
		},

		loadScript: function(script){
			// Load script-file
			var loadedScript = ig.game.scripts[script];
			return loadedScript;
		},

		runNextFunctionInQueue: function(){
			var runMe = this.functionQueue.pop();
			if(runMe.verb === 'wait'){
				// create a wait function that calls go() onComplete
				this.waitTimer = new ig.Timer(runMe.parameters[0]);
				this.wait = true;
			} else if(runMe.verb === 'shakeCamera'){

				ig.game.shakeCamera(runMe.parameters[0], runMe.parameters[1]);

			} else {
				this.executeFunctionByName(runMe.verb, runMe.actor, runMe.parameters);	
			}
		},

		update: function() {
			// Move!
			this.parent();

			// Start next action in queue if wait === false
			if(!this.wait && this.functionQueue.length>0 && !this.triggered){
				this.runNextFunctionInQueue();
			} else if(!this.triggered){
				if(this.waitTimer !== 0 && this.waitTimer !== undefined && this.waitTimer.delta()>0){
					this.wait = false;
					this.waitTimer = 0;
				} else {
					// still waiting
				}
			}
		}
	});
});
