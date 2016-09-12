var IntroManager = (function(){

    var assets = {
        logo: 'img/logo.png',
        highlight: 'img/splash_select.png',
        appathon: 'img/apprunner_sprite.png',
        street: 'img/floor.png',
        buttonSmall: 'img/buttonsmall.png',
        focusSmall: 'img/focussmall.png',
        buttonLarge: 'img/buttonlarge.png',
        focusLarge: 'img/focuslarge.png',
        scoreFrame: 'img/scoreframe.png',
        coinFrame: 'img/coinframe.png',
        coin: 'img/coin.png'
    };


    var Intro = function( manager, ctx, animations ){

        /**
         * Reference to run manager
         * @type {RunManager}
         */
        this.manager = manager;

        /**
         * Currently rendered elements in intro
         * @type {[]}
         */
        this.activeObjects = [];

        /**
         * Canvas 2d context
         * @type {{}}
         */
        this.ctx = ctx;

        /**
         * Current frame
         * @type {number}
         */
        this.frame = 0;

        /**
         * Current renderd floor
         * @type {Array}
         */
        this.floor = [];

        /**
         * Runner that has focus
         * @type {number}
         */
        this.focus = 0;

        /**
         * animation frames
         * @type {{}}
         */
        this.animations = animations;

        /**
         * RequestAnimationFrame id
         * @type {number}
         */
        this.rafId = 0;

        /**
         * Coin sprite
         * @type {{}}
         */
        this.coin = {};
    };

    Intro.prototype.onKeyPress = function( key ){
        var range = [0,1],
            focus = this.focus;
            highlight = this.activeObjects[5],
            current = this.activeObjects[focus];

        switch( key ){
            case 39: // right
                this.activeObjects[focus].animate = false;
                this.focus = focus === range.length - 1 ? 0 : focus+1;
                break;
            case 37: // left
                this.activeObjects[focus].animate = false;
                this.focus = focus === 0 ? range.length-1 : focus-1;
                break;
            case 13:
                if(this.activeObjects[this.focus].hasOwnProperty('fnSelect')){
                    this.activeObjects[this.focus]['fnSelect']();
                }else{
                    this.onSelect(this.activeObjects[this.focus]);
                }
                break;
        }

        if(current.hasOwnProperty('hasFocus')){
            current.hasFocus = false;
        }

        var active = this.activeObjects[this.focus];

        highlight.x = this.activeObjects[this.focus].x - 10;
        active.animate = true;
        highlight.visible = !active.hasOwnProperty('hasFocus');

        if(active.hasOwnProperty('hasFocus')){
            active.hasFocus = true;
        }
    };

    Intro.prototype.unlock = function( props ){
        console.log('unlock: ', props);
    };


    Intro.prototype.onSelect = function( props ){

        if(!props.active){
            this.unlock( props );
            return;
        }
        cancelAnimationFrame(this.rafId);
        this.ctx.clearRect(0,0,960,250);
        this.manager.createLevel(props);
    };

    Intro.prototype.init = function(){

        var self = this;

        AssetsLoader.load(function(images){

            self.coin = images['coin'];

            var objects = [
                {
                    id: 'runner',
                    active: true,
                    button: {
                        x: 470,
                        y: 2,
                        w: 144,
                        h: 30,
                        blur: images['buttonLarge'],
                        focus: images['focusLarge'],
                        label:{
                            active: 'START RUNNING',
                            inActive: '200'
                        }
                    },
                    price: 200,
                    sprite: images['appathon'],
                    silhouet: images['femaleSilhouet'],
                    src: assets['appathon'],
                    animationFrames: self.animations['runner'],
                    x: 482,
                    y: 100,
                    gameY:100,
                    w: 100,
                    h: 107,
                    px: 0,
                    py: 0,
                    animate: true,
                    canAnimate: true,
                    frame: 0,
                    levelFront:{
                        id: 'LF',
                        sprite: 'img/floor.png',
                        blockAmount: 5, speed: 1, ypos: 200, width: 300, height: 50
                    },
                    levelBack: {
                        id: 'LB',
                        sprite: 'img/bg.png',
                        blockAmount: 5, speed: 0.7, ypos: 122, width: 300, height: 79
                    },
                    objLow:[
                        {
                            id: 'OL1',
                            sprite: 'img/enemy.png',
                            x: -50, width: 24, height: 24, vx: 1, y: 178
                        },
                        {
                            id: 'OL2',
                            sprite: 'img/enemy2.png',
                            x: -50, width: 24, height: 36, vx: 1, y: 166
                        }
                    ],
                    objHigh:[
                        {
                            id: 'OH1',
                            sprite: 'img/enemy-high.png',
                            x: -50, width: 24, height: 60, vx: 1, y: 140
                        }
                    ]
                },
                {
                    sprite: images['buttonSmall'],
                    focusSprite: images['focusSmall'],
                    hasFocus: false,
                    label: {
                        t: 'close', x: 125, y: 230
                    },
                    fnSelect: function(){
                        window.close();
                    },
                    x: 100,
                    y: 210,
                    w: 89,
                    h: 30,
                    px: 0,
                    py: 0,
                    animate: false
                },
                {
                    id: 'highscore',
                    sprite: images['buttonLarge'],
                    buttonLabel: [
                        {t:'highscore',x:657,y:229},
                        {t: self.manager.getScore().toString() || '0',x:775,y:231}
                    ],
                    x: 650,
                    y: 210,
                    w: 144,
                    h: 30,
                    px: 0,
                    py: 0,
                    animate: false
                },
                {
                    id: 'coins',
                    sprite: images['buttonSmall'],
                    cSprite: images['coin'],
                    buttonLabel: {t:self.manager.getCoins().toString() || '0',x:872,y:231},
                    x: 800,
                    y: 210,
                    w: 89,
                    h: 30,
                    px: 0,
                    py: 0,
                    animate: false
                },
                {
                    sprite: images['logo'], x: 60, y: 20, w: 180, h: 87, px: 0, py: 0, animate: false
                },
                {
                    id: 'highlight', sprite: images['highlight'], x: 472, y: 55, w:140, h: 145, px: 0, py: 0, animate: false, visible: true
                },
                {
                    sprite: images['street'], x: 0, y: 200, w: 300, h: 50, px: 0, py: 0, animate: false
                },
                {
                    sprite: images['street'], x: 300, y: 200, w: 300, h: 50, px: 0, py: 0, animate: false
                },
                {
                    sprite: images['street'], x: 600, y: 200, w: 300, h: 50, px: 0, py: 0, animate: false
                },
                {
                    sprite: images['street'], x: 900, y: 200, w: 300, h: 50, px: 0, py: 0, animate: false
                }


            ];

            // set active objects
            self.activeObjects = objects;

            // start intro
            self.start();

        }, assets);

    };

    Intro.prototype.start = function(){
        //this.manager.view.elements.scoreBoard.visible = false;
        //this.manager.view.elements.coinsBoard.visible = false;
        // todo: refactor
        this.activeObjects[2].buttonLabel[1].t = this.manager.getScore().toString() || '0';
        this.activeObjects[3].buttonLabel.t = this.manager.getCoins().toString() || '0';
        this.loop();
    };

    Intro.prototype.loop = function(){

        this.clear();
        this.update();
        this.render();
        this.rafId = requestAnimationFrame(this.loop.bind(this));

    };

    Intro.prototype.update = function(){
        this.frame++;
    };

    Intro.prototype.render = function(){

        var elements = this.activeObjects,
            i = elements.length,
            anim = {},
            el = {};

        while(i--){
            el = elements[i];
            anim = this.animations[el.id];

            if(el.canAnimate){

                if(el.animate && el.active){
                    el.frame += this.frame % 3 === 0 ? 1 : 0;
                    el.frame %= 7;
                }

                if(el.active){
                    this.ctx.drawImage(
                        el.sprite,
                        ~~anim[el.frame].x,
                        ~~anim[el.frame].y,
                        anim[el.frame].w,
                        anim[el.frame].h,
                        ~~el.x,
                        ~~el.y,
                        anim[el.frame].w,
                        anim[el.frame].h
                    );
                }else{
                    this.ctx.drawImage(
                        el.silhouet.sprite, el.silhouet.x,el.silhouet.y
                    );
                }

                if(el.button){

                    this.ctx.drawImage(el.button.blur, 0, 0, el.button.w, el.button.h, el.button.x, el.button.y, el.button.w, el.button.h);
                    this.ctx.fillStyle = el.animate ? '#ffffff' : '#4D4D4D';

                    if(el.active){
                        this.ctx.fillText(el.button.label.active, el.button.x + 7, el.button.y + 21)
                    }else{
                        this.ctx.fillText(
                            (el.animate?el.button.label.inActive:'UNLOCK FOR'),
                            el.button.x + 20,
                            el.button.y + 21
                        );

                        if(el.animate){
                            this.ctx.drawImage(this.coin, el.button.x + 110, el.button.y + 4);
                        }
                    }
                }

            }else{
                switch( el.id ){
                    case 'highlight':
                        if(el.visible){
                            this.ctx.drawImage(el.sprite, el.px, el.py, el.w, el.h, el.x, el.y, el.w, el.h);
                        }
                        break;
                    case 'highscore':
                        this.ctx.fillStyle = '#4D4D4D';
                        this.ctx.font = "12px Verdana";
                        this.ctx.drawImage(el.sprite, el.px, el.py, el.w, el.h, el.x, el.y, el.w, el.h);
                        this.ctx.fillText(el.buttonLabel[0].t, el.buttonLabel[0].x, el.buttonLabel[0].y);
                        this.ctx.font = "15px Verdana";
                        this.ctx.fillStyle = '#fff';
                        this.ctx.fillText(el.buttonLabel[1].t, el.buttonLabel[1].x - ( (el.buttonLabel[1].t.length - 1) * 9), el.buttonLabel[1].y);
                        break;
                    case 'coins':
                        this.ctx.drawImage(el.sprite, el.px, el.py, el.w, el.h, el.x, el.y, el.w, el.h);
                        this.ctx.drawImage(el.cSprite,el.x + 5, el.y + 4);
                        this.ctx.fillStyle = '#ffffff';
                        this.ctx.fillText(el.buttonLabel.t, el.buttonLabel.x - ( (el.buttonLabel.t.length - 1) * 9), el.buttonLabel.y);
                        break;
                    default:
                        this.ctx.drawImage( (!el.hasFocus?el.sprite:el.focusSprite), el.px, el.py, el.w, el.h, el.x, el.y, el.w, el.h);
                        break;

                }

                if(el.label){
                    this.ctx.fillStyle = '#ffffff';
                    this.ctx.fillText(el.label.t, el.label.x, el.label.y);
                }
            }
        }
    };

    Intro.prototype.clear = function(){
        this.ctx.clearRect(0,0,960,250);
    };

    return {
        Intro: Intro
    };

}());