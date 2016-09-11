function Player( ctx, game, settings, sprite, dust, animFrames, props ){

    AnimatedObject.call(this, ctx, game, settings, sprite, animFrames, props );

    /**
     * PLayer Velocity
     * @type {Number}
     */
    this.v = 0;

    /**
     * Player Gravity
     * @type {Number}
     */
    this.g = settings.gravity;

    /**
     * Player default Gravity
     * @type {Number}
     */
    this.defG = settings.gravity;

    /**
     * Player slide Gravity
     * @type {Number}
     */
    this.slideG = settings.slideGravity;

    /**
     * Jumping speed
     * @type {Number}
     */
    this.jumpSpeed = settings.jumpSpeed;

    /**
     * y position of the floor
     * @type {Number}
     * @todo refactor to Level y position
     */
    this.floorY = props.ppy || settings.playerYPosition;

    /**
     * Is the runner jumping
     * @type {Boolean}
     */
    this.jumping = false;

    /**
     * Can the player double jump
     * @type {Boolean}
     */
    this.canDoubleJump = props.doubleJump || false;

    /**
     * Is the runner double jumping
     * @type {Boolean}
     */
    this.doubleJumping = false;

    /**
     * Is the player sliding
     * @type {boolean}
     */
    this.sliding = false;

    /**
     * Dust animation when died
     * @type {*|{}}
     */
    this.dust = dust || {};

    /**
     * Distance the player slides
     * @type {number}
     */
    this.slideDistance = settings.slideDistance;

    /**
     * Distance the player slides
     * @type {number}
     */
    this.defSlideDistance = settings.slideDistance;

    /**
     * Is the player falling on the floor
     * @type {boolean}
     */
    this.dieing = false;

    /**
     * Is the player dead
     * @type {boolean}
     */
    this.died = false;

    /**
     * slide counter
     * @type {number}
     */
    this.cnt = 0;
}

Player.prototype = Object.create(AnimatedObject.prototype);

Player.prototype.constructor = Player;

Player.prototype.update = function(frames){

    if(!this.animationFrameLocked){
        this.frame += frames % this.spriteChangeSpeed === 0 ? 1 : 0;
        this.frame %= this.animationLength;
    }

    this.v += this.g;
    this.y+=this.v;

    if(!this.died) {
        if (this.sliding) {
            this.slideDistance--;
            if (this.slideDistance === 0) {
                this.sliding = false;
                this.animationFrameLocked = false;
            }
        }
        if (this.y > this.floorY) {
            if (this.jumping) {
                this.jumping = false;
                this.doubleJumping = false;
                this.animationFrameLocked = false;
            }
            this.y = this.floorY;
            this.v = 0;
        }
    }else{
        this.die();
    }

    if(this.dieing){
        this.dust.update();
        this.dust.x = 50;
    }
};

Player.prototype.render = function(){

    if(this.dieing){
        this.dust.render();
    }

    this.ctx.drawImage(
        this.sprite,
        this.animation[this.frame].x,
        this.animation[this.frame].y,
        this.animation[this.frame].w,
        this.animation[this.frame].h,
        this.animation[this.frame].px,
        ~~this.y,
        this.animation[this.frame].w,
        this.animation[this.frame].h
    );


};

Player.prototype.jump = function(){

    if(!this.died){

        this.sliding = false;
        this.animationFrameLocked = true;

        if(!this.jumping){

            this.jumping = true;
            this.v = -this.jumpSpeed;
            this.g = this.defG;
            this.frame = 2;

        }else if(this.canDoubleJump && !this.doubleJumping && this.v <= 3){

            this.doubleJumping = true;
            this.v = -this.jumpSpeed * 0.6;
            this.g = this.defG*0.60;
            this.frame = 6;
        }
    }

    // todo: refactor
    /**
     * This is for quicktesting only
     */
    if(this.died){
        this.died = false;
        this.game.speed = this.game.defSpeed;
        this.animationFrameLocked = false;
        this.dieing = false;
    }

};

Player.prototype.slide = function(){
    if(!this.died){
        this.g = this.slideG;
        this.sliding = true;
        this.jumping = false;
        this.slideDistance = this.defSlideDistance;
        this.animationFrameLocked = true;
        this.frame = 10;
        this.cnt = 0;
    }
};

Player.prototype.die = function(){

    this.animationFrameLocked = true;

    if(this.game.speed > 0.1){
        this.dieing = true;
        this.frame = 8;
        this.game.speed-=0.2;
    }else{
        this.dieing = false;
        this.frame = 9;
        this.game.speed=0;
    }

    this.y = this.floorY;
    this.v = 0;

};

Player.prototype.onColide = function(){
    var self = this;
    setTimeout(function(){
        self.died = true;
    },100);
    this.game.endGame();
};