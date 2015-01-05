ig.module( 'game.levels.level01' )
.requires( 'impact.image','game.entities.barrier','game.entities.block','game.entities.platform','game.entities.arrow' )
.defines(function(){
LevelLevel01=/*JSON[*/{
	"entities": [
		{
			"type": "EntityBarrier",
			"x": 676,
			"y": -692
		},
		{
			"type": "EntityBlock",
			"x": 460,
			"y": -272,
			"settings": {
				"targetName": "arrow"
			}
		},
		{
			"type": "EntityPlatform",
			"x": 616,
			"y": -60
		},
		{
			"type": "EntityPlatform",
			"x": 560,
			"y": -120
		},
		{
			"type": "EntityPlatform",
			"x": 508,
			"y": -192
		},
		{
			"type": "EntityArrow",
			"x": 540,
			"y": -260,
			"settings": {
				"name": "arrow",
				"active": "false",
				"nextName": "arrow2"
			}
		},
		{
			"type": "EntityArrow",
			"x": 572,
			"y": -260,
			"settings": {
				"name": "arrow2",
				"active": "false",
				"nextName": "arrow3"
			}
		},
		{
			"type": "EntityArrow",
			"x": 604,
			"y": -260,
			"settings": {
				"name": "arrow3",
				"active": "false",
				"nextName": "arrow4"
			}
		},
		{
			"type": "EntityArrow",
			"x": 636,
			"y": -260,
			"settings": {
				"name": "arrow4",
				"active": "false"
			}
		}
	],
	"layer": []
}/*]JSON*/;
});