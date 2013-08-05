define('MAF.element.TextField', function () {
	return new MAF.Class({
		ClassName: 'BaseTextField',

		Extends: MAF.element.Text,

		Protected: {
			dispatcher: function (nodeEvent, payload) {
				this.parent(nodeEvent, payload);
				var type = nodeEvent.type;
				switch(type) {
					case 'navigate':
						this.fire('onNavigate', nodeEvent.detail, nodeEvent);
						return;
					case 'keydown':
						this.fire('onKeyDown', {keyCode: nodeEvent.keyCode, key: nodeEvent.key, eventPhase: nodeEvent.eventPhase, type: nodeEvent.type}, nodeEvent);
						return;
					case 'cursor':
						this.fire('onCursor', nodeEvent.detail, nodeEvent);
						return;
					default:
						break;
				}
				this.fire('on' + type.capitalize(), payload, nodeEvent);
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
