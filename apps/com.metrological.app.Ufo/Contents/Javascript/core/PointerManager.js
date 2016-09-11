var PointerManager = function(){

    var Manager = function( view ){

        var self = this;

        /**
         * MAF Room
         */
        this.room = {};

        /**
         * All playing users
         * @type {Array}
         */
        this.users = {};

        /**
         * Canvas context
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = {};

        /**
         * RequestAnimationFrame id
         * @type {number}
         */
        this.rafId = 0;

        /**
         * Drawing board
         * @type {WhiteBoard}
         */
        this.whiteboard = {};

        /**
         * shooting game
         * @type {Game}
         */
        this.game = {};

        /**
         * Game intro
         * @type {Intro}
         */
        this.intro = {};

        /**
         * current state
         * @type {boolean}
         */
        this.playState = false;

        /**
         * Can someone start the round
         * @type {boolean}
         */
        this.lockStart = false;

        /**
         * Current view
         * @type {{}}
         */
        this.view = view;

        /**
         * crosshair colors
         * todo: restore color on user left
         */
        this.colors = [
            '#ff0000',
            '#f6ff00',
            '#9300f9',
            '#00ffae',
            '#ffa200',
            '#ff00e4',
            '#00ff18',
            '#2400ff'
        ];


        /**
         * Runs on stb
         * @type {boolean}
         */
        this.stb = true;

        /**
         * All elements that are visible
         */
        this.elements;

        this.getUsers = function(){
          return this.users;
        };

        this.setUser = function( user ){
            if(user.id)
                this.users[user.id] = user;
        };

        /**
         * Initialize the manager
         */
        this.init = function(){

            var self = this;

            // set instance of MAF.Room
            this.room = new MAF.Room();

            // new instance of MAF.element.Core
            // canvas gets appended to the view
            var canvas = new MAF.element.Core({
                element: Canvas,
                styles: {
                    width: (this.stb?480:1920),
                    height: (this.stb?270:1080),
                    background:'#000'
                }
            }).appendTo( self.view );

            // set 2d context
            this.ctx = canvas.element.getContext('2d');

            this.ctx.font = '10px Verdana';
            this.lineWidth = 1;

            if(this.stb){
                // on stb we render canvas on 480X270 and upscale
                // it 4 times for better performace
                this.scaleCanvas(this.ctx.canvas, 4);
            }

            // in the callback of the assetloader we initialze all
            // the game elements
            AssetsLoader.load(function(sprites){
                var ufos = [],
                    i = 10, b, u, p, s, f, c;

                // add 10 ufo's
                while(i--){
                    u = Math.floor(Math.random()*3)+1;
                    b = new Ufo(self.ctx, sprites['ufo'+u+'sprite'], self.stb);
                    b.animated = true;
                    b.y = (Math.floor(Math.random()*400) + 50)*-1;
                    b.inc = Math.random() / 80;
                    c = Math.floor(Math.random()*10);

                    if(c === 6){
                        b.straight = true;
                    }

                    ufos.push(b);
                }

                p = new Powerup(self.ctx, sprites['powerup'], self.stb, self.room);

                s = new Sky(self.ctx, 40, self.stb);

                s.render();

                f = new Friendly(self.ctx, sprites['satellite'], self.stb);

                self.intro = new Intro(self.ctx,[
                    sprites['story1'],
                    sprites['story2'],
                    sprites['story3'],
                    sprites['story4'],
                    sprites['story5'],
                    sprites['story6']
                ],self);

                // todo: concat ufos, powerup and friendly
                self.game = new Game( ufos, self.ctx, self.room, p, s, f );
                self.elements.qr.show();
            });


            // join room when connected
            if( this.room && this.room.connected ){
                this.room.join();
            }else{
                // or else keep trying every 500ms
                (function(){
                    var intervalId;
                    intervalId = MAF.utility.timer.setInterval(function(){
                        if(self.room && self.room.connected){
                            self.room.join();
                            MAF.utility.timer.clearInterval( intervalId );
                        }
                    },500);
                })();
            }

            // set listeners for room and connection
            this.handleRoomEvents.subscribeTo( this.room,
                ['onCreated', 'onJoined', 'OnConnected', 'onHasLeft']
            );

            // set listener for the onData event
            // onData is fired when host or client sends a message
            this.onDataReceived.subscribeTo( this.room, ['onData']);

            // set reference to elements
            this.elements = this.view.elements;
        };

        /**
         * Handles all room events
         * @param event
         */
        this.handleRoomEvents = function( event ){

            var payload = event.payload,
                type = event.type;

            switch( type ){

                case 'onCreated':
                    // generate url for QR code scanner
                    var url = widget.getUrl('Client/index.html?hash='+payload.hash);
                    self.elements.qr.setSource( QRCode.get( url ) );
                    break;

                case 'onJoined':
                    // check if user is not the host
                    // or else the host will be added as a player
                    if( self.room.user !== payload.user ){

                        if(Object.keys(self.users).length < 8){

                            // new instance of User
                            var user = new User( payload.user),
                                color = self.colors.pop();


                            // give use crosshair and a color
                            user.crosshair = new Crosshair(self.ctx, color);
                            user.color = color;

                            self.game.crosshairs.push(user.crosshair);
                            self.setUser( user );

                            // send a message to all connected devices
                            // that a new user joined, by sending user.id
                            // the client app can check if he is the newly joined use
                            self.room.send({
                                type:'ONJOINED',
                                user: user.id,
                                color: color
                            });
                        }
                    }
                    break;

                case 'onConnected':
                    // if room is created but not connected
                    // join room
                    if( self.room && !self.room.connected){
                        self.room.join();
                    }
                    break;

                // when a user has left the building
                case 'onHasLeft':

                    // check if user is not equal to host
                    if( self.room.user !== payload.user ){

                        if(self.users[payload.user]){
                            var p = self.game.crosshairs.indexOf(self.users[payload.user].crosshair);

                            if(p!==-1){
                                self.game.crosshairs[p].clear();
                                self.game.crosshairs.splice(p,1);
                            }

                            self.colors.push(self.users[payload.user].color);

                            delete self.users[payload.user];

                            if(Object.keys(self.users).length === 0){
                                self.elements.qr.fire('onShow');
                            }
                        }

                    }else{
                        // send message to all contected devices that
                        // the host has left the building
                        self.room.send({
                            type:'HOSTLEFT',
                            user: self.room.user
                        });
                    }
                    break;
            }
        };

        /**
         * On data sent by room / users
         * @param event
         */
        this.onDataReceived = function( event ){

            var payload = event.payload,
                x = 0, y = 0, u, c, b, mx, my, t, a;

            switch( payload.data.type ){
                // when a client send 'start'
                // show intro or start the game
                case 'start':
                    if(!self.lockStart){
                        self.elements.qr.fire('onHide');
                        self.lockStart = true;
                        if(!self.playState){
                            self.playState = true;
                            self.intro.show();
                        }else{
                            self.game.users = self.users;
                            self.game.start();
                            // notify all connected devices
                            // that the game has been start
                            self.room.send({
                                type:'STARTED'
                            });
                        }
                    }
                    break;

                // when a client moves his phone
                // position the crosshair on the screen
                // to the calculated x and y and divide
                // by 4 since we render canvas on 480X270
                // and upscale it 4 times
                case 'move':
                    u = payload.data.data.user;
                    if(self.stb){
                        x = payload.data.data.x / 4;
                        y = payload.data.data.y / 4;
                    }else{
                        x = payload.data.data.x;
                        y = payload.data.data.y;
                    }

                    c = self.users[u].crosshair;
                    c.clear();
                    c.y = y;
                    c.x = x;
                    break;

                // when shots get fired
                case 'shoot':
                    u = payload.data.user;
                    self.game.onShotFired(u);
                    break;

                // when the game is over show highscores
                // show duration and accuracy
                case 'GAMEOVER':
                    setTimeout(function(){
                        self.game.showUsers();
                        a = ( self.game.hits / self.game.shots) * 100;
                        t = ( +Date.now() - self.game.startTime );
                        self.elements.qr.fire('onShow', 32);
                        self.elements.score.setText('Earth saved in '+ parseFloat(t/1000).toFixed(2) +' seconds with '+parseFloat(a).toFixed(2) +'% accuracy');
                        self.elements.score.visible = true;
                        self.elements.qr.fire('onShow', 32);
                        self.lockStart = false;
                    },6000);
                    break;

            }
        };

        this.scaleCanvas = function( canvas, scale ){
            var transform = 'scale('+scale+')';
            canvas.style.webkitTransformOrigin = "0 0";
            canvas.style.transformOrigin = "0 0";
            canvas.style.webkitTransform = transform;
            canvas.style.transform = transform;
            canvas.style.imageRendering = 'pixelated';
        };

        this.destroy = function(){
            cancelAnimationFrame(this.game.rafId);
        };

    };


    var Crosshair = function( ctx, color ){
        this.ctx = ctx;
        this.x = 20;
        this.y = 20;
        this.width = 20;
        this.height = 20;
        this.rc = 3;
        this.ro = 6;
        this.defColor = color;
        this.color = color;

        this.render = function(){
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.defColor;
            this.ctx.moveTo(~~this.x+10,~~this.y);
            this.ctx.lineTo(~~this.x+10,~~this.y+6);
            this.ctx.moveTo(~~this.x+14,~~this.y+10);
            this.ctx.lineTo(~~this.x+20,~~this.y+10);
            this.ctx.moveTo(~~this.x+10,~~this.y+14);
            this.ctx.lineTo(~~this.x+10,~~this.y+20);
            this.ctx.moveTo(~~this.x,~~this.y+10);
            this.ctx.lineTo(~~this.x+6,~~this.y+10);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.fillStyle = this.color;
            this.ctx.beginPath();
            this.ctx.arc(~~this.x + 10,~~this.y + 10,this.rc,0,2*Math.PI);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(~~this.x + 10,~~this.y + 10,this.ro,0,2*Math.PI);
            this.ctx.stroke();
        };

        this.clear = function(){
            this.ctx.clearRect(this.x - 5,this.y - 5,this.width + 10, this.height + 10);
        };
    };

    var Intro = function( ctx, sprites, manager){

        this.ctx = ctx;
        this.sprites = sprites;
        this.manager = manager;

        this.show = function(){
            var self = this,
                info = [
                    'Good day Red Team, let me brief you on your next mission',
                    'For years we have been dumping our garbage on Planet XeroxPhaser -3206 N1L1',
                    'For years we have been dumping our garbage on Planet XeroxPhaser -3206 N1L1',
                    'We recently discoverd a higher form of intelligence on this planet.',
                    'And they are pissed off..',
                    'And on there way to perform a big Charlie Foxtrot',
                    'We\'re counting on you to defend Earth'
                ],
                len = this.sprites.length + 1,
                i = 0,
                r = false,
                n = function(){
                    if(r){
                        clearInterval(iId);
                        self.ctx.clearRect(185,15,120,120);
                        self.manager.elements.introText.visible = false;
                        delete self.manager.elements.introText;
                        self.manager.room.send({
                            type:'STARTED'
                        });
                        self.manager.game.users = self.manager.users;
                        self.manager.game.start();
                        self.manager.game.loop();
                    }else{
                        if(i === len - 1){
                            self.ctx.drawImage(self.sprites[0], 0, 0, 109, 107, 190, 20, 109, 107);
                            self.manager.elements.introText.setText(info[6]);
                            r = true;
                        }else{
                            self.ctx.drawImage(self.sprites[i], 0, 0, 109, 107, 190, 20, 109, 107);
                            self.manager.elements.introText.setText(info[i]);
                        }
                        i++;
                    }
                };

            self.manager.elements.introText.visible = true;

            var iId = setInterval(function(){
                n();
            },4000);

            n();
        }

    };

    var Game = function( ufos, ctx, room, powerup, sky, friendly ){

        /**
         * Available ufos
         * @type {[]}
         */
        this.ufos = ufos;

        /**
         * Canvas rendering context
         * @type {CanvasRenderingContext2D}
         */
        this.ctx = ctx;

        /**
         * Reference to maf room
         */
        this.room = room;

        /**
         * Powerup
         * @type {Powerup}
         */
        this.powerup = powerup;

        /**
         * The sky
         * @type {Sky}
         */
        this.sky = sky;

        /**
         * Friendly
         * @type {Friendly}
         */
        this.friendly = friendly;

        /**
         * Playing crosshairs
         * @type {Array}
         */
        this.crosshairs = [];

        /**
         * All playing users
         * @type {{}}
         */
        this.users = {};

        /**
         * RequestAninmationFrame id
         * @type {number}
         */
        this.rafId = 0;

        /**
         * Timestamp of round start
         * @type {number}
         */
        this.startTime = 0;

        /**
         * Timestamp of round end
         * @type {number}
         */
        this.endTime = 0;

        /**
         * Shots fired in the current round
         * @type {number}
         */
        this.shots = 0;

        /**
         * Shots that hit enemy in current round
         * @type {number}
         */
        this.hits = 0;

        /**
         * Enemies killed in the current wave
         * @type {number}
         */
        this.killed = 0;

        /**
         * Enemies remaining in the current wave
         * @type {number}
         */
        this.remaining = 0;

        /**
         * Active enemies in the current wave
         * @type {number}
         */
        this.alive = 0;

        /**
         * Current Wave
         * @type {number}
         */
        this.wave = 0;

        /**
         * All playable waves
         * @type {number[]}
         */
        this.waves = [
            5,10,15
        ];

        this.start = function(){
            this.sky.render();
            this.startTime = +Date.now();
            this.shots = 0;
            this.hits = 0;
            this.wave = 0;
            this.clearUserArea();
            this.setWave();
        };

        this.loop = function(){
            this.clear();
            this.update();
            this.render();
            this.rafId = requestAnimationFrame(this.loop.bind(this));
        };

        this.update = function(){
            var i = this.ufos.length;
            while(i--){
                if(!this.ufos[i].isHit)
                    this.ufos[i].update();
            }

            if(!this.powerup.isHit){
                this.powerup.update();
            }

            if(!this.friendly.isHit){
                this.friendly.update();
            }
        };

        this.render = function(){
            var i = this.ufos.length;

            while(i--){
                if(!this.ufos[i].isHit)
                    this.ufos[i].render();
            }

            if(!this.powerup.isHit){
                this.powerup.render();
            }

            if(!this.friendly.isHit){
                this.friendly.render();
            }

            i = this.crosshairs.length;
            while(i--){
                this.crosshairs[i].render();
            }
        };

        this.clearUserArea = function(){
            var l = Object.keys(this.users).length;
            this.ctx.clearRect(15, 10, 50, 40*l + 50);
        };

        this.clear = function(){
            var i = this.ufos.length;
            while(i--){
                this.ufos[i].clear();
            }
            i = this.crosshairs.length;
            while(i--){
                this.crosshairs[i].clear();
            }

            if(!this.powerup.isHit){
                this.powerup.clear();
            }

            if(!this.friendly.isHit){
                this.friendly.clear();
            }
        };

        this.showUsers = function(){
            var u = Object.keys(this.users), y = 30, i = u.length;
            this.ctx.font = '10px Verdana';
            while(i--){
                this.ctx.fillStyle = '#fff';
                this.ctx.fillText(this.users[u[i]].score, 50,y);
                this.ctx.fillStyle = this.users[u[i]].color;
                this.ctx.fillRect(15,y - 20, 25,25);
                y+=30;
            }
        };

        this.onShotFired = function(userId){
            var user = this.users[userId];
            var b = this.ufos.filter(function(el){
                return !el.isHit;
            });

            this.shots++;

            var i = b.length;
            var j = 0;

            while(i--){
                if(Utils.rectColide(user.crosshair,b[i])){
                    this.hits++;
                    user.score++;
                    b[i].hit();

                    this.room.send({
                        type:'HIT'
                    });

                    this.remaining--;
                    this.alive--;
                    this.killed++;

                    if(this.remaining <= 0){
                        this.endWave();
                    }else{
                        // todo: different logic per spawn?
                        if( this.alive <= ( this.wave * 2 ) ){
                            this.spawnWave();
                        }
                    }

                    break;
                }
            }

            if(!this.powerup.isHit){
                if(Utils.rectColide(user.crosshair,this.powerup)){
                    this.hits++;
                    this.powerup.hit( user.id );
                    this.sky.reposition();
                }
            }

            if(!this.friendly.isHit){
                if(Utils.rectColide(user.crosshair,this.friendly)){
                    this.friendly.hit();
                    this.room.send({
                        type: 'LOCK-USER',
                        user: user.id
                    });

                }
            }

            user.crosshair.color = '#ff2e2e';
            setTimeout(function(){
                user.crosshair.color = user.crosshair.defColor ;
            },400);
        };

        this.setWave = function(){
            this.remaining = this.waves[this.wave];
            this.killed = 0;
            this.spawnWave();
        };

        // todo: refactor
        this.spawnWave = function(){
            var b = 0,
                r = Math.floor(Math.random()*2),
                pattern;

            var pool = this.ufos.filter(function(el){
                return el.isHit;
            }).sort(function(){
                return 0.5 - Math.random();
            });

            if(this.remaining < 3){
                b = this.remaining - this.alive;
            }else if(this.remaining === this.alive) {
                b = 0;
            }else{
                b = Math.ceil( ( Math.random() * ( this.remaining - this.alive )  ) / 2 );
            }

            if(b < 0){
                b = 0;
            }else if(b > pool.length){
                b = pool.length;
            }

            this.alive+=b;

            if(r === 1 && b >= 5){
                pattern = this.getPattern(b);
            }

            while(b--){
                if(pattern){
                    pool[b].x = pattern[b].x;
                    pool[b].y = pattern[b].y;
                    pool[b].toX = pattern[b].toX;
                    pool[b].toY = pattern[b].toY;
                    pool[b].spawn(true);
                }else{
                    pool[b].spawn();
                }
            }

            this.sky.render();
        };

        this.getPattern = function( b ){
            var r = Math.floor(Math.random()*5),
                p = [], x = 5, y = 0, toX = 0, toY = 0, h = Math.floor(b/2), len = b;

            if(r===1){
                while(b--){
                    if(b <= h){
                        x = -100;
                        toX = 100;
                        y += 50;
                        toY = y;
                    }else{
                        x = 580;
                        toX = 380;
                        y += 50;
                        toY = y;
                    }
                    p.push({
                        x: x, y: y, toX: toX, toY: toY
                    });
                }
            }else{
                while(b--){
                    p.push({
                        x: x,
                        toX: x,
                        y: -100,
                        toY: 150
                    });
                    x += Math.floor(480 / len + 10);
                }
            }

            return p;
        };

        this.endWave = function(){
            var self = this;
            if(this.wave < this.waves.length - 1){
                this.waveCleared();
                setTimeout(function(){
                    self.ctx.clearRect(10,80,440,70);
                    self.powerup.hit('unknown');
                    self.wave++;
                    self.setWave();
                },15000);
            }else{
                this.gameOver();
            }
        };

        this.waveCleared = function(){
            var self = this;
            this.powerup.isHit = true;
            this.powerup.clear();

            // when the wave is cleared
            // send message to all connected devices
            // after 500ms
            setTimeout(function(){
                self.room.send({
                    type:'COMM-CLEARED'
                });
            },500);

            // after 7.5 sec
            // send message that new wave is incoming
            setTimeout(function(){
                self.room.send({
                   type: 'COMM-WAVE'
                });
            },7500);
        };

        this.gameOver = function(){
            var self = this;
            // send gameover message
            setTimeout(function(){
                self.room.send({
                    type:'GAMEOVER'
                });
            }, 500);
        };

    };

    var Ufo = function(ctx, sprite, stb){
        this.ctx = ctx;
        this.stb = stb;
        this.x = Math.floor(Math.random()*(this.stb?480:1900));
        this.y = Math.floor(Math.random()*(this.stb?270:1060));
        this.toX = Math.floor(Math.random()*(this.stb?480:1900));
        this.toY = Math.floor(Math.random()*(this.stb?270:1060));
        this.width = 28;
        this.height = 28;
        this.speed = 1;
        this.easing = 0.001;
        this.isHit = true;
        this.sprite = sprite;
        this.distanceTillNew = 1;
        this.orbit = false;
        this.orbitY = 100;
        this.orbitX = 100;
        this.steps = 1;
        this.radius = 0;
        this.angle = Math.PI / 2;
        this.inc = 0.1;
        this.straight = false;
        this.animated = false;
        this.frameLength = 4;
        this.frame = 0;
        this.animationSpeed = 5;
    };

    Ufo.prototype.update = function(){
        if(this.orbit){
            this.angle += this.inc;
            this.x = this.radius * Math.cos(this.angle) + this.orbitX;
            this.y = this.radius * Math.sin(this.angle) + this.radius + this.orbitY;

            if(this.dir === 1 && this.x < -30){
                this.hit();
            }else if(this.dir === 2 && this.x > 500){
                this.hit();
            }
        }else{
            var xDis = this.toX - this.x,
                yDis = this.toY - this.y,
                dis = Math.sqrt(xDis*xDis + yDis*yDis);

            if(dis > this.distanceTillNew){
                this.x+=xDis * this.easing;
                this.y+=yDis * this.easing;
                this.easing+=0.0001;
            }else{
                this.newPosition();
            }
        }

        if(this.animated){
            this.frame += this.steps % this.animationSpeed === 0 ? 1 : 0;
            this.frame %= this.frameLength;
            this.steps++;
        }

    };

    Ufo.prototype.render = function(){
        if(!this.isHit){
            if(this.animated){
                this.ctx.drawImage(this.sprite, (this.frame*29), 0, this.width, this.height, this.x, this.y, this.width, this.height);
            }else{
                this.ctx.drawImage(this.sprite, 0, 0, this.width, this.height, this.x, this.y, this.width, this.height);
            }
        }
    };

    Ufo.prototype.clear = function(){
        this.ctx.clearRect(this.x-5,this.y-5,this.width + 10,this.height + 10);
    };

    Ufo.prototype.newPosition = function(){
        var x = Math.floor(Math.random()*(this.stb?470:1900)),
            y = Math.floor(Math.random()*(this.stb?260:1060)),
            r = Math.floor(Math.random()*2);

        if(this.straight){
            if(r === 1){
                x = this.x;
            }else{
                y = this.y;
            }
        }

        this.toX = x;
        this.toY = y;

        this.easing = 0.01;
        this.distanceTillNew = Math.floor(Math.random()*50) + 10;
    };

    Ufo.prototype.hit = function(){
        this.isHit = true;
        this.steps = 0;
        this.clear();
        this.newPosition(true);
        this.y = (Math.floor(Math.random()*400) + 50)*-1;
    };

    Ufo.prototype.spawn = function(stopNewPos){
        if(!stopNewPos){
            this.newPosition();
        }else{
            this.easing = 0.02;
            this.distanceTillNew = 20;
        }
        this.isHit = false;
    };

    var Powerup = function(ctx, sprite, stb, room){

        Ufo.call(this, ctx, sprite, stb);

        this.room = room;
        this.isHit = false;

        this.types = [
            'ammo', 'grow', 'shrinkOthers', 'points'
        ];
    };

    Powerup.prototype = Object.create(Ufo.prototype);

    Powerup.prototype.constructor = Powerup;

    Powerup.prototype.hit = function( userId ){
        var self = this, p;

        this.isHit = true;
        this.clear();
        this.newPosition();

        p = Math.floor(Math.random()*this.types.length);

        this.room.send({
            type:'POWERUP',
            powerup: this.types[p],
            user: userId
        });

        setTimeout(function(){
            self.isHit = false;
        }, 10000);
    };

    var Friendly = function(ctx, sprite, stb){
        Ufo.call(this, ctx, sprite, stb);
        this.isHit = false;
        this.radius = 960;
        this.x = 0;
        this.y = 0;
        this.inc = -0.001;
        this.angle = -1.3;
        this.orbit = true;
        this.dir = 1;
        this.orbitX = 210;
        this.orbitY = 120;
        this.frameLength = 2;
        this.animated = true;
        this.animationSpeed = 35;
    };

    Friendly.prototype = Object.create(Ufo.prototype);

    Friendly.prototype.constructor = Friendly;

    Friendly.prototype.hit = function(){
        var self = this;

        this.isHit = true;
        this.clear();

        setTimeout(function(){
            var r = Math.floor(Math.random()*4);
            self.inc = ((Math.random()*4)+1)/1000*-1;
            self.orbitY = Math.floor(Math.random()*180) + 10;
            if(r === 1){
                self.dir = 2;
                self.angle = -1.8;
                self.inc*=-1;
            }else{
                self.dir = 1;
                self.angle = -1.3;
            }
            self.x = 0;
            self.isHit = false;
        }, Math.floor(Math.random()*15000)+10000);
    };

    var Sky =  function( ctx, amount, stb ){
        this.ctx = ctx;
        this.stb = stb || false;
        this.amount = amount || 10;
        this.stars = [];
        this.build();
    };

    Sky.prototype.build = function(){
        var i = this.amount;
        while(i--){
            this.stars.push({
                size: Math.floor(Math.random()*(this.stb?2:4)) + 1,
                x: Math.floor(Math.random()*(this.stb?480:1900)),
                y: Math.floor(Math.random()*(this.stb?270:1060)),
                o: Math.random()
            });
        }
    };

    Sky.prototype.reposition = function(pos){
        this.render();
    };

    Sky.prototype.show = function(){

    };

    Sky.prototype.render = function(){
        var i = this.stars.length, s;
        while(i--){
            s = this.stars[i];
            this.ctx.fillStyle = 'rgba(255,255,255,'+ s.o +')';
            this.ctx.fillRect(s.x, s.y, s.size, s.size);
        }
    };


    var Utils = (function(){

        var colideDist = 60;

        var canColide = function(obj1, obj2){
            return (Math.max(obj1.x,obj2.x) - Math.min(obj1.x,obj2.x)) <= colideDist &&
                (Math.max(obj1.y,obj2.y) - Math.min(obj1.y,obj2.y)) <= colideDist;
        };

        var isInRange = function(val, min, max ){
            return val >= Math.min(min,max) && val <= Math.max(min,max);
        };

        var rangeIntersect = function(min0, max0, min1, max1){
            return Math.max(min0, max0) >= Math.min(min1, max1) &&
                Math.min(min0, max0) <= Math.max(min1, max1);
        };
        var rectColide = function(r0,r1){
            return rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
                rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height);
        };

        return {
            canColide: canColide,
            isInrange: isInRange,
            rangeIntersect: rangeIntersect,
            rectColide: rectColide
        };

    }());

    var AssetsLoader = (function() {

        var imagesLoaded = false,
        // todo: remove assets
            assets = {
                ufo1: widget.getUrl('Assets/ufo.png'),
                ufo2: widget.getUrl('Assets/ufo2.png'),
                ufo3: widget.getUrl('Assets/ufo3.png'),
                ufo1sprite: widget.getUrl('Assets/ufosprite.png'),
                ufo2sprite: widget.getUrl('Assets/ufo2sprite.png'),
                ufo3sprite: widget.getUrl('Assets/ufo3sprite.png'),
                powerup: widget.getUrl('Assets/powerup.png'),
                satellite: widget.getUrl('Assets/satellite.png'),
                story1: widget.getUrl('Assets/story1.png'),
                story2: widget.getUrl('Assets/story2.png'),
                story3: widget.getUrl('Assets/story3.png'),
                story4: widget.getUrl('Assets/story4.png'),
                story5: widget.getUrl('Assets/story5.png'),
                story6: widget.getUrl('Assets/story6.png')
            };

        var publicLoader = {
            images:{
            },
            load: function( cb, a ){
                a = assets;
                var keys = Object.keys(a),
                    queue = keys.length;

                // clean up existing images
                publicLoader.clean();
                imagesLoaded = false;

                Object.keys(a).forEach(function(el){
                    var image = new MAF.element.Image({
                        src: a[el],
                        events:{
                            onLoaded: function(){
                                publicLoader.images[el] = this.element;
                                if(queue > 0){
                                    queue--;
                                }else{
                                    if(!imagesLoaded){
                                        imagesLoaded = true;
                                        publicLoader.onLoaded(cb);
                                    }
                                }
                            },
                            onError: function(){
                                console.log("error loading: ", a[el]);
                                queue--;
                            }
                        }
                    });
                });
            },
            onLoaded: function(cb){
                return cb(publicLoader.images);
            },
            clean: function(){
                var k = Object.keys(publicLoader.images),
                    i = 0, j = k.length;

                for( ; i < j; i++){
                    delete publicLoader.images[k[i]];
                }


                return !!Object.keys(publicLoader.images);
            }
        };
        return publicLoader;
    }());

    var User = function( id ){

        /**
         * Rooms generated user id
         */
        this.id = id;

        /**
         * User defined username
         */
        this.username;

        /**
         * User crosshair
         */
        this.crosshair;

        /**
         * score
         * @type {number}
         */
        this.score = 0;

        /**
         * player color
         */
        this.color;
    };

    User.prototype.getId = function(){
        return this.id;
    };

    User.prototype.setId = function( id ){
        this.id = id;
    };

    User.prototype.getUsername = function(){
        return this.username;
    };

    User.prototype.setUsername = function( name ){
        this.username = name;
    };


    return {
        Manager: Manager
    };

}();