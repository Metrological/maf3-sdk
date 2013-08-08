define('MAF.system.BaseView', function () {
	var messagecenterlisteners = {};

	return new MAF.Class({
		ClassName: 'BaseView',

		Extends: MAF.element.Core,

		Protected: {
			initElement: function () {
				this.parent();
				var proto = this.constructor.prototype;
				if (proto && proto.constructor) {
					this.element.addClass(proto.constructor.prototype.ClassName);
				}
			},
			elementEvents: function (types) {
				this.parent([
//					'firstdisplay', //@TODO add this on first append
					'focus',
					'blur'
				].concat(types || []));
			},
			dispatcher: function (nodeEvent) {
				this.parent(nodeEvent);
				switch (nodeEvent.type) {
					case 'firstdisplay':
						this.fire('onFirstDisplay', null, nodeEvent);
						break;
					case 'focus':
						this.fire('onFocus', null, nodeEvent);
						break;
					case 'blur':
						this.fire('onBlur', null, nodeEvent);
						break;
					default:
						break;
				}
			},
			onLoadView: function () {
				if (this.fire('onCreateView')) {
					this.createView();
				}
			},
			onUnloadView: function () {
				if (this.fire('onDestroyView')) {
					this.destroyView();
				}
				this.unregisterMessageCenterListeners();
				this.cache = {};
				this.controls = {};
				this.elements = {};
				messagecenterlisteners[this._classID] = [];
			},
			onShowView: function () {
				if (this.fire('onUpdateView')) {
					this.updateView();
				}
			},
			onHideView: function () {
				if (this.fire('onHideView')) {
					this.hideView();
				}
			},
			onSelectView: function () {
				if (this.fire('onFocusView')) {
					this.focusView();
				}
			},
			onUnselectView: emptyFn,
			setInitialFocus: emptyFn,
			unregisterMessageCenterListeners: function () {
				if (messagecenterlisteners[this._classID].length > 0) {
					var listener = false;
					while (listener = messagecenterlisteners[this._classID].pop()) {
						if (listener && listener.unsubscribeFrom && listener.unsubscribeFrom.call) {
							listener.unsubscribeFrom(MAF.messages, MAF.messages.eventType);
						}
					}
				}
			},
			getControlData: function (key, clear) {
				if (this.persist && this.persist.___systemViewData___ && this.persist.___systemViewData___[key]) {
					var value = this.persist.___systemViewData___[key];
					if (clear) {
						this.clearControlData(key);
					}
					return value;
				}
			},
			setControlData: function (key, value) {
				this.persist = this.persist || {};
				this.persist.___systemViewData___ = this.persist.___systemViewData___ || {};
				this.persist.___systemViewData___[key] = value;
			},
			clearControlData: function (key) {
				delete this.persist.___systemViewData___[key];
			},
			getViewController: function () {
				return this;
			}
		},

		config: {
			element: View
		},

		initialize: function () {
			this.parent();
			this.cache = {};
			this.persist = {};
			this.controls = {};
			this.elements = {};
			messagecenterlisteners[this._classID] = [];

			this.rendered = false;
			this.selected = false;

			if (this.config.backParams) {
				this.backParams = this.config.backParams;
				this.config.backParams = null;
				delete this.config.backParams;
			}

			if (this.config.persistParams) {
				this.persist = this.config.persistParams;
				this.config.persistParams = null;
				delete this.config.persistParams;
			}

			this.initView();
		},

		// View initialization method to override in subclassed views.
		initView: emptyFn,
		updateView: emptyFn,
		createView: emptyFn,
		focusView: emptyFn,
		unfocusView: emptyFn,
		destroyView: emptyFn,
		hideView: emptyFn,
		favbutton: emptyFn,

		getView: function () {
			return this;
		},

		registerMessageCenterListenerCallback: function (callback) {
			if (callback && callback.subscribeTo) {
				messagecenterlisteners[this._classID].push(callback.subscribeTo(MAF.messages, MAF.messages.eventType, this));
			}
		},

		registerMessageCenterListenerControl: function (control) {
			if (control && control.fire) {
				messagecenterlisteners[this._classID].push(control.fire.subscribeTo(MAF.messages, MAF.messages.eventType, control));
			}
		},

		suicide: function () {
			delete messagecenterlisteners[this._classID];
			delete this.persist;
			delete this.cache;
			Object.forEach(this.elements, function (key, obj) {
				if (obj && obj.suicide) {
					delete this.elements[key];
					obj.suicide();
				}
			}, this);
			delete this.elements;
			Object.forEach(this.controls, function (key, obj) {
				if (obj && obj.suicide) {
					delete this.controls[key];
					obj.suicide();
				}
			}, this);
			delete this.controls;
			this.parent();
		}
	});
});
