const {ccclass, property} = cc._decorator;

@ccclass
export default class Star extends cc.Component {

    @property({
        type: cc.Float
    })
    // When the distance between the star and main character is less than this value, collection of the point will be completed
    pickRadius = 0;

    
    getPlayerDistance () {
        // judge the distance according to the position of the player node
        var playerPos = this.game.player.node.getPosition();
        // calculate the distance between two nodes according to their positions
        var dist = cc.pDistance(this.node.position, playerPos);
        return dist;
    }

    onPicked () {
        // When the stars are being collected, invoke the interface in the Game script to generate a new star
        this.game.spawnNewStar();
        // // 
        this.game.gainScore();
        // then destroy the current star's node
        this.node.destroy();
    }

    

    // use this for initialization
    onLoad() {
        // init logic
        
    }

    // called every frame, uncomment this function to activate update callback
    update (dt) {
        // judge if the distance between the star and main character is shorter than the collecting distance for each frame
        if (this.getPlayerDistance() < this.pickRadius) {
            // invoke collecting behavior
            this.onPicked();
            return;
        }

        // update the transparency of the star according to the timer in the Game script
        var opacityRatio = 1 - this.game.timer/this.game.starDuration;
        var minOpacity = 50;
        this.node.opacity = minOpacity + Math.floor(opacityRatio * (255 - minOpacity));
    }
}
