define('MAF.control.SelectButton', function () {
	var buildOptionView = function (current_value) {
		var viewClass = this.config.optionViewClass;

		if (DEBUG && (!viewClass || !viewClass.inheritsFrom || !viewClass.inheritsFrom(MAF.system.SidebarView))) {
			warn(this.ClassName, 'buildOptionView', 'no usable view class in config.optionViewClass');
		}

		var viewConfig = {
			id: this.config.optionListViewId || this._classID + '.' + viewClass.prototype.ClassName + '.' + 0,//animator.milliseconds,
			data: {
				guid: this.config.guid,
				backLabel: this.config.label,
				options: this.getOptions(),
				value: current_value,
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
			return viewId;
		}
		MAF.application.removeView(viewId);

		this.optionListViewId = null;
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

		changeValue: function (change_callback, current_value) {
			buildOptionView.call(this, current_value);
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
			if (appmethod) {
				appmethod();
			}
			return data;
		}
	});
}, {
	ControlSelectButton: 'ControlButton',
	ControlSelectButtonSubline: 'ControlInputButtonSubline'
});
