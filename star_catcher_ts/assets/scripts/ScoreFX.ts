const {ccclass, property} = cc._decorator;

@ccclass
export default class ScoreFX extends cc.Component {

    @property(cc.Animation)
    anim = null;

    init (game) {
        this.game = game;
        this.anim.getComponent('ScoreAnim').init(this);
    }

    despawn () {
        this.game.despawnScoreFX(this.node);
    }

    play () {
        this.anim.play('score_pop');
    }
}
