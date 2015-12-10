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
var enemies;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var w = 800;
var h = 600;
var coin1, coin2, coin3;
var half = 1;

function rand(num){
	return Math.floor(Math.random() * num)
};

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

	coin1 = game.add.sprite(150, 200, 'starBig');
	coin1.anchor.setTo(0.5, 0.5);

	coin2 = game.add.sprite(650, 200, 'starBig');
	coin2.anchor.setTo(0.5, 0.5);

	coin3 = game.add.sprite(150, 500, 'starBig');
	coin3.anchor.setTo(0.5, 0.5);

	game.physics.enable([coin1, coin2, coin3], Phaser.Physics.ARCADE);

	enemies = game.add.group();
	enemies.createMultiple(3, 'droid');
	enemies.setAll('outOfBoundsKill', true);
	enemyTime = 0;
}

function update() {

	game.physics.arcade.collide(player, layer);
	game.physics.arcade.collide(coin1, layer);
	game.physics.arcade.collide(coin2, layer);
	game.physics.arcade.collide(coin3, layer);
	game.physics.arcade.overlap(player, coin1, takeCoin, null, this);
	game.physics.arcade.overlap(player, coin2, takeCoin, null, this);
	game.physics.arcade.overlap(player, coin3, takeCoin, null, this);
	game.physics.arcade.collide(enemies, layer);
	game.physics.arcade.overlap(player, enemies, collide, null, this);

	enemies.forEachAlive(updateEnemy, this);

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

	newEnemy();
}

function collide(player, enemy) {
	if (!player.body.touching.down && player._bounds.bottomRight.y < enemy._bounds.topRight.y+10 && enemy.alive && player.alive) {
		player.body.velocity.y = -150;
		enemyDie(enemy);
	}
	else playerDie();
}

function enemyDie(enemy) {
	console.log('enemyDie: ', enemy);
}

function playerDie() {
	console.log('playerDie');
}

function updateEnemy(enemy) {
	if (enemy.body.velocity.x == 0) {
		enemy.body.velocity.x = -70;
		enemy.animations.play('walk');

		if (enemy.scale.x == -1)
			enemy.body.velocity.x *= -1;
	}
}

function newEnemy() {
	var enemy = enemies.getFirstExists(false);

	if (enemy) {
		enemy.reset(rand(w), 300);
		enemy.scale.setTo(1, 1);
		enemy.anchor.setTo(0.5, 1);
		game.physics.enable(enemy, Phaser.Physics.ARCADE);
		enemy.body.gravity.y = 5;
		enemy.body.velocity.x = 0;
		enemy.animations.add('walk', [0, 1], 3, true);

		if (half == 1) {
			enemy.scale.setTo(-1, 1);
			half = 0;
		} else {
			half = 1;
		}
	}
}

function takeCoin(player, coin) {
	console.log('coin taken: ', coin);
	coin.kill();
}

function render () {

	// game.debug.text(game.time.physicsElapsed, 32, 32);
	// game.debug.body(player);
	// game.debug.bodyInfo(player, 16, 24);

}