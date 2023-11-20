import {Scene, Game, AUTO} from 'phaser';
import './style.css'
import GameConfig = Phaser.Types.Core.GameConfig;


class PhaserScene extends Scene {
    preload() {
        this.load.setBaseURL('https://labs.phaser.io')

        this.load.image('sky', 'assets/skies/space3.png');
        this.load.image('logo', 'assets/sprites/phaser3-logo.png');
        this.load.image('particle', 'assets/particles/red.png');
    }

    create() {
       this.add.image(400, 300, 'sky')

        const particles = this.add.particles(0,0,'particle', {
            speed: 100,
            scale: {
                start: 1,
                end: 0
            },
            blendMode: 'ADD'
        })

        const logo = this.physics.add.image(400, 100, 'logo')
        logo.setVelocity(100,200)
        logo.setBounce(0.9, 0.9)
        logo.setCollideWorldBounds(true)


        particles.startFollow(logo)
    }

}


const config : GameConfig= {
    scene: PhaserScene,
    type: AUTO,

    width: 600,
    height: 600,
    physics: {
       default: 'arcade',
        arcade: {
           gravity: {
               y: 200
           }
        }
    }
}

new Game(config)

