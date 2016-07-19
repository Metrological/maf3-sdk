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
 * @class MAF.dialogs.BaseDialogImplementation
 * @classdesc > Base dialog class implementation for all dialog boxes.
 */
/**
 * @cfg {Function} focusOnCompletion Component which will recieve focus after the dialog is dismissed.
 * @memberof MAF.dialogs.BaseDialogImplementation
 */
/**
 * @cfg {Boolean} isModal
 * @memberof MAF.dialogs.BaseDialogImplementation
 * @deprecated
 */
define('MAF.dialogs.BaseDialogImplementation', function () {
	var boundDispatchers = {};
	return new MAF.Class({
		ClassName: 'BaseDialogImplementation',

		Implements: [
			Library.Storage
		],

		Protected: {
			removeHandler: function() {
				var boundDispatcher = boundDispatchers[this._classID];
				if (boundDispatcher) {
					boundDispatcher.unsubscribeFrom(MAF.application, ['onDialogDone', 'onDialogCancelled', 'onHideView']);
					delete boundDispatchers[this._classID];
				}
			}
		},

		config: {
			focusOnCompletion: null,
			isModal: false
		},

		/**
		 * Initialize the class
		 * @method MAF.dialogs.BaseDialogImplementation#initialize
		 */
		initialize: function () {
			this.store('key', md5(this._classID));
		},

		/**
		 * Shows the dialog.
		 * @method MAF.dialogs.BaseDialogImplementation#show
		 * @return {Class} This component.
		 */
		show: function() {
			if (!MAF.application.isSidebarLoaded()) {
				return;
			}
			this.store('viewId', MAF.application.getCurrentViewId());
			boundDispatchers[this._classID] = this.dispatchEvents.subscribeTo(MAF.application, ['onDialogDone', 'onDialogCancelled', 'onHideView'], this);
			// we need this since this is the only place where we activate dialogs
			// ??? it would be nice if this was responding to an onShowDialog event or something
			MAF.HostEventManager.send('showDialog', this.getDialogConfig());
			return this;
		},

		/**
		 * Hide the dialog.
		 * @method MAF.dialogs.BaseDialogImplementation#hide
		 * @return {Class} This component.
		 */
		hide: function() {
			this.removeHandler();
			MAF.HostEventManager.send('hideDialog', this.getDialogConfig());
			return this;
		},

		dispatchEvents: function(event) {
			if (event.type == "onHideView") {
				if (this.retrieve('viewId') !== event.payload.viewId) {
					return;
				}
				this.removeHandler();
			} else if (event.payload.key === this.retrieve('key')) {
				this.removeHandler();
				if (event.type === 'onDialogCancelled') {
					event.payload.cancelled = true;
				}
				if (this.config.focusOnCompletion && this.config.focusOnCompletion.focus && this.config.focusOnCompletion.focus.call) {
					this.config.focusOnCompletion.focus();
					delete this.config.focusOnCompletion;
				}
				this.handleCallback(event.payload);
			}
		},

		/**
		 * Produces an error if a subclass does not override this method.
		 * @method MAF.dialogs.BaseDialogImplementation#getDialogConfig
		 */
		getDialogConfig: function() {
		},

		/**
		 * Produces an error if a subclass does not override this method.
		 * @method MAF.dialogs.BaseDialogImplementation#handleCallback
		 */
		handleCallback: function(response) {
		}
	});
});
