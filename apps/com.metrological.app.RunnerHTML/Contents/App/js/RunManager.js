var RunManager = (function(doc){

    var Manager = function( ) {

        var self = this;

        /**
         * Canvas context
         * @type {CanvasRenderingContext2D}
         */
        this.ctx;

        /**
         * test on STB
         * @type {boolean}
         */
        this.STB = true;

        /**
         * Game settings
         * @type {{}}
         */
        this.settings = {};

        /**
         * Game intro
         * @type {Intro}
         */
        this.intro;

        /**
         * The runner game
         * @type {Game}
         */
        this.game;

        /**
         * canvas scaling
         * @type {number}
         */
        this.scale = 1.333;

        /**
         * Game elements
         * @type {{}}
         */
        this.el = {};

        /**
         * Current state
         * @type {number}
         */
        this.state = Manager.STATE.INIT;

        /**
         * Initialize the manager
         */
        this.init = function () {

            this.keyListener();

            // todo: runner can have own settings
            var config = {
                dev:{
                    gameSpeed: 7,
                    jumpSpeed: 10,
                    gravity: 0.85,
                    slideGravity: 7,
                    slideDistance: 25,
                    playerYPosition: 101,
                    spriteChangeSpeed: 4
                },
                stb:{
                    gameSpeed: 11,
                    jumpSpeed: 12.5,
                    gravity: 1.4,
                    slideGravity: 7,
                    slideDistance: 25,
                    playerYPosition: 101,
                    spriteChangeSpeed: 2
                }
            };


            this.settings = this.STB === true ? config.stb : config.dev;

            // create canvas element
            var canvas = doc.getElementById('runner')

            // grab context
            this.ctx = canvas.getContext('2d');

            // make canvas transparent
            this.ctx.fillStyle = "rgba(0, 0, 0, 0)";

            // scale the canvas
            this.scaleCanvas(this.ctx.canvas, this.scale);

            // intro screen
            this.intro = new IntroManager.Intro( this, this.ctx, animations );
            this.intro.init();
        };

        this.keyListener = function(){
            var self = this;
            doc.addEventListener('keydown', function(e){
                self.input(e.which, e);
            })

        };

        this.input = function( key, event ){
            switch(key){
                case 38: // up
                    this.game.runner.jump();
                    break;
                case 37: // left
                case 39: // right
                case 13: // enter
                    if(this.state === Manager.STATE.INIT){
                        this.intro.onKeyPress( key );
                    }else if(this.state === Manager.STATE.PLAYING){
                        this.game.runner.jump();
                    }
                    break;
                case 8: // backspace
                case 27: // escape
                    if(this.state !== Manager.STATE.INIT){
                        this.state = Manager.STATE.INIT;
                        this.setCoins(this.game.coins);
                        this.stop();
                        this.intro.start();
                        return false;
                    }else{
                        window.close();
                    }


            }
        };

        this.createLevel = function( props ){
            var self = this, i = 0, j = 0, objects = [], sp = {
                R: props.src,
                LF: props.levelFront.sprite,
                LB: props.levelBack.sprite,
                C: 'img/coin_animated.png',
                D: 'img/grind.png'
            };

            objects = props.objLow.concat(props.objHigh);
            j = objects.length;

            for(; i < j; i++){
                sp[objects[i].id] = objects[i].sprite;
            }

            AssetsLoader.load(function( sprites ){
                self.initNewGame(sprites, props);
            }, sp);
        };

        this.initNewGame = function(sprites, props){
            var coins = [],
                low = props.objLow,
                high = props.objHigh,
                objectsLow = [],
                objectsHigh = [],
                i = 0,
                j = 10,
                k = 0,
                l = 0,
                c = {};

            // set instance of Game
            this.game = new Game(this.ctx, {
                width: 960,
                height: 250
            }, this.settings, this);

            // init coins
            for(; i < j; i++){
                c = new AnimatedObject(this.ctx, this.game, this.settings, sprites['C'], animations['coin'],{
                    x: -50, width: 22, height: 22, y: 0, yRandom: false
                });
                coins.push(c);
            }

            i = 0;
            j = 10;

            for(; i < j; i++){

                k = 0;
                l = low.length;

                for(; k < l; k++){
                    objectsLow.push( new DisplayObject(this.ctx, this.game, sprites[low[k].id], {
                        x: -50, width: low[k].width, height: low[k].height, vx: low[k].vx, y: low[k].y
                    }));
                }

                k = 0;
                l = high.length;

                for(; k < l; k++){
                    objectsHigh.push( new DisplayObject(this.ctx, this.game, sprites[high[k].id], {
                        x: -50, width: high[k].width, height: high[k].height, vx: high[k].vx, y: high[k].y
                    }));
                }

            }

            // init dus
            var dust = new AnimatedObject(this.ctx, this.game, this.settings, sprites['D'], animations['dust'],{
                x: 0, width: 180, height: 110, y: 172
            });

            // init foreground
            var levelFront = new Level(this.ctx, this.game, sprites['LF'],
                {
                    blockAmount: props.levelFront.blockAmount,
                    ypos: props.levelFront.ypos,
                    speed: props.levelFront.speed,
                    width: props.levelFront.width,
                    height: props.levelFront.height
                },
                coins, objectsLow, objectsHigh
            );

            // init background
            var levelBack = new Level(this.ctx, this.game,  sprites['LB'],{
                blockAmount: props.levelBack.blockAmount,
                ypos: props.levelBack.ypos,
                speed: props.levelBack.speed,
                width: props.levelBack.width,
                height: props.levelBack.height
            });

            // init runner
            var runner = new Player(this.ctx, this.game, this.settings, sprites['R'], dust, props.animationFrames,{
                x: 142, width: 40, height: 100, y: props.gameY, skipFrames:2, doubleJump: true, ppy: props.gameY
            });

            // increase jump strength
            if(props.hasOwnProperty('incJump')){
                runner.jumpSpeed+=props.incJump;
            }

            // set the current runner
            this.game.runner = runner;

            // set the level
            this.game.level = levelFront;
            this.game.levelBack = levelBack;

            this.state = Manager.STATE.PLAYING;

            this.game.start();
        };

        this.scaleCanvas = function( canvas, scale ){
            var transform = 'scale('+scale+')';
            canvas.style.webkitTransformOrigin = "0 0";
            canvas.style.transformOrigin = "0 0";
            canvas.style.webkitTransform = transform;
            canvas.style.transform = transform;
            canvas.style.imageRendering = 'pixelated';
        };

        this.stop = function(){
            if(this.game)
                cancelAnimationFrame( this.game.rafId );

            cancelAnimationFrame( this.intro.rafId );
        };

        this.setScore = function( score ){
            localStorage.setItem('score', score);
        };

        this.getScore = function(){
            return localStorage.getItem('score') || '0';
        };

        this.setCoins = function( coins ){
            localStorage.setItem('coins', coins);
        };

        this.getCoins = function(){
            return localStorage.getItem('coins') || '0';
        };

        this.getAvailablePlayers = function(){
            return [1,1,0,0];
        };
    };

    var Game = function(ctx, viewport, settings, manager){

        var self = this;

        /**
         * Reference to the gameManager
         * @type {manager}
         */
        this.manager = manager;

        /**
         * canvas context
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = ctx;

        /**
         * The runner
         * @type {Runner}
         */
        this.runner;

        /**
         * Current running level
         * @type {level}
         */
        this.level;

        /**
         * Background of currentlevel
         * @type {Level}
         */
        this.levelBack;

        /**
         * the obstacles
         * @type {[]}
         */
        this.obstacles = [];

        /**
         * All the game sprites
         */
        this.sprites;

        /**
         * Distance sign
         * @type {{}}
         */
        this.sign = {};

        /**
         * Current distance (meters)
         * @type {number}
         */
        this.distance = 0;

        /**
         * Current difficulty
         * based on ditance
         */
        this.difficulty = 1;

        /**
         * Amount of coin
         * @type {number}
         */
        this.coins = parseInt(manager.getCoins());

        /**
         * Total amount of frames
         * @type {number}
         */
        this.frames = 0;

        /**
         * Current gamespeed
         * @type {number}
         */
        this.speed = settings.gameSpeed;

        /**
         * default gamespeed
         * @type {number}
         */
        this.defSpeed = settings.gameSpeed;

        /**
         * canvas width
         * @type {Number}
         */
        this.width = viewport.width;

        /**
         * canvas height
         * @type {Number}
         */
        this.height = viewport.height;

        /**
         * Different level types
         * @type {Number}
         */
        this.currentLevel = 0;

        /**
         * Time passed in seconds
         * @type {number}
         */
        this.time = 0;

        /**
         * RequestAnimationFrame id
         * @type {number}
         */
        this.rafId = 0;

        /**
         * Last called
         */
        this.lct;

        /**
         * game fps
         */
        this.fps;

        /**
         * Time started in miliseconds
         * @type {null}
         */
        this.startTime = null;

        this.start = function(){
            this.lct = Date.now();
            this.fps = 0;
            this.loop();
        };

        this.update = function(){

            this.frames++;
            this.runner.update(this.frames);

            this.levelBack.update();
            this.level.update();


        };

        this.render = function(){
            this.levelBack.render();
            this.level.render();
            this.runner.render();

            if(this.frames%30===0 && !this.runner.died){
                this.distance++;
            }

            this.ctx.fillText('Score: '+ this.distance + 'm', 650, 230);
            this.ctx.fillText('Coins: '+ this.coins, 800, 230);

        };

        this.clear = function(){

            this.ctx.clearRect(0, 110, 960, 90);

            // clear level assets
            this.level.clear();

            //clear runner
            this.ctx.clearRect(100,this.runner.y-5, 100, 130);

        };

        this.loop = function(){
            this.clear();
            this.update();
            this.render();
            this.rafId = raf(this.loop.bind(this));
        };

        this.endGame = function(){
            this.manager.setCoins(this.coins);

            if(this.distance > this.manager.getScore()){
                this.manager.setScore(this.distance);
            }

            this.frames = 0;
            this.distance = -1;
        };

    };

    var animations = {
        runner:[
            {x:0,y:0,w:100,h:100,px:100,ch:-15,cy:15,cx:0},
            {x:100,y:0,w:100,h:100,px:100,ch:-15,cy:15,cx:0},
            {x:200,y:0,w:100,h:100,px:100,ch:-15,cy:15,cx:0},
            {x:300,y:0,w:100,h:100,px:100,ch:-15,cy:15,cx:0},
            {x:400,y:0,w:100,h:100,px:100,ch:-35,cy:0,cx:0},
            {x:500,y:0,w:100,h:100,px:100,ch:-15,cy:15,cx:0},
            {x:600,y:0,w:100,h:100,px:100,ch:-15,cy:15,cx:0},
            {x:700,y:0,w:100,h:100,px:100,ch:-15,cy:15,cx:0},
            {x:800,y:0,w:100,h:100,px:100,ch:-15,cy:15,cx:0},
            {x:900,y:0,w:100,h:100,px:100,ch:-35,cy:0,cx:0}
        ],
        coin:[
            {x:0,y:0,w:22,h:22,px:22,ch:0,cy:0,cx:0},
            {x:22,y:0,w:22,h:22,px:22,ch:0,cy:0,cx:0},
            {x:44,y:0,w:22,h:22,px:22,ch:0,cy:0,cx:0},
            {x:66,y:0,w:22,h:22,px:22,ch:0,cy:0,cx:0},
            {x:88,y:0,w:22,h:22,px:22,ch:0,cy:0,cx:0},
            {x:110,y:0,w:22,h:22,px:22,ch:0,cy:0,cx:0},
            {x:132,y:0,w:22,h:22,px:22,ch:0,cy:0,cx:0}
        ],
        dust:[
            {x:0,y:0,w:112,h:30,px:0,ch:0,cy:0,cx:0},
            {x:0,y:30,w:112,h:30,px:0,ch:0,cy:0,cx:0},
            {x:0,y:60,w:112,h:30,px:0,ch:0,cy:0,cx:0},
            {x:0,y:90,w:112,h:30,px:0,ch:0,cy:0,cx:0}
        ]

    };

    // shim layer with setTimeout fallback
    var raf = (function () {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();

    Manager.STATE = {
        INIT: 0,
        PLAYING: 1,
        PAUSED: 2,
        DEAD:3,
        GAMEOVER: 4
    };

    return {
        Manager: Manager
    };

}(document));

var rm = new RunManager.Manager();
rm.init();
