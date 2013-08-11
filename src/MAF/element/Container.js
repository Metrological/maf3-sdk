define('MAF.element.Container', function () {
	return new MAF.Class({
		ClassName: 'BaseContainer',

		Extends: MAF.element.Core,

		Implements: Library.Themes,

		Protected: {
			dispatcher: function (event, payload) {
				this.parent(event, payload);

				var type = event.type,
					el = this.element;

				switch(type) {
					case 'navigate':
						this.fire('onNavigate', event.detail, event);
						return;
					default:
						break;
				}
				this.fire('on' + type.capitalize(), payload, event);
			},
			elementEvents: function (types) {
				this.parent(['focus', 'blur', 'select', 'navigate'].concat(types || []));
			}
		},

		initialize: function () {
			this.parent();
			this.element.wantsFocus = this.config.focus;
			if (this.config.content) {
				this.content = this.config.content;
				if (this.config.content.element) {
					this.adopt(this.content);
				} else if (this.config.content.length) {
					this.adopt.apply(this, this.content);
				}
				this.config.content = null;
				delete this.config.content;
			}
		},

		focus: function () {
			if (this.element.hasFocus) {
				return true;
			}
			if (this.element.focusable) {
				this.element.focus();
			}
			return (this.element.hasFocus === true);
		},

		suicide: function () {
			if (this.content) {
				this.content = [].concat(this.content);
				while(this.content.length) {
					this.content.pop().suicide();
				}
				delete this.content;
			}
			this.parent();
		}
	});
}, {
	BaseGlow: {
		applyLayer: function (frame, args, theme) {
			if (!frame.hasClass('BaseGlow')) {
				frame.addClass('BaseGlow');
				return frame;
			}
			return;
		},
		styles: {
			backgroundColor: 'rgba(0,0,0,.5)'
		}
	},
	BaseHighlight: {
		applyLayer: function (frame, args, theme) {
			return;
		},
		styles: {
		}
	},
	BaseFocus: {
		applyLayer: function (frame, args, theme) {
			if (!frame.hasClass('BaseFocus')) {
				frame.addClass('BaseFocus');
				return frame;
			}
			return;
		},
		styles: {
			backgroundColor: 'red'
		}
	},
	BaseActive: {
		applyLayer: function (frame, args, theme) {
			if (!frame.hasClass('BaseActive')) {
				frame.addClass('BaseActive');
				return frame;
			}
			return;
		},
		styles: {
			backgroundColor: 'rgba(255,0,0,.5)'
		}
	}
});
