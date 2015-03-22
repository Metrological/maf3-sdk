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
 * The following properties are used in views:
 * * this.config - properties passed at initiation
 * * this.persist - Persistant storage for when the view gets reloaded.
 * * this.cache - For storage of temporary data.
 * * this.controls - References to view controls that will have state saving.
 * * this.elements - References to view controls without state saving.
 * @class MAF.system.BaseView
 * @classdesc This component implements the basics for a view.
 * @extends MAF.element.Core
 */
define('MAF.system.BaseView', function () {
	var minimalRendering = getSetting('render') === 'minimal',
		animationSupport = getSetting('animation') !== false,
		messagecenterlisteners = {};

	function generateTransition(view, type) {
		var eventType = 'on' + type.capitalize();
		if (type === 'updateView') view.thaw();
		if (animationSupport && view.transition && view.transition[type]) {
			var animation = Object.merge({}, view.transition[type], {
				events: {
					onAnimationEnded: function () {
						if ((type === 'hideView' || type === 'unselectView') && document.activeElement && view.element === document.activeElement.window) {
							return;
						}
						if (view.fire(eventType)) view[type].call(view);
						if (type === 'hideView') view.freeze();
					}
				}
			});
			view.animate(animation);
		} else {
			if (view.fire(eventType)) view[type].call(view);
			if (type === 'hideView') view.freeze();
		}
	}

	return new MAF.Class({
		ClassName: 'BaseView',

		Extends: MAF.element.Core,

		viewBackParams: null,

		Protected: {
			initElement: function () {
				this.parent();
				var proto = this.constructor.prototype;
				if (proto && proto.constructor) {
					this.element.addClass(proto.constructor.prototype.ClassName);
				}
			},
			onLoadView: function () {
				var view = this;
				if (view.fire('onCreateView')) {
					if (!minimalRendering) view.thaw();
					view.createView();
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

		/**
		 * View initialization method that can be implemented (or overridden) by objects that inherit the member. 
		 * @method MAF.system.BaseView#initView
		 * @abstract
		 */
		initView: emptyFn,
		/**
		 * View creation method that must be implemented (or overridden) by objects that inherit the member. 
		 * @method MAF.system.BaseView#createView
		 * @abstract
		 */
		createView: emptyFn,
		/**
		 * View update method that can be implemented (or overridden) by objects that inherit the member. 
		 * @method MAF.system.BaseView#updateView
		 * @abstract
		 */
		updateView: emptyFn,
		/**
		 * View has gained focus method that can be implemented (or overridden) by objects that inherit the member. 
		 * @method MAF.system.BaseView#selectView
		 * @abstract
		 */
		selectView: emptyFn,
		/**
		 * View has lost focus method that can be implemented (or overridden) by objects that inherit the member. 
		 * @method MAF.system.BaseView#unselectView
		 * @abstract
		 */
		unselectView: emptyFn,
		/**
		 * View destruction method that can be implemented (or overridden) by objects that inherit the member. 
		 * @method MAF.system.BaseView#destroyView
		 * @abstract
		 */
		destroyView: emptyFn,
		/**
		 * View hide method that can be implemented (or overridden) by objects that inherit the member. 
		 * @method MAF.system.BaseView#hideView
		 * @abstract
		 */
		hideView: emptyFn,
		favbutton: emptyFn,

		getView: function () {
			return this;
		},

		/**
		 * Register a function for callback on MAF.messages.
		 * @method MAF.system.BaseView#registerMessageCenterListenerCallback
		 * @example
		 * var myView = new MAF.Class({
		 *    initView: function() {
		 *       this.registerMessageCenterListenerCallback(this.dataChanged);
		 *       MAF.messages.store('news', 'The news is in.');
		 *       MAF.messages.store('games', 'What games?');
		 *    },
		 *    dataChanged: function (event) {
		 *       if (event.payload.value && !this.frozen) {
		 *          switch (event.payload.key) {
		 *             case 'news':
		 *                //The view is visible and news is stored in MAF.messages
		 *                break;
		 *          }
		 *       } else {
		 *          switch (event.payload.key) {
		 *             case 'news':
		 *                //news is stored in MAF.messages and the view is not visible
		 *                break;
		 *          }
		 *       }
		 *       if (event.payload.key === 'games') {
		 *          //Once this view has loaded we always do something when games is stored on MAF.messages.
		 *          //Also when a different view is active.
		 *       }
		 *    }
		 * });
		 */
		registerMessageCenterListenerCallback: function (callback) {
			if (callback && callback.subscribeTo) {
				messagecenterlisteners[this._classID].push(callback.subscribeTo(MAF.messages, MAF.messages.eventType, this));
			}
		},

		/**
		 * Register a component for callback on MAF.messages.
		 * @method MAF.system.BaseView#registerMessageCenterListenerControl
		 * @example
		 * var myView = new MAF.Class({
		 *    createView: function () {
		 *       this.controls.header = new MAF.control.Header({
		 *          label: 'Header',
		 *          events: {
		 *             onBroadcast: function () {
		 *                this.setText('Button randomized: ' + MAF.messages.fetch('button'));
		 *             }
		 *          }
		 *       }).appendTo(this);
		 *
		 *       this.controls.button = new MAF.control.TextButton({
		 *          label: 'Random number stored',
		 *          styles: {
		 *             vOffset: this.controls.header.outerHeight
		 *          },
		 *          events: {
		 *             onSelect: function () {
		 *                MAF.messages.store('button', Number.random(1, 1000));
		 *             }
		 *          }
		 *       }).appendTo(this);
		 *    },
		 *    updateView: function() {
		 *       this.registerMessageCenterListenerControl(this.controls.header);
		 *    }
		 * });
		 * @todo Not working correctly yet.
		 */
		registerMessageCenterListenerControl: function (control) {
//			if (control && control.fire)
//				messagecenterlisteners[this._classID].push(control.fire.subscribeTo(MAF.messages, MAF.messages.eventType, control));
		},

		suicide: function () {
			delete messagecenterlisteners[this._classID];
			delete this.rendered;
			delete this.selected;
			delete this.persist;
			delete this.cache;
			delete this.historyDirection;
			delete this.historyNoSave;
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
