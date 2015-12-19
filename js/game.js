var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update});

function preload() {

	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	game.load.spritesheet('enemy', 'assets/enemy.gif', 32, 32);
	game.load.image('starBig', 'assets/star2.png');
	game.load.image('background', 'assets/bg.gif');
	game.load.image('brick', 'assets/brick.gif');

}
var enemy1, enemy2, enemy3, enemy4;
var player;
var facing = 'left';
var cursors;
var jumpButton;
var bg;
var w = 800;
var h = 600;
var tree1, tree2, tree3, tree4;
var platforms, walls;

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#000000';

	bg = game.add.tileSprite(0, 0, 800, 600, 'background');
	bg.fixedToCamera = true;

	game.world.setBounds(0, 0, 2640, 600);

	game.physics.arcade.gravity.y = 250;

	player = game.add.sprite(2300, 500, 'dude');
	game.camera.follow(player);
	game.physics.enable(player, Phaser.Physics.ARCADE);

	player.body.bounce.y = 0.2;
	player.body.gravity.y = 12;
	player.anchor.setTo(0.5, 0.5);
	player.body.collideWorldBounds = true;
	player.body.setSize(20, 32, 5, 16);

	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('turn', [4], 20, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);

	game.camera.follow(player);

	cursors = game.input.keyboard.createCursorKeys();
	jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.UP);

	tree1 = game.add.sprite(w/2 + 20, h - 140, 'starBig');
	tree1.anchor.setTo(0.5, 0.5);

	tree2 = game.add.sprite(w + 130, h - 10, 'starBig');
	tree2.anchor.setTo(0.5, 0.5);

	tree3 = game.add.sprite(2460, h - 210, 'starBig');
	tree3.anchor.setTo(0.5, 0.5);

	tree4 = game.add.sprite(1800, h - 240, 'starBig');
	tree4.anchor.setTo(0.5, 0.5);

	game.physics.enable([tree1, tree2, tree3], Phaser.Physics.ARCADE);
	tree2.body.collideWorldBounds = true;

	enemy1 = game.add.sprite(w + 130, h - 10, 'enemy');
	enemy1.anchor.setTo(0.5, 0.5);

	createEnemy(enemy1);

	enemy2 = game.add.sprite(2440, h - 190, 'enemy');
	enemy2.anchor.setTo(0.5, 0.5);

	createEnemy(enemy2);

	enemy3 = game.add.sprite(2000, h - 190, 'enemy');
	enemy3.anchor.setTo(0.5, 0.5);

	createEnemy(enemy3);

	enemy4 = game.add.sprite(2600, h, 'enemy');
	enemy4.anchor.setTo(0.5, 0.5);

	createEnemy(enemy4);

	buildLevel();
}

function update() {

	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(player, walls);
	game.physics.arcade.collide(enemy1, platforms);
	game.physics.arcade.collide(enemy2, platforms);
	game.physics.arcade.collide(enemy3, platforms);
	game.physics.arcade.collide(enemy4, platforms);
	game.physics.arcade.collide(tree1, platforms);
	game.physics.arcade.collide(tree2, platforms);
	game.physics.arcade.collide(tree3, platforms);
	game.physics.arcade.overlap(player, tree1, leavePresent, null, this);
	game.physics.arcade.overlap(player, tree2, leavePresent, null, this);
	game.physics.arcade.overlap(player, tree3, leavePresent, null, this);
	game.physics.arcade.overlap(player, enemy1, collide, null, this);
	game.physics.arcade.overlap(player, enemy2, collide, null, this);
	game.physics.arcade.overlap(player, enemy3, collide, null, this);
	game.physics.arcade.overlap(player, enemy4, collide, null, this);
	game.physics.arcade.collide(enemy1, walls, enemyWall, null, this);
	game.physics.arcade.collide(enemy2, walls, enemyWall, null, this);
	game.physics.arcade.collide(enemy3, walls, enemyWall, null, this);
	game.physics.arcade.collide(enemy4, walls, enemyWall, null, this);

	updateEnemy([enemy1, enemy2, enemy3, enemy4]);

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

	/*if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
	{
		player.body.velocity.y = -200;
		jumpTimer = game.time.now + 750;
	}*/

	if (jumpButton.isDown && (player.body.touching.down || player.body.onFloor())) {
		player.body.velocity.y = -200;
	}

	//newEnemy();
}

function collide(player, enemy) {
	playerDie();
}

function buildLevel() {
	platforms = game.add.physicsGroup();
	walls = game.add.physicsGroup();

	var bar1 = platforms.create(w/4, h-60, 'brick');
	bar1.anchor.setTo(0.5, 0.5);
	bar1.scale.setTo(6, 1);

	var bar2 = platforms.create(w/2, h-120, 'brick');
	bar2.anchor.setTo(0.5, 0.5);
	bar2.scale.setTo(6, 1);

	var wall1 = walls.create(w, h-20, 'brick');
	wall1.anchor.setTo(0.5, 0.5);

	var wall2 = walls.create(w+260, h-20, 'brick');
	wall2.anchor.setTo(0.5, 0.5);

	var bar5 = platforms.create(w+500, h-50, 'brick');
	bar5.anchor.setTo(0.5, 0.5);
	bar5.scale.setTo(2, 1);

	var bar6 = platforms.create(w+700, h-90, 'brick');
	bar6.anchor.setTo(0.5, 0.5);
	bar6.scale.setTo(2, 1);

	var longbar7 = platforms.create(w+1300, h-110, 'brick');
	longbar7.anchor.setTo(0.5, 0.5);
	longbar7.scale.setTo(40, 1);

	var longbar8 = platforms.create(w+1300, h-220, 'brick');
	longbar8.anchor.setTo(0.5, 0.5);
	longbar8.scale.setTo(40, 1);

	var wall3 = walls.create(w+1690, h-160, 'brick');
	wall3.anchor.setTo(0.5, 0.5);
	wall3.scale.setTo(1, 5);

	var wall4 = walls.create(w+910, h-130, 'brick');
	wall4.anchor.setTo(0.5, 0.5);
	wall4.scale.setTo(1, 3);

	var wall5 = walls.create(w+1690, h, 'brick');
	wall5.anchor.setTo(0.5, 0.5);
	wall5.scale.setTo(1, 5);

	var wall6 = walls.create(w+1830, h, 'brick');
	wall6.anchor.setTo(0.5, 0.5);
	wall6.scale.setTo(1, 11);

	var wall7 = walls.create(w+1710, h-178, 'brick');
	wall7.anchor.setTo(0.5, 0.5);
	wall7.scale.setTo(1, 1);


	platforms.setAll('body.immovable', true);
	platforms.setAll('body.allowGravity', false);

	walls.setAll('body.immovable', true);
	walls.setAll('body.allowGravity', false);
}

function playerDie() {
	if (player.alive) {
		player.alive = false;
		var tmp = game.add.tween(player).to({y : h+10}, 500, Phaser.Easing.Linear.None).start();
		game.add.tween(player).to({angle : 360}, 500, Phaser.Easing.Linear.None).start();
		tmp.onComplete.add(playerInit, this);
		//this.updateBestScore();
		shakeScreen(10, 100);
	}
}

function shakeScreen(i, t) {
	game.add.tween(game.camera).to({y : i}, t, Phaser.Easing.Linear.None)
		.to({y : -i}, t, Phaser.Easing.Linear.None)
		.to({y : 0}, t, Phaser.Easing.Linear.None).start();

	game.add.tween(game.camera).to({x : i}, t, Phaser.Easing.Linear.None)
		.to({x : -i}, t, Phaser.Easing.Linear.None)
		.to({x : 0}, t, Phaser.Easing.Linear.None).start();
}

function playerInit() {
	player.x = w/2;
	player.y = h/2;
	player.alive = true;
}

function updateEnemy(enemies) {
	enemies.forEach(function(enemy){
		if (enemy.body.velocity.x == 0) {
			enemy.body.velocity.x = -70;
			enemy.animations.play('walk');

			if (enemy.scale.x == -1)
				enemy.body.velocity.x *= -1;
		}
	});
}

function createEnemy(enemy) {
	enemy.scale.setTo(1, 1);
	enemy.anchor.setTo(0.5, 1);
	game.physics.enable(enemy, Phaser.Physics.ARCADE);
	enemy.body.gravity.y = 5;
	enemy.body.velocity.x = -100;
	enemy.animations.add('walk', [0, 1], 3, true);

	enemy.body.collideWorldBounds = true;
}

function leavePresent(player, tree) {
	console.log('tree: ', tree);
	tree.kill();
}

function enemyWall(enemy, wall) {
	var scaleX = enemy.scale.x * -1;
	enemy.body.velocity.x *= -1;
	enemy.scale.setTo(scaleX, 1);
}