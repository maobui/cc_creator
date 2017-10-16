import Star from "./Star"
import Player from "./Player"

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game extends cc.Component {

    @property(cc.Prefab)
    starPrefab: cc.Prefab = null;

    // the random scale of disappearing time for stars
    @property(cc.Float)
    maxStarDuration = 0;
    @property(cc.Float)
    minStarDuration = 0;

    @property(cc.Node)
    ground: cc.Node = null;

    // @property(cc.Node)
    // player: cc.Node = null;   
    @property(Player)
    player: Player = null;

    @property(cc.Label)
    scoreDisplay: cc.Label = null;

    @property(cc.AudioClip)
    scoreAudio = null;

    @property(cc.Node)
    gameOverNode: cc.Node = null;

    @property(cc.Node)
    buttonPlay: cc.Node = null;

    groundY = 0;

    score: number = 0;

    timer = 0;
    starDuration = 0;

    newStar: cc.Node = null;

    isGamePaused: boolean = false;
    onLoad() {
        // init logic
        // obtain the anchor point of ground level on the y axis
        this.groundY = this.ground.y + this.ground.height/2;   // this.ground.top may also work
        // initialize timer
        this.timer = 0;
        this.starDuration = 0;
        // generate a new star
        //this.spawnNewStar();
        // initialize scoring
        this.score = 0;
        //
        this.gameOverNode.active = false;
    }

    spawnNewStar() {
        // generate a new node in the scene with a preset template
        /*var*/this.newStar = cc.instantiate(this.starPrefab);
        // put the newly added node under the Canvas node
        this.node.addChild(this.newStar);
        // set up a random position for the star
        this.newStar.setPosition(this.getNewStarPosition());
        // deliver the concrete example of the Game component into the star component
        this.newStar.getComponent('Star').game = this;
        // reset timer, randomly choose a value according the scale of star duration
        this.starDuration = this.minStarDuration + cc.random0To1() * (this.maxStarDuration - this.minStarDuration);
        this.timer = 0;
    }

    getNewStarPosition () {
        var randX = 0;
        // According to the position of the ground level and the main character's jump height, randomly obtain an anchor point of the star on the y axis
        var randY = this.groundY + cc.random0To1() * this.player.jumpHeight + 50;//this.player.getComponent('Player').jumpHeight + 50;
        // according to the width of the screen, randomly obtain an anchor point of star on the x axis
        var maxX = this.node.width/2;
        randX = cc.randomMinus1To1() * maxX;
        // return to the anchor point of the star
        return cc.p(randX, randY);
    }

    gainScore () {
        this.score ++;
        this.scoreDisplay.string = "Score : " + this.score.toString();
        // play the scoring sound effect
        cc.audioEngine.playEffect(this.scoreAudio, false);
    }

    resetScore () {
        this.score  = 0;
        this.scoreDisplay.string = "Score : " + this.score.toString();
    }

    update (dt) {
        // update timer for each frame, when a new star is not generated after exceeding duration
        // invoke the logic of game failure
        if (this.isGamePaused)
            return;
        if (this.timer > this.starDuration) {
            this.gameOver();
            return;
        }
        this.timer += dt;
    }

    gameOver () {
        this.isGamePaused = true;
        this.player.stopMove();//this.player.getComponent('Player').stopMove(); // stop the jumping action of the player node
        this.gameOverNode.active = true;
        this.buttonPlay.setPositionX(0);
        if (this.newStar != null)
            this.newStar.destroy();
        // cc.director.loadScene('game');
    }

    onStartGame () {
        this.resetScore();
        this.gameOverNode.active = false;
        this.player.startMoveAt(cc.p(0, this.groundY));
        this.spawnNewStar();
        this.buttonPlay.setPositionX(3000);
        this.isGamePaused = false;
    }
}
