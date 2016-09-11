
function DisplayObject( ctx, game, sprite, props ) {

    props = props || {};

    /**
     * X position of the object
     * @type {number}
     */
    this.x = props.x || 0;

    /**
     * Y position of the object
     * @type {number}
     */
    this.y = props.y || 0;

    /**
     *  X velocity
     *
     */
    this.vx = props.vx || 0;

    /**
     * The acceleration of the object
     * @type {number}
     */
    this.acceleration = 0;

    /**
     * Width of the object
     * @type {number}
     */
    this.width = props.width || 0;

    /**
     * Height of the object
     * @type {number}
     */
    this.height = props.height || 0;

    /**
     * The scale of the object
     * @type {number}
     */
    this.scale = 1;

    /**
     * The rotation of the object
     * @type {number}
     */
    this.rotation = 0;

    /**
     * Is the object visible on the screen
     * @type {boolean}
     */
    this.visible = true;

    /**
     * This Sprite
     * @type {}
     */
    this.sprite = sprite;

    /**
     * Thew canvas 2d context
     * @type {CanvasRenderingContext2D}
     */
    this.ctx = ctx;

    /**
     * Reference to the game
     * @type {{}}
     */
    this.game = game || {};
}

DisplayObject.prototype.update = function(){
    this.x -= this.game.speed;
    this.visible = this.x > -this.width;
};

DisplayObject.prototype.render = function(){
    if(this.x < this.ctx.canvas.width + 1)
        this.ctx.drawImage(this.sprite, 0, 0, this.width, this.height, ~~this.x, ~~this.y, this.width, this.height);
};