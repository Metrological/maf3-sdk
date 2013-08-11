define('MAF.element.TextField', function () {
	return new MAF.Class({
		ClassName: 'BaseTextField',

		Extends: MAF.element.Text,

		Protected: {
			dispatcher: function (event, payload) {
				this.parent(event, payload);
				var type = event.type;
				switch(type) {
					case 'navigate':
						this.fire('onNavigate', event.detail, event);
						return;
					case 'keydown':
						this.fire('onKeyDown', {keyCode: event.keyCode, key: event.key, eventPhase: event.eventPhase, type: event.type}, event);
						return;
					case 'cursor':
						this.fire('onCursor', event.detail, event);
						return;
					default:
						break;
				}
				this.fire('on' + type.capitalize(), payload, event);
			},
			elementEvents: function (eventTypes) {
				this.parent(['focus', 'blur', 'keydown', 'navigate', 'cursor'].concat(eventTypes || []));
			},
			proxyProperties: function (propnames) {
				this.parent(['editable'].concat(propnames || []));
			}
		},

		config: {
			editable: true
		},

		initialize: function () {
			this.parent();
			this.editable = this.config.editable;
		}
	});
});
