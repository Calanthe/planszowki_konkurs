var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.tilemap('level', 'assets/level.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles-1', 'assets/tiles-1.png');
	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	game.load.spritesheet('droid', 'assets/droid.png', 32, 32);
	game.load.image('starSmall', 'assets/star.png');
	game.load.image('starBig', 'assets/star2.png');
	game.load.image('background', 'assets/background2.png');

}
var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var w = 500;
var h = 350;
var coin;
var coinPosition, coinX;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#000000';

	bg = game.add.tileSprite(0, 0, 800, 600, 'background');
	bg.fixedToCamera = true;

	map = game.add.tilemap('level');

	map.addTilesetImage('tiles-1');

	map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

	layer = map.createLayer('Tile Layer 1');

	//  Un-comment this on to see the collision tiles
	// layer.debug = true;

	layer.resizeWorld();

	game.physics.arcade.gravity.y = 250;

	player = game.add.sprite(32, 32, 'dude');
	game.physics.enable(player, Phaser.Physics.ARCADE);

	player.body.bounce.y = 0.2;
	player.body.collideWorldBounds = true;
	player.body.setSize(20, 32, 5, 16);

	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('turn', [4], 20, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);

	game.camera.follow(player);

	cursors = game.input.keyboard.createCursorKeys();
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);

	coin = game.add.sprite(150, 200, 'starBig');
	//coin.body.gravity.y = 10;
	//coin.body.bounce.y = 0.3;
	coin.anchor.setTo(0.5, 0.5);
	game.physics.enable(coin, Phaser.Physics.ARCADE);

	//game.physics.enable( [ player, coin ], Phaser.Physics.ARCADE);
	/*coinPosition = [];
	coinPosition[0] = [[150, h/2], [w-150, h/2], [50, h-100], [w-50, h-100]];
	coinPosition[1] = coinPosition[0].concat([[60, 100], [w-60, 100]]);
	coinPosition[2] = coinPosition[1].concat([[130, 50], [w-130, 50], [200, h-60], [w-200, h-60]]);
	coinX = 0;*/
}

function update() {

	game.physics.arcade.collide(player, layer);
	game.physics.arcade.collide(player, coin);
	//game.physics.arcade.overlap(player, coin, takeCoin, null, this);

	player.body.velocity.x = 0;

	if (cursors.left.isDown)
	{
		player.body.velocity.x = -150;

		if (facing != 'left')
		{
			player.animations.play('left');
			facing = 'left';
		}
	}
	else if (cursors.right.isDown)
	{
		player.body.velocity.x = 150;

		if (facing != 'right')
		{
			player.animations.play('right');
			facing = 'right';
		}
	}
	else
	{
		if (facing != 'idle')
		{
			player.animations.stop();

			if (facing == 'left')
			{
				player.frame = 0;
			}
			else
			{
				player.frame = 5;
			}

			facing = 'idle';
		}
	}

	if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
	{
		player.body.velocity.y = -200;
		jumpTimer = game.time.now + 750;
	}

}

function blabla() {
	return true;
}

function takeCoin(player, coin) {
	console.log('takeCoin');
	/*var tab = this.coinPosition[i];
	this.coin_s.play('', 0, 0.15);
	var ra = rand(tab.length);

	if (ra == this.coinX) ra = (ra + 1) % tab.length;

	this.coinX = ra;
	coin.reset(tab[ra][0], tab[ra][1]);
	this.oneCoin = true;*/
}

function render () {

	// game.debug.text(game.time.physicsElapsed, 32, 32);
	// game.debug.body(player);
	// game.debug.bodyInfo(player, 16, 24);

}