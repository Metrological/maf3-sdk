/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2013  Metrological
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

		initialize: function () {
			this.store('key', md5(this._classID));
		},

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

		getDialogConfig: function() {
			if (DEBUG) {
				throw new Error("All subclasses must provide this method!");
			}
		},

		handleCallback: function(response) {
			if (DEBUG) {
				throw new Error("All subclasses must provide this method!");
			}
		}
	});
});
