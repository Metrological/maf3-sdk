var SimpleDrawAPI = {
	drawing: false,
	draw: function (canvas, payload) {
		var x = Math.round(canvas.width * (payload.value.x)),
			y = Math.round(canvas.height * (payload.value.y)),
			context = canvas.getContext('2d');  
		if (payload.type === 'touchBegin') {
			this.drawing = true;
			context.lineWidth = 5.0;
			context.strokeStyle = '#FF0000';
			context.beginPath();
			context.moveTo(x, y);
		} else if (payload.type === 'touchMove') {
			if (this.drawing) {
				context.lineTo(x, y);
				context.stroke();
			}
		} else if (payload.type == 'touchEnd') {
			if (this.drawing) {
				context.lineTo(x, y);
				context.stroke();
			}
			this.drawing = false;
		}
	},
	clear: function (canvas) {
		var context = canvas.getContext('2d');
		context.fillStyle = '#ffffff';
		context.fillRect(0, 0, canvas.width, canvas.height);
		canvas.width = canvas.width;
		this.drawing = false;
	}
};
var TestView8 = new MAF.Class({
	ClassName: 'TestView8',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
		this.setStyle('backgroundColor', 'white');
		this.participantJoin.subscribeTo(Muzzley, 'onParticipantJoin');
		this.draw.subscribeTo(Muzzley, 'onDeviceEvent', this);
	},

	participantJoin: function (event) {
		Muzzley.changeDevice('drawpad', null, event.payload);
	},

	draw: function (event) {
		var payload = event.payload,
			canvas = this.elements.canvas.element;
		if (payload.key === 'drawpad') {
			if (payload.action === 'touch') {
				SimpleDrawAPI.draw(canvas, payload);
			} else if (payload.action === 'clean') {
				SimpleDrawAPI.clear(canvas);
			}
		}
	},

	createView: function () {
		var back = new MAF.control.BackButton({
		}).appendTo(this);

		this.elements.canvas = new MAF.element.Container({
			element: Canvas,
			styles: {
				width: this.width,
				height: 400,
				vOffset: back.outerHeight
			}
		}).appendTo(this);

		var image = new MAF.element.Image({
			src: Muzzley.qrCode,
			styles: {
				vOffset: back.outerHeight + 450,
				hAlign: 'center'
			}
		}).appendTo(this);

	}
});
