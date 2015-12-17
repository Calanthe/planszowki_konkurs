var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

function preload() {

	game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
	game.load.spritesheet('enemy', 'assets/enemy.gif', 32, 32);
	game.load.image('starBig', 'assets/star2.png');
	game.load.image('background', 'assets/bg.gif');
	game.load.image('brick', 'assets/brick.gif');

}
var enemy1;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var w = 800;
var h = 600;
var tree1, tree2, tree3;
var half = 1;
var platforms;

function rand(num){
	return Math.floor(Math.random() * num)
};

function create() {

	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.stage.backgroundColor = '#000000';

	bg = game.add.tileSprite(0, 0, 800, 600, 'background');
	bg.fixedToCamera = true;

	game.world.setBounds(0, 0, 1200, 600);

	game.physics.arcade.gravity.y = 250;

	player = game.add.sprite(32, 32, 'dude');
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

	/*tree3 = game.add.sprite(150, 500, 'starBig');
	tree3.anchor.setTo(0.5, 0.5);*/

	game.physics.enable([tree1, tree2/*, tree3*/], Phaser.Physics.ARCADE);
	tree2.body.collideWorldBounds = true;

	/*enemies = game.add.group();
	enemies.createMultiple(3, 'enemy');
	enemies.setAll('outOfBoundsKill', true);
	enemyTime = 0;*/

	enemy1 = game.add.sprite(w + 130, h - 10, 'enemy');
	enemy1.anchor.setTo(0.5, 0.5);

	createEnemy(enemy1);

	buildLevel();
}

function update() {

	game.physics.arcade.collide(player, platforms);
	game.physics.arcade.collide(enemy1, platforms);
	game.physics.arcade.collide(tree1, platforms);
	game.physics.arcade.collide(tree2, platforms);
	game.physics.arcade.collide(tree3, platforms);
	game.physics.arcade.overlap(player, tree1, leavePresent, null, this);
	game.physics.arcade.overlap(player, tree2, leavePresent, null, this);
	game.physics.arcade.overlap(player, tree3, leavePresent, null, this);
	game.physics.arcade.overlap(player, enemy1, collide, null, this);

	updateEnemy(enemy1);

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

	var bar1 = platforms.create(w/4, h-60, 'brick');
	bar1.anchor.setTo(0.5, 0.5);
	bar1.scale.setTo(6, 1);

	var bar2 = platforms.create(w/2, h-120, 'brick');
	bar2.anchor.setTo(0.5, 0.5);
	bar2.scale.setTo(6, 1);

	var bar3 = platforms.create(w, h-20, 'brick');
	bar3.anchor.setTo(0.5, 0.5);

	var bar4 = platforms.create(w+260, h-20, 'brick');
	bar4.anchor.setTo(0.5, 0.5);

	/*var bottom1 = platforms.create(0, h, 'brick');
	bottom1.anchor.setTo(0, 1);
	bottom1.scale.setTo(11, 1);

	var bottom1bis = platforms.create(0, h-20, 'brick');
	bottom1bis.anchor.setTo(0, 1);
	bottom1bis.scale.setTo(4, 1);

	var bottom2 = platforms.create(w/2+30, h, 'brick');
	bottom2.anchor.setTo(0, 1);
	bottom2.scale.setTo(11, 1);

	var bottom2bis = platforms.create(w/2+170, h-20, 'brick');
	bottom2bis.anchor.setTo(0, 1);
	bottom2bis.scale.setTo(4, 1);

	var top1 = platforms.create(0, 0, 'brick');
	top1.anchor.setTo(0, 0);
	top1.scale.setTo(9, 1);

	var top2 = platforms.create(w/2+60, 0, 'brick');
	top2.anchor.setTo(0, 0);
	top2.scale.setTo(9, 1);

	var middle1 = platforms.create(w/2, h*1/4+10, 'brick');
	middle1.anchor.setTo(0.5, 0.5);
	middle1.scale.setTo(14, 1);

	var middle2 = platforms.create(w/2, h*3/4-10, 'brick');
	middle2.anchor.setTo(0.5, 0.5);
	middle2.scale.setTo(14, 1);

	var middle3 = platforms.create(0, h/2, 'brick');
	middle3.anchor.setTo(0, 0.5);
	middle3.scale.setTo(5, 1);

	var middle4 = platforms.create(w/2+150, h/2, 'brick');
	middle4.anchor.setTo(0, 0.5);
	middle4.scale.setTo(5, 1);*/

	platforms.setAll('body.immovable', true);
	platforms.setAll('body.allowGravity', false);
}

function enemyDie(enemy) {
	console.log('enemyDie');
	var tmp = game.add.tween(enemy.scale).to({y : 0}, 150, Phaser.Easing.Linear.None).start();
	tmp.onComplete.add(function(){
		enemy.kill();
	});
	enemy.alive = false;
}

function playerDie() {
	console.log('playerDie');
	if (player.alive) {
		player.alive = false;
		var tmp = game.add.tween(player).to({y : h+10}, 500, Phaser.Easing.Linear.None).start();
		game.add.tween(player).to({angle : 360}, 500, Phaser.Easing.Linear.None).start();
		tmp.onComplete.add(playerInit, this);
		//this.updateBestScore();
		enemies.forEachAlive(function(e){
			enemyDie(e, true)
		}, this);
	}
}

function playerInit() {
	player.x = w/2;
	player.y = h/2;
	player.alive = true;
}

function updateEnemy(enemy) {
	if (enemy.body.velocity.x == 0) {
		enemy.body.velocity.x = -70;
		enemy.animations.play('walk');

		if (enemy.scale.x == -1)
			enemy.body.velocity.x *= -1;
	}
}

function createEnemy(enemy) {
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

	enemy.body.collideWorldBounds = true;
}

function leavePresent(player, tree) {
	console.log('tree: ', tree);
	tree.kill();
}

function render () {

	// game.debug.text(game.time.physicsElapsed, 32, 32);
	// game.debug.body(player);
	// game.debug.bodyInfo(player, 16, 24);

}