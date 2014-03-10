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
 * @class MAF.control.SelectButton
 * @classdesc When selected by the user this will create a new view on which the user can select one of the options
 * of this component. The view created is default {@link MAF.system.OptionSelectView}
 * #### Needs to be referenced on the <b>this.controls</b> object of the view. Also needs a guid, otherwise the states will not be stored between the views.
 * @extends MAF.control.InputButton
 */
/**
 * @cfg {Object} optionViewClass View to create and display the options of this component on. Default MAF.system.OptionSelectView.
 * @memberof MAF.control.SelectButton
 */
/**
 * @cfg {Number} optionGridRows Object of data you want to send to the previous view when selected by a user.
 * @memberof MAF.control.SelectButton
 */
/**
 * @cfg {Number} optionGridColumns Object of data you want to send to the previous view when selected by a user.
 * @memberof MAF.control.SelectButton
 */
define('MAF.control.SelectButton', function () {
	var buildOptionView = function (value) {
		var viewClass = this.config.optionViewClass;
		if (DEBUG && (!viewClass || !viewClass.inheritsFrom || !viewClass.inheritsFrom(MAF.system.SidebarView))) {
			warn(this.ClassName, 'buildOptionView', 'no usable view class in config.optionViewClass');
		}
		var viewConfig = {
			id: this.config.optionListViewId || this._classID + '.' + viewClass.prototype.ClassName,
			data: {
				guid: this.config.guid,
				backLabel: this.config.label,
				options: this.getOptions(),
				value: value,
				optionGridRows: this.config.optionGridRows,
				optionGridColumns: this.config.optionGridColumns,
				cancelDialog: this.config.cancelDialog
			},
			viewClass: viewClass
		};
		this.optionListViewId = viewConfig.id;
		MAF.application.addViewConfig(viewConfig);
		MAF.application.loadView(viewConfig.id);
	};
	var destroyOptionView = function (viewId) {
		if (!viewId) {
			return;
		}
		MAF.application.removeView(viewId);
		delete this.optionListViewId;
	};
	return new MAF.Class({
		ClassName: 'ControlSelectButton',

		Extends: MAF.control.InputButton,

		config: {
			valueOnSubline:    false,
			fillEmptySpace:    false,
			optionViewClass:   MAF.system.OptionSelectView,
			optionGridRows:    1,
			optionGridColumns: 1
		},

		changeValue: function (callback, value) {
			buildOptionView.call(this, value);
		},

		inspectStatePacket: function (packet, focusOnly) {
			var data = this.parent(packet, focusOnly);
			if (focusOnly) {
				return;
			}
			var appmethod;
			if (data) {
				if (data.optionViewId) {
					destroyOptionView.call(this, data.optionViewId);
				}
				switch (data.cancelType) {
					case 'onActivateHomeButton':
						appmethod = MAF.application.loadDefaultView;
						break;
					case 'onActivateSettingsButton':
						appmethod = MAF.application.loadSettingsView;
						break;
				}
			}
			try {
				return data;
			} finally {
				if (appmethod) {
					appmethod();
				}
			}
		}
	});
}, {
	ControlSelectButton: 'ControlButton',
	ControlSelectButtonSubline: 'ControlInputButtonSubline'
});
