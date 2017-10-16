const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {

    @property({
        type: cc.Float
    })
    jumpHeight = 0;

    @property({
        type: cc.Float
    })
    jumpDuration = 0;

    @property({
        type: cc.Float
    })
    maxMoveSpeed:number = 0;

    @property({
        type: cc.Float
    })
    accel:number = 0;

    @property({
        url: cc.AudioClip
    })
    jumpAudio = null;

    jumpAction = null;

    accLeft = false;
    accRight = false;

    xSpeed = 0;
    // screen boundaries
    minPosX = 0;
    maxPosX = 0;

    setJumpAction () {
        // jump up
        var jumpUp = cc.moveBy(this.jumpDuration, cc.p(0, this.jumpHeight)).easing(cc.easeCubicActionOut());
        // jump down
        var jumpDown = cc.moveBy(this.jumpDuration, cc.p(0, -this.jumpHeight)).easing(cc.easeCubicActionIn());
        // repeat
        // return cc.repeatForever(cc.sequence(jumpUp, jumpDown));
        var callback = cc.callFunc(this.playJumpSound, this);
        return cc.repeatForever(cc.sequence(jumpUp, jumpDown, callback));
    }

    playJumpSound () {
        // invoke sound engine to play the sound
        cc.audioEngine.playEffect(this.jumpAudio, false);
    }

    setInputControl () {
        var self = this;
        // add keyboard event listener
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            // When there is a key being pressed down, judge if it's the designated directional button and set up acceleration in the corresponding direction
            onKeyPressed: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = true;
                        self.accRight = false;
                        break;
                    case cc.KEY.d:
                        self.accLeft = false;
                        self.accRight = true;
                        break;
                }
            },
            // when releasing the button, stop acceleration in this direction
            onKeyReleased: function(keyCode, event) {
                switch(keyCode) {
                    case cc.KEY.a:
                        self.accLeft = false;
                        break;
                    case cc.KEY.d:
                        self.accRight = false;
                        break;
                }
            },
        }, self.node);

        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                var touchLoc = touch.getLocation();
                if (touchLoc.x >= cc.winSize.width/2) {
                    self.accLeft = false;
                    self.accRight = true;
                } else {
                    self.accLeft = true;
                    self.accRight = false;
                }
                // don't capture the event
                return true;
            },
            onTouchEnded: function(touch, event) {
                self.accLeft = false;
                self.accRight = false;
            }
        }, self.node);
    }

    onLoad() {
        // init logic
        this.enabled = false;
        // initialize jump action
        this.jumpAction = this.setJumpAction();
        // this.node.runAction(this.jumpAction);

        this.setInputControl();
    }

    update (dt) {
        // 
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        //
        if ( Math.abs(this.xSpeed) > this.maxMoveSpeed ) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 
        this.node.x += this.xSpeed * dt;

        // limit player position inside screen
        if ( this.node.x > this.node.parent.width/2) {
            this.node.x = this.node.parent.width/2;
            this.xSpeed = 0;
        } else if (this.node.x < -this.node.parent.width/2) {
            this.node.x = -this.node.parent.width/2;
            this.xSpeed = 0;
        }
    }

    stopMove () {
        this.node.stopAllActions();
        this.enabled = false;
    }

    startMoveAt (pos) {
        this.enabled = true;
        this.xSpeed = 0;
        this.node.setPosition(pos);
        this.node.runAction(this.setJumpAction());
    }
}
