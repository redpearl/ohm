ig.module( 'game.levels.level01' )
.requires( 'impact.image','game.entities.barrier','game.entities.breakableBlock','game.entities.arrow','game.entities.block' )
.defines(function(){
LevelLevel01=/*JSON[*/{
	"entities": [
		{
			"type": "EntityBarrier",
			"x": 676,
			"y": -1304
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": -24
		},
		{
			"type": "EntityArrow",
			"x": 516,
			"y": 160,
			"settings": {
				"name": "arrow",
				"active": "false",
				"nextName": "arrow2"
			}
		},
		{
			"type": "EntityArrow",
			"x": 556,
			"y": 160,
			"settings": {
				"name": "arrow2",
				"active": "false",
				"nextName": "arrow3"
			}
		},
		{
			"type": "EntityArrow",
			"x": 596,
			"y": 160,
			"settings": {
				"name": "arrow3",
				"active": "false",
				"nextName": "arrow4"
			}
		},
		{
			"type": "EntityBlock",
			"x": 588,
			"y": 68,
			"settings": {
				"targetName": "arrow"
			}
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 168
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 232
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 296
		},
		{
			"type": "EntityBreakableBlock",
			"x": 348,
			"y": 136
		},
		{
			"type": "EntityBreakableBlock",
			"x": 348,
			"y": 168
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 136
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 8
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 40
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 200
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 104
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 264
		},
		{
			"type": "EntityBreakableBlock",
			"x": 316,
			"y": 72
		},
		{
			"type": "EntityBreakableBlock",
			"x": 348,
			"y": 104
		},
		{
			"type": "EntityArrow",
			"x": 636,
			"y": 160,
			"settings": {
				"name": "arrow4",
				"active": "false"
			}
		}
	],
	"layer": []
}/*]JSON*/;
});