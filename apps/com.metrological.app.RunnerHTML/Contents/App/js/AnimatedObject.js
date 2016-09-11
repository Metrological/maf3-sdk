
function AnimatedObject(ctx, game, settings, sprite, animFrames, props){

    DisplayObject.call(this, ctx, game, sprite, props);

    /**
     * The  animation frames
     * @type {{}}
     */
    this.animation = animFrames;

    /**
     * The length of the animation
     * todo: refactor, for test i removed the last sliding frame
     * @type {number}
     */
    this.animationLength = this.animation.length - (props.skipFrames || 0);
    /**
     * Amount of frames passed
     * @type {number}
     */
    this.frames = 0;

    /**
     * Current frame of the animation
     * @type {number}
     */
    this.frame = 0;

    /**
     * Speed at which the sprite jumps
     * to the next frame
     * @type {number}
     */
    this.spriteChangeSpeed = settings.spriteChangeSpeed;

    /**
     * Random y position of aniamte object
     * @type {boolean}
     */
    this.yRandom = props.yRandom || false;

    /**
     * Is it possible for the frame to change
     * @type {boolean}
     */
    this.animationFrameLocked = false;
}

AnimatedObject.prototype = Object.create(DisplayObject.prototype);

AnimatedObject.prototype.constructor = AnimatedObject;

AnimatedObject.prototype.update = function(){

    this.frame += this.game.frames % (this.spriteChangeSpeed + 2) === 0 ? 1 : 0;
    this.frame %= this.animationLength;

    this.x -= this.game.speed;
    this.visible = this.x > -this.width;
};

AnimatedObject.prototype.render = function(){
    if(this.x < 961){
        this.ctx.drawImage(
            this.sprite,
            ~~this.animation[this.frame].x,
            ~~this.animation[this.frame].y,
            this.animation[this.frame].w,
            this.animation[this.frame].h,
            ~~this.x,
            ~~this.y,
            this.animation[this.frame].w,
            this.animation[this.frame].h
        );
    }
};