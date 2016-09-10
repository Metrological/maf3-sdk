(function( win, doc, loc, undef ){

    var manager = {
        view: 1,
        state: 0,
        // instance of MAF.Room
        room: new MAF.Room(),
        joined: false,
        roomHost:undef,
        pointer:{
            y: 0,
            x: 0
        },
        center:{
            x:0,
            y:0
        },
        screen:{
            left: 0,
            top: 0,
            right: 1920,
            bottom: 1080
        },
        bounds: {
            ltSet: false,
            rbSet: false,
            left: 0,
            top: 0,
            right: 0,
            bottom:0,
            xRange: 0,
            yRange: 0,
            passed360: false
        },
        defaultXRange: 30,
        defaultYRange: 30,
        factor:16/9,
        sensitivity: 0,
        isCalibrated: false,
        locked: false,
        paint: false,
        motion: {
            x:0,y:0
        },
        ammo: 20,
        magazine: 10,
        intervalId: 0,
        playing: false,
        reloading: false,
        color: '#000',
        reloadTime: true,
        calibrateStarted: true,
        currentPoint: 'lt'
    };

    manager.init = function(){
        manager.roomListeners();
    };

    /**
     * Setup all room listeners
     */
    manager.roomListeners = function(){


        // add new listener to the data event
        // data event is gets fired every time a client
        // or host send a message to the Room
        manager.room.addEventListener('data', function ( data ) {
            manager.onDataReceived( data );
        });

        // on deviceorientation set alpha en beta of gyroscope
        // event.alpha value represents the motion of the device around the z axis,
        // represented in degrees with values ranging from 0 to 360.
        // --
        // event.beta value represents the motion of the device around the x axis, represented in degrees with values ranging
        // from -180 to 180. This represents a front to back motion of the device
        window.addEventListener('deviceorientation', function( event ){
            Interface.beta = event.beta;
            Interface.alpha = event.alpha;
            if(manager.playing){
                Interface.moveInBound(event)
            }
        });

        // ondevicemotion set x and y acceleration
        window.addEventListener('devicemotion', function(event){
            manager.motion.x = event.acceleration.x;
            manager.motion.y = event.acceleration.y;

            // if motion value is higher then 8
            // fire reload()
            if(parseInt(manager.motion.x) > 8){
                manager.reload();
            }
        });
    };

    manager.start = function(){
        // send 'start' message to host to start the game
        manager.room.send({
            type: 'start'
        });
    };

    manager.rematch = function(){
        // on end of game send 'start' to host to start rematch
        manager.room.send({
           type: 'start'
        });
    };

    /**
     * We calibrate left, top, right and bottom by pointing phone
     * to leftTop and rightBottom. With these values we calculate
     * the distance between top/bot and left/right. You basically
     * draw a invisible mousepad in the air in which you move your
     * phone
     *
     *
     * @param loc {string}
     */
    manager.calibratePoint = function( loc ){
        var x = Interface.alpha,
            y = Interface.beta,
            b = manager.bounds;

        if(loc === 'lt'){
            b.left = x;
            b.top = y;
            b.ltSet = true;
        }else{
            b.right = x;
            b.bottom = y;
            b.rbSet = true;
        }

        if(b.ltSet && b.rbSet){
            if(b.bottom < 0){
                b.yRange = b.top + Math.abs(b.bottom);
            }else{
                b.yRange = b.top - b.bottom;
            }
            if(b.left > b.right){
                // in the same range
                b.xRange = b.left - b.right;
            }else if(b.left < b.right){
                // we passed the 360 range
                b.passed360 = true;
                b.xRange = b.left + (360 - b.right);
            }
        }
    };

    manager.onCalibrate = function(){
        if(manager.currentPoint === 'lt'){
            manager.calibratePoint('lt');
            manager.currentPoint = 'rb';
            Interface.el.calibrateInfo.html('Now Point your phone to the right bottom and press calibrate');
        }else{
            manager.calibratePoint('rb');
            manager.currentPoint = 'lt';
            manager.calibrateStarted = false;
            manager.isCalibrated = true;
            Interface.hide('calibrateView');
            Interface.hide('backHolder');
            Interface.show('calibrateHolder');
            Interface.el.calibrateInfo.html('Point the top of your phone to the top left of your screen and press calibrate');
        }
    };

    manager.shoot = function(){
        if(manager.magazine > 0 && manager.playing && !manager.reloading){

            // send 'shoot' signal to host,
            // we also send userId so the host can determain
            // which user did the actual shooting
            manager.room.send({
                type: 'shoot',
                user: manager.room.user
            });

            // to prevent and game audio from blocking
            // live audio we play all sounds on the mobile device
            // idea: Sync all phones when connected set startime
            // and let all phones play a different tone at the same time
            if(Interface.el.gunSound[0].paused){
                Interface.el.gunSound[0].currentTime = 6;
                Interface.el.gunSound[0].play();
            }

            manager.magazine--;
            Interface.updateStatus();

            if(manager.magazine === 0){
                Interface.el.shootLabel.css({
                    'paddingTop': '70px'
                });
                // when there are no more bullets in the mag show message
                // that the user needs to shake his phone (we use ondevicemotion)
                Interface.el.shootLabel.html('shake your phone to reload');
                Interface.el.hitarea.css({
                    'background':'#989898',
                    'border': '5px solid #fff'
                });
            }

        }
    };

    manager.reload = function(){
        var addMag = 0, hasReloaded = false;

        if(!manager.reloading && manager.playing){
            if(manager.ammo >= 10 && manager.magazine < 10){
                addMag = 10 - manager.magazine;
                manager.ammo -= addMag;
                manager.magazine = 10;
                manager.reloading = true;
                manager.reload();
                hasReloaded = true;
            }else if(manager.ammo > 0 && manager.magazine < 10 && manager.magazine > 0){
                manager.magazine = manager.ammo;
                manager.ammo = 0;
                manager.reloading = true;
                manager.reload();
                hasReloaded = true;
            }
        }


        if(hasReloaded){
            Interface.el.reload[0].play();

            Interface.el.hitarea.css({
                'background':'#CC1E03',
                'border': '5px solid #fff'
            });

            Interface.el.shootLabel.css({
                'paddingTop': '100px'
            });

            Interface.el.shootLabel.html('reloading');
            Interface.updateStatus();

            setTimeout(function(){
                manager.reloading = false;
                var c = manager.hexToRgb(manager.color);
                Interface.el.hitarea.css({
                    'background':'rgba('+ c.r + ','+ c.g + ','+ c.b + ',0.5)',
                    'border':'5px solid '+manager.color
                });
                Interface.el.shootLabel.html('shoot');
            }, 700);
        }

    };


    manager.onHit = function(){
        manager.ammo++;
        Interface.el.hitSound[0].currentTime = 1;
        Interface.el.hitSound[0].play();
    };


    manager.onDataReceived = function( data ){

        // switch throught message type send by host
        switch( data.data.type ){
            case 'ONJOINED':
                // check if the message belogs to this client
                // if so update interface, set own color and show stat button
                if(data.data.user === manager.room.user) {
                    Interface.updateStatus();
                    manager.color = data.data.color || '#000';
                    var c = manager.hexToRgb(manager.color);

                    Interface.el.hitarea.css({
                        'background':'rgba('+ c.r + ','+ c.g + ','+ c.b + ',0.5)',
                        'border':'5px solid '+manager.color
                    });

                    manager.joined = true;
                    Interface.show('start');
                }
                break;

            case 'HIT':
                // play sound and increase ammo
                manager.onHit();
                break;

            case 'POWERUP':
                // if one of the users shoots the powerup a message gets send to all connected clients
                // if the user that hit it equals this clients userid we increase amma
                if(data.data.user === manager.room.user){
                    manager.ammo+=10;
                }
                break;

            // when stated or rematch signal is send
            // update interface and give the client more ammo
            case 'STARTED':
            case 'REMATCH':
                manager.ammo+=5;
                manager.playing = true;
                Interface.hide('start');
                Interface.show('hitarea');
                Interface.show('shootLabel');
                Interface.updateStatus();
                break;

            // when gameover signal is send
            // set playing flag, update interface and show the general
            case 'GAMEOVER':
                manager.playing = false;
                manager.locked = false;
                Interface.hide('hitarea');
                Interface.hide('shootLabel');
                Interface.showGeneral('Good job soldier! Earth is save again');
                setTimeout(function(){
                    Interface.hideGeneral();
                    Interface.show('hitarea');
                    Interface.show('start');
                }, 10000);
                break;

            // show general in between waves
            case 'COMM-CLEARED':
                Interface.hide('hitarea');
                Interface.hide('shootLabel');
                Interface.showGeneral('Good job soldier! All enemies are eliminated');
                setTimeout(function(){
                    Interface.hideGeneral();
                },7000);
                break;

            // show client that a new wave is incoming
            case 'COMM-WAVE':
                Interface.showGeneral('Oh no! More ufo\'s are incoming, prepare yourself');
                setTimeout(function(){
                    Interface.hideGeneral();
                    Interface.show('hitarea');
                    Interface.show('shootLabel');
                }, 6000);
                break;
        }
    };

    manager.hexToRgb = function(hex){
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;

    };

    var Interface = {
        // set interface listeners
        init: function(){
            Interface.el.hitarea.on('touchstart', manager.shoot);
            Interface.el.start.on('touchstart', manager.start);
            Interface.el.calibrate.on('touchstart', manager.onCalibrate);
            Interface.el.calibrateHolder.on('click', function(){
                Interface.show('calibrateView');
            });
            Interface.el.backHolder.on('click', function(){
                Interface.hide('calibrateView');
            });

        },

        beta: 0,
        alpha: 0,

        el: {
            start: $('#start'),

            // status bar
            calibrateHolder: $('#calibrateHolder'),
            calibrateLocation: $('#calibrateLocation'),
            backHolder: $('#backHolder'),
            ammo: $('#ammoTotal'),
            magazine: $('#magazine'),

            // sounds
            gunSound: $('#gunSound'),
            hitSound: $('#hitSound'),
            reload: $('#reload'),
            phone: $('#phone'),
            notify: $('#notify'),
            typewriter: $('#typewriter'),

            // calibrate
            calibrateView: $('#calibrateView'),
            calibrate: $('#calibrate'),
            calibrateInfo: $('#calibrateInfo'),

            // interface
            monitorMessage: $('#message'),
            general: $('#general'),
            scientist: $('#scientist'),
            hitarea: $('#hitarea'),
            shootLabel: $('#shootLabel'),
            view: $('#client'),
            c: $('#console')
        },

        /**
         * This is where the actual phone movement to change of pixels
         * on screen happens (we use 1920X1080 for our calculation).
         * we check current x and z position of the phone, check if we are
         * still in x and y range and calculate de degrees difference of distance
         * which we later multiply by the steps we make over x and y as (we get this value by
         * dividing screen size by range)
         *
         * @param e
         */
        moveInBound: function(e){

            var px = e.alpha,
                py = e.beta,
                b = manager.bounds,
                newX = 0,
                newY = 0,
                xSteps = 1920 / b.xRange,
                ySteps = 1080 / b.yRange,
                xDiff = 0,
                yDiff = 0;

            if(py >= b.top){
                newY = 0;
            }else if(py <= b.bottom){
                newY = 1080;
            }else{
                if(b.bottom < 0){
                    if(py < 0){
                        yDiff = b.top + Math.abs(py);
                    }else{
                        yDiff = b.top - py;
                    }
                    newY = ySteps * yDiff;
                }else{
                    yDiff = b.top - py;
                    newY = ySteps * yDiff;
                }
            }

            if(b.passed360){
                // in bounds
                if(px <= b.left){
                    xDiff = b.left - px;
                    newX = xSteps * xDiff;
                }else if( px >= b.right){
                    xDiff = b.left + (360 - px);
                    newX = xSteps * xDiff;
                }else if( px > b.left && (px - b.left) < 90){
                    newX = 0;
                }else{
                    newX = 1920;
                }
            }else{
                // if in bounds
                if(px <= b.left && px >= b.right ){
                    xDiff = b.left - px;
                    newX = xSteps * xDiff;
                }else{
                    if(px > b.left && (px - b.left) < 90){
                        newX = 0;
                    }else{
                        newX = 1920;
                    }
                }
            }

            // when we've calculated new x and y position
            // we send those values to the host. We also send userid
            // so the host manager knows which cursor to move
            manager.room.send({
                type: 'move',
                data:{
                    x: newX,
                    y: newY,
                    m: manager.motion,
                    user: manager.room.user
                }
            });
        }
    };

    Interface.showGeneral = function(message){
        Interface.hideScientist();
        Interface.el.notify[0].play();
        setTimeout(function(){
            Interface.show('general');
            Interface.showMessage(message);
            Interface.el.typewriter[0].play();
        },1000);


    };

    Interface.hideGeneral = function(){
        Interface.hide('general')
        Interface.el.monitorMessage.html('');
    };

    Interface.showScientist = function(message){
        Interface.hideGeneral();
        Interface.el.phone[0].play();
        setTimeout(function(){
            Interface.show('scientist');
            Interface.showMessage(message,45);
            Interface.el.typewriter[0].play();
        },2900);
    };

    Interface.hideScientist = function(){
        Interface.hide('scientist');
        Interface.el.monitorMessage.html('');
    };

    Interface.showMessage = function(message, speed){
        var len = message.length, msg = '', iId, i = 0;
        var iId = setInterval(function(){
            if(i>=len){
                clearInterval(iId);
            }else{
                msg+=message[i];
                Interface.el.monitorMessage.html(msg);
                i++;
            }
        },speed || 50);
    };

    Interface.updateStatus = function(){
        var slots = 10 - manager.magazine,
            mag = '', i = manager.magazine;

        Interface.el.ammo.html(''+manager.ammo);

        while(slots--){
            mag+='<div class="bulletSlot"></div>';
        }
        while(i--){
            mag+='<div class="bullet"></div>';
        }
        Interface.el.magazine.html(mag);

    };

    Interface.show = function(element){
        Interface.el[element].css({
           'display':'block'
        });
    };

    Interface.hide = function(element){
        Interface.el[element].css({
            'display':'none'
        })
    };

    manager.init();
    Interface.init();

}( window, document, location));
