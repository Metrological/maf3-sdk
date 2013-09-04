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
		this.participantJoin.subscribeTo(Muzzley, 'onParticipantJoin', this);
		this.draw.subscribeTo(Muzzley, 'onDeviceEvent', this);
	},

	participantJoin: function (event) {
		log(event.payload);
		if (this.elements.canvas.hasFocus) {
			Muzzley.changeDevice('drawpad');
		} else {
			this.elements.canvas.focus();
		}
	},

	draw: function (event) {
		var payload = event.payload,
			canvas = this.elements.canvas.element;
		if (payload.key === 'drawpad') {
			if (payload.action === 'touch') {
				SimpleDrawAPI.draw(canvas, payload);
			} else if (payload.action === 'clean') {
				SimpleDrawAPI.clear(canvas);
				this.elements.back.focus();
			}
		}
	},

	createView: function () {
		this.elements.back = new MAF.control.BackButton({
		}).appendTo(this);

		this.elements.canvas = new MAF.element.Container({
			focus: true,
			element: Canvas,
			styles: {
				width: this.width - 10,
				height: 400,
				vOffset: this.elements.back.outerHeight
			},
			events: {
				onFocus: function () {
					this.setStyle('border', '5px solid red');
					Muzzley.changeDevice('drawpad');
				},
				onBlur: function () {
					Muzzley.resetDevice();
					this.setStyle('border', null);
				}
			}
		}).appendTo(this);

		var image = new MAF.element.Image({
			src: Muzzley.qrCode,
			styles: {
				vOffset: this.elements.back.outerHeight + 460,
				hAlign: 'center'
			}
		}).appendTo(this);
	}
});
