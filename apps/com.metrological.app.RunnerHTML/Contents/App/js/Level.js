/**
 *
 * @param ctx
 * @param game
 * @param sprite
 * @param props
 * @param coins
 * @param objectsLow
 * @param objectsHigh
 * @param sign
 * @constructor
 */
function Level(ctx, game, sprite, props, coins, objectsLow, objectsHigh){

    DisplayObject.call(this, ctx, game, sprite);

    props = props || {};

    /**
     * Width of 1 block
     * @type {number}
     */
    this.width = props.width || 300;

    /**
     * height of 1 block
     * @type {number}
     */
    this.height = props.height || 50;

    /**
     * Set of blocks that will be drawn
     * @type {Array}
     */
    this.blocks = [];

    /**
     * level coins
     */
    this.availableCoins = coins || [];

    /**
     * visible coins
     */
    this.activeCoins =  [];

    /**
     * level objects
     */
    this.availableObjectsLow = objectsLow || [];

    /**
     * visible objects
     */
    this.activeObjectsLow = [];

    /**
     * level objects
     */
    this.availableObjectsHigh = objectsHigh || [];

    /**
     * visible objects
     */
    this.activeObjectsHigh = [];

    /**
     * Amount of floor block, fixed for now
     * todo: calculate amount of needed blocks
     * @type {number}
     */
    this.amountOfBlocks = props.blockAmount || 4;

    /**
     * display distance sign
     * @type {boolean}
     */
    this.displayDistance = false;

    /**
     * Current distance
     * @type {number}
     */
    this.distance = 0;

    /**
     * Y Position of sprite
     * @type {number}
     */
    this.yPos = props.ypos || 200;

    /**
     * Level patterns
     * @type {Array}
     */
    this.patterns = [];

    /**
     * ddistance after low object
     * @type {number}
     */
    this.distanceSmall = 40;

    /**
     * Distance after large bject
     * @type {number}
     */
    this.distanceLarge = 50;

    /**
     * Speedfactor to gamespeed
     * @type {number}
     */
    this.speed = props.speed || 1;

    /**
     * Build the current level
     */
    this._build();
}

Level.prototype = Object.create(DisplayObject.prototype);

Level.prototype.constructor = Level;

Level.prototype._build = function(){
    var i = 0, j = this.amountOfBlocks;
    for(;i < j;i++){
        this.blocks.push({
            s: this.sprite,
            x: this.width*i - (i)
        });
    }

    this.patterns = [
        'OL',
        'OL',
        'OL',
        'OL',
        'OH',
        'OH',
        'OH',
        'OH',
        'OH',
        'OH',
        'OL/C80',
        'OL/C80',
        'OL/C60',
        'OL/C60',
        'OL/C40',
        'OL/C40',
        'OL,D900,OL',
        'OL,D900,OL',
        'OL,D600,OL',
        'OL,D900,OL',
        'OL,D800,OL',
        'OH,D1000,OH',
        'OL,D600,C40,D600',
        'OH,D600,C40,D700',
        'OL,D500,C60,D600',
        'OL,D500,C40,D600',
        'OL,D800,C20,D600',
        'OH,D600,C20,D700',
        'OL,D500,C80,D600',
        'OL,D500,C70,D600',
        'OH,D600,C80/C20,D700',
        'OH,D600,C60/C20,D700',
        'OL,D600,C70,D700,OL/C30',
        'OL,D600,C40,D700,OL/C30',
        'C20,C20,C20,C20,C20,C20',
        'C40,C40,C40,C40,C40,C40',
        'C170,C170,C170,C170,C170',
        'OL,D400,OL/C80/C110,OL/C80/C110',
        'OL,D900,OH,D900,OL/C40,D10,OL/C40',
        'OH,D35,C120/C145/C170,D700,OL/C100',
        'C50,D200,C50,D300,C150,D400,C50,C150,C50',
        'OL/C100,OL/C100,OL/C40,OL/C40,D600,OL/C100',
        'C60,C40,OL/C35,C40,C60,D600,OL/C100,OL/C100',
        'C60,C40,OL/C35,C40,C60,D700,OL/C100,OL/C100',
        'OL/C80,OL/C80,OL/C80,D300,OL/C80,OL/C80,OL/C80',
        'C70,C55,C42,C36,C32,C30,D200,OL/C100,D600,OL/C100',
        'C80,D200,C80,D200,C80,D200,C80,D200,C80,D200,C80,D200,OH',
        'OL/C100,D260,OL/C100,D260,OL/C100,OL/C100,D260,OL/C100,OL/C100',
        'OL/C70,OH/C60,D800,OL/C70,D260,OL,D40,C150,C150,D40,OL,D260,OL/C70',
        'OL,D100,C160,C160,C160,C160,D100,OL,D100,C160,C160,C160,D100,OL,D500',
        'OL,D300,C150,C150,C150,C150,D300,OL,OH,D900,OL,OL,D400,OL,OL,D300,C150,C150',
        'OL,D400,OL,D400,OL,D400,C170,D50,OL,D50,C170,D400,OL,D400,OL,D400,OL,D400,OL,D400,OL,D400,OL,D400,OL,OL,D400',
        'OL/C100,D260,OL/C100,D260,OL/C100,OL/C100,D260,OL/C100,OL/C100,D260,OL/C80,OL/C60,OL/C80,D300,OL/C80,OL/C60,OL/C80,D300,C150,D300,C150,D300,C150'
    ];
};

Level.prototype.getPattern = function(){
    var i = Math.floor(Math.random()*this.patterns.length);
    return this.patterns[i];
};

Level.prototype.translatePattern = function(pattern){
    var posX = 961;
    var objects = pattern.split(',').reverse();

    var i = objects.length;
    var j = 0;
    var o = {};
    var last = '';
    var distance = 0;
    var coinY = 0;
    var block;
    var currentSet = [];

    while(i--){

        block = objects[i];
        if(block.indexOf('/') !== -1){
            currentSet = block.split('/').reverse();
        }else{
            currentSet = [block];
        }

        j = currentSet.length;

        last = '';

        while(j--){

            switch(currentSet[j][0]){
                case 'O':
                    if(currentSet[j][1]==='H'){
                        posX+=4;
                        o = this.spawnObject(0, 'availableObjectsHigh', 'activeObjectsHigh', {x:posX});
                        last = 'H';
                    }else{
                        posX+=1;
                        o = this.spawnObject(0, 'availableObjectsLow', 'activeObjectsLow', {x:posX});
                        last = 'L';
                    }
                    break;
                case 'C':
                    coinY = parseInt(currentSet[j].substring(1,currentSet[j].length));
                    o = this.spawnObject(0, 'availableCoins', 'activeCoins', {x:posX+7, y:coinY});
                    break;

                case 'D':
                    distance = parseInt(currentSet[j].substring(1,currentSet[j].length));
                    posX += distance - this.distanceSmall;
                    break;
            }
        }

        if(last === 'H'){
            posX+=this.distanceLarge;
        }else{
            posX+=this.distanceSmall;
        }

    }

};


Level.prototype.update = function(){

    var i = 0,
        j = this.blocks.length;

    // change x position for each block
    for(; i < j; i++){
        this.blocks[i].x-= (this.game.speed * this.speed);
    }

    i = 0;

    // reset x position of block when it's out of viewport
    for(; i < j; i++){
        if(this.blocks[i].x <= -this.width){
            if(i === 0){
                this.blocks[i].x = this.blocks[this.blocks.length-1].x + this.width;
            }else{
                this.blocks[i].x = this.blocks[i-1].x + this.width;
            }
        }
    }
    // coins

    if(this.activeCoins.length > 0 || this.availableCoins.length > 0){
        this.updatePattern();
    }

};

Level.prototype.updatePattern = function(){

    var i = this.activeCoins.length, el = {};

    // update coins

    while(i--){
        el = this.activeCoins[i]
        el.update();
        if(el.x < 170){
            if(Utils.rectColide(this.game.runner,el)){
                this.game.coins++;
                this.freeObject(i, 'activeCoins','availableCoins');
            }
        }
        if(el.x < -50){
            this.freeObject(i, 'activeCoins','availableCoins');
        }
    }

    i = this.activeObjectsLow.length;

    // update low objects

    while(i--){
        el = this.activeObjectsLow[i];
        el.update();

        if(el.x < 170){
            if(Utils.rectColide(this.game.runner,el)){

                this.clearObjects();
                this.game.runner.onColide();

                break;
            }
        }
        if(el.x < -50){
            this.freeObject(i, 'activeObjectsLow','availableObjectsLow');
        }
    }

    i = this.activeObjectsHigh.length;

    // update high objects

    while(i--){
        el = this.activeObjectsHigh[i];
        el.update();
        if(el.x < 170){
            if(Utils.rectColide(this.game.runner,el)){

                this.clearObjects();
                this.game.runner.onColide();

                break;
            }
        }
        if(el.x < -50){
            this.freeObject(i, 'activeObjectsHigh','availableObjectsHigh');
        }
    }


    // set new pattern when all active arrays are empty
    if(this.activeCoins.length === 0 && this.activeObjectsLow.length === 0 && this.activeObjectsHigh.length === 0){
        this.translatePattern(this.getPattern());
    }
};

Level.prototype.renderPattern = function(){
    var i = this.activeCoins.length;

    while(i--){
        this.activeCoins[i].render();
    }

    i = this.activeObjectsHigh.length;

    while(i--){
        this.activeObjectsHigh[i].render();
    }

    i = this.activeObjectsLow.length;

    while(i--){
        this.activeObjectsLow[i].render();
    }
};

Level.prototype.clearObjects = function(){
    var j = this.activeCoins.length;

    while(j--){
        this.activeCoins[j].x = -50;
    }

    j = this.activeObjectsLow.length;

    while(j--){
        this.activeObjectsLow[j].x = -50;
    }

    j = this.activeObjectsHigh.length;

    while(j--){
        this.activeObjectsHigh[j].x = -50;
    }
};

Level.prototype.freeObject = function( idx, from, to, after ){
    var obj = this[from].splice(idx,1);
    this[to].push(obj[0]);
    if(after)
        this[after]();
};

Level.prototype.spawnObject = function(idx, from, to, pos){
    var obj;
    if(this[from].length > 0){
        obj = this[from].splice(idx,1);
        obj[0].visible = true;
        obj[0].x = pos.x;
        obj[0].y = pos.y || obj[0].y;
        this[to].push(obj[0]);

        return {
            w: obj[0].width
        };
    }else{
        return {
            w: 0
        }
    }

};

Level.prototype.render = function(){
    var i  = this.blocks.length;
    while(i--){
        if(this.x <= this.game.width)
            this.ctx.drawImage(this.blocks[i].s, 0, 0, this.width, this.height, ~~this.blocks[i].x, this.yPos, this.width, this.height);
    }
    this.renderPattern();
};

Level.prototype.clear = function(){
    var i = this.activeCoins.length;

    while(i--){
        if(this.activeCoins[i].x < 961)
            this.ctx.clearRect(this.activeCoins[i].x,this.activeCoins[i].y,22,22);

    }
};