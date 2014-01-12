/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2014  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
/** 
 * @class MAF.system.BaseView
 * @extends MAF.element.Core
 */
define('MAF.system.BaseView', function () {
	var messagecenterlisteners = {};
	var generateTransition = function (view, type) {
		var eventType = 'on' + type.capitalize();
		if (type === 'updateView') {
			view.thaw();
		}
		if (view.transition && view.transition[type]) {
			var animation = Object.merge({}, view.transition[type], {
				events: {
					onAnimationEnded: function () {
						if ((type === 'hideView' || type === 'unselectView') && document.activeElement && view.element === document.activeElement.window) {
							return;
						}
						if (view.fire(eventType)) {
							view[type].call(view);
						}
						if (type === 'hideView') {
							view.freeze();
						}
					}
				}
			});
			view.animate(animation);
		} else {
			if (view.fire(eventType)) {
				view[type].call(view);
			}
			if (type === 'hideView') {
				view.freeze();
			}
		}
	};

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
			onLoadView: function () {
				if (this.fire('onCreateView')) {
					if (MAF.Browser.webkit) {
						this.thaw();
					}
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
				generateTransition(this, 'updateView');
			},
			onHideView: function () {
				generateTransition(this, 'hideView');
			},
			onSelectView: function () {
				generateTransition(this, 'selectView');
			},
			onUnselectView: function () {
				generateTransition(this, 'unselectView');
			},
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
			getWindow: function () {
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
		createView: emptyFn,
		updateView: emptyFn,
		selectView: emptyFn,
		unselectView: emptyFn,
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
			delete this.viewBackParams;
			delete this.transition;
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
