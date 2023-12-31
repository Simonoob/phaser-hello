import {AUTO, Game, Scene} from 'phaser';
import './style.css'
import GameConfig = Phaser.Types.Core.GameConfig;
import SpriteWithDynamicBody = Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
import GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;
import Text = Phaser.GameObjects.Text;

let player: SpriteWithDynamicBody
let stars: Phaser.Types.Physics.Arcade.ArcadeColliderType
let score = 0
let scoreText: Text
let bombs: Phaser.Types.Physics.Arcade.ArcadeColliderType
let gameOver = false

function collectStar(player: GameObjectWithBody, star: GameObjectWithBody) {
    star.disableBody(true, true);
    score += 10;
    scoreText.setText('Score: ' + score);


    if (stars.countActive(true) === 0) {
        stars.children.iterate(function (child) {

            child.enableBody(true, Phaser.Math.Between(100, 600), 0, true, true);

        });

        const x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        const bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

    }
}

function hitBomb(player, bomb) {
    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}

class PhaserScene extends Scene {
    preload() {
        this.load.image('sky', '/assets/sky.png');
        this.load.image('ground', '/assets/platform.png');
        this.load.image('star', '/assets/star.png');
        this.load.image('bomb', '/assets/bomb.png');
        this.load.spritesheet('dude',
            '/assets/dude.png',
            {frameWidth: 32, frameHeight: 48}
        );
    }

    create() {
        this.add.image(400, 300, 'sky');

        const platforms = this.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');


        player = this.physics.add.sprite(100, 450, 'dude')
        player.setBounce(0.2)
        player.setCollideWorldBounds(true)
        this.physics.add.collider(player, platforms);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1,
        })

        this.anims.create({
            key: 'turn',
            frames: [{key: 'dude', frame: 4}],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });


        stars = this.physics.add.group({
            key: 'star',
            repeat: 0,
            setXY: {x: Phaser.Math.Between(100, 600), y: 0},
            active: true,
            bounceY: Phaser.Math.FloatBetween(0.4, 0.8)
        });


        this.physics.add.collider(stars, platforms);
        this.physics.add.overlap(player, stars, collectStar, null, this);

        scoreText = this.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});


        bombs = this.physics.add.group();

        this.physics.add.collider(bombs, platforms);

        this.physics.add.collider(player, bombs, hitBomb, null, this);
    }

    update() {
        if (gameOver) {
            this.physics.pause()
            return;
        }
        const cursors = this.input.keyboard?.createCursorKeys();
        if (!cursors) return


        if (cursors.left.isDown) {
            player.setVelocityX(-160);

            player.anims.play('left', true);
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);

            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down) {
            player.setVelocityY(-330);
        }


    }

}


const config: GameConfig = {
    type: AUTO,
    width: 600,
    height: 600,

    scene: PhaserScene,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    },
}

new Game(config)

