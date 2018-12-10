var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

var player;
var platforms;
var ledge;
var ledge3;
var cursors;
var stars;
var eple;
var elevator;
var score = 0;
var scoreText;

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('eple', 'assets/eple.png');
    game.load.spritesheet('geir', 'assets/geir2.png', 406.6, 473);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');

    // ground
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    // ledges
    ledge = platforms.create(-100, 150, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.5, 0.5);
    ledge = platforms.create(700, 150, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.5, 0.5);
    ledge = platforms.create(100, 250, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.3, 0.5);
    ledge = platforms.create(600, 350, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.3, 0.5);
    ledge = platforms.create(500, 450, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.3, 0.5);
    ledge = platforms.create(250, 350, 'ground');
    ledge.body.immovable = true;
    ledge.scale.setTo(0.3, 0.5);

    // horisontal heis
    elevator = platforms.create(350, 170, "ground");
    elevator.scale.setTo(0.3, 0.5);
    elevator.body.immovable = true;
    elevator.body.allowGravity = false;
    elevator.body.bounce.y = 1;
    elevator.body.velocity.x = 150;

    // Vegg som rammer inn
    var wall1 = platforms.create(0, 0, "ground");
    wall1.scale.setTo(0.01, 30);
    wall1.body.immovable = true;
    var wall2 = platforms.create(795, 0, "ground");
    wall2.scale.setTo(0.01, 20);
    wall2.body.immovable = true;

    // Geir
    player = game.add.sprite(100, game.world.height - 250, 'geir');
    game.physics.arcade.enable(player);
    player.scale.setTo(0.3, 0.3);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1], 10, true);
    player.animations.add('right', [3, 4], 10, true);

    cursors = game.input.keyboard.createCursorKeys();

    // pickup ting
    epler = game.add.group();
    epler.enableBody = true;
    for (var i = 0; i < 10; i++) {
        var eple = epler.create(i * 80, 0, 'eple');
        eple.body.gravity.y = 300;
        eple.body.bounce.y = 0.7 + Math.random() * 0.2;
        eple.scale.setTo(0.1, 0.1);
    }

    scoreText = game.add.text(640, 16, 'score: 0', {
        fontSize: '32px',
        fill: '#000'
    });
}

function update() {
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    player.body.velocity.x = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x = -130;
        player.animations.play('left');
    } else if (cursors.right.isDown) {
        player.body.velocity.x = 130;
        player.animations.play('right');
    } else {
        player.animations.stop();
        player.frame = 2;
    }

    if (cursors.up.isDown && player.body.touching.down && hitPlatform) {
        player.body.velocity.y = -250;
    }

    game.physics.arcade.collide(platforms, elevator);
    game.physics.arcade.collide(epler, platforms);
    game.physics.arcade.overlap(player, epler, collectEple, null, this);

    // horisontal
    if (elevator.body.position.x < 1) {
        elevator.body.velocity.x = 200;
    } else if (elevator.body.position.x > 679) {
        elevator.body.velocity.x = -200;
    }


}

function collectEple(player, eple) {
    eple.kill();

    score += 1;
    scoreText.text = 'Score: ' + score;
}
