var Pointer = new MAF.Class({

    ClassName: 'Pointer',

    Extends: MAF.system.FullscreenView,

    manager: {},

    iId: 0,

    initialize: function(){

        this.parent();
        this.onKeyPress.subscribeTo(MAF.application, 'onWidgetKeyPress', this);
    },

    onKeyPress: function( event ){

        var payload = event.payload;
    },

    createView: function(){

        var self = this;

        this.elements.title = new MAF.element.Image({
            src: 'Assets/ohnooo-logo.png',
            styles:{
                vOffset: 90,
                fontSize: 60,
                hOffset: 715,
                zIndex:999,
                width:500,
                height: 229
            }
        }).appendTo( this );

        this.elements.score = new MAF.element.Text({
            label: 'Earth saved in 12 seconds',
            styles:{
                vOffset: 840,
                fontSize: 25,
                hOffset: 640,
                color: '#585858',
                zIndex:998,
                visible: false

            }
        }).appendTo( this );

        this.elements.qr = new MAF.element.Image({
            styles:{
                width: 400,
                height: 400,
                vOffset: this.height / 2 - 150,
                hOffset: this.width / 2 - 200,
                boxShadow: '0 0 20px #000000',
                padding:'5px',
                border:'10px dotted #fff',
                zIndex: 998
            },
            events:{
                onShow: function(){
                    this.show();
                    self.elements.title.visible = true;
                },
                onHide: function(){
                    this.hide();
                    self.elements.title.visible = false;
                    self.elements.score.visible = false;
                }
            }
        }).appendTo( this );

        this.elements.introText = new MAF.element.Text({
            wrap: 'true',
            styles:{
                fontFamily: 'Munro',
                fontSize: 60,
                vOffset: 450,
                hOffset: 650,
                width: 600,
                height: 400,
                color: '#fff',
                anchorStyle: 'center',
                visible: false,
                zIndex:999,
                lineHeight: '50px'
            }
        }).appendTo( this );

        this.elements.earth = new MAF.element.Image({
            src: 'Assets/earth.png',
            styles:{
                width: 1920,
                height: 172,
                vOffset: this.height  - 172,
                hOffset: 0,
                zIndex: 998
            }
        }).appendTo( this );

        this.elements.qr.hide();

        // init mananger
        this.manager = new PointerManager.Manager( this );
        this.manager.init();
    },

    updateView: function(){

    },

    destroyView: function(){

        if (this.manager.room) {
            this.manager.room.leave();
            this.manager.room.destroy();
        }

        this.manager.destroy();

        delete this.manager;
        delete this.iId;
    }
});