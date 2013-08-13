define('MAF.system.WindowedView', function () {
	var performControlInspection = function (statePacket, focusOnly) {
		statePacket = Object.merge(this.persist, statePacket, this.backParams);
		if (statePacket) {
			Object.forEach(this.controls, function (key, controls) {
				if (typeOf(controls) === 'array') {
					controls.forEach(function (control, key) {
						tellControlToInspect.call(this, control, statePacket, focusOnly);
					}, this);
				} else {
					tellControlToInspect.call(this, controls, statePacket, focusOnly);
				}
			}, this);
		}
	};

	var tellControlToInspect = function (control, packet, focusOnly) {
		if (control.config && control.config.guid && control.inspectStatePacket && control.inspectStatePacket.call) {
			control.inspectStatePacket.call(control, packet, focusOnly);
		}
	};

	var tellControlToSave = function (control, savedData) {
		if (control.config && control.config.guid && control.generateStatePacket && control.generateStatePacket.call) {
			savedData[control.config.guid] = control.generateStatePacket.call(control);
		}
	};

	return new MAF.Class({
		ClassName: 'WindowedView',

		Extends: MAF.system.BaseView,

		Protected: {
			dispatcher: function (event) {
				this.parent(event);
				switch (event.type) {
					case 'navigate':
						this.fire('onNavigate', event.detail, event);
						break;
					case 'navigateoutofbounds':
						this.fire('onNavigateOutOfBounds', event.detail, event);
						break;
				}
			},
			elementEvents: function (types){
				this.parent([
					'navigate',
					'navigateoutofbounds'
				].concat(types || []));
			},
			setInitialFocus: function () {
				if (this.hasbeenfocused !== true || !document.activeElement) {
					this.parent();
					this.hasbeenfocused = true;
					if (!this.element.focusedView) {
						this.resetFocus();
					}
					performControlInspection.call(this, this.getControlData('statePacket', true), true);
					if (this.fire('onFocusView')) {
						this.focusView();
					}
				}
			},
			onSelectView: function(event) {
				this.parent(event);
				if (!this.element.focusedView) {
					this.resetFocus();
				}
				performControlInspection.call(this, this.getControlData('statePacket'), false);
			},
			onUnselectView: function (event) {
				this.parent(event);
				var savedData = {};
				Object.forEach(this.controls, function (key, control) {
					if (typeOf(control) === 'array') {
						control.forEach(function (control, key) {
							tellControlToSave.call(this, control, savedData);
						}, this);
					} else {
						tellControlToSave.call(this, control, savedData);
					}
				}, this);
				this.setControlData('statePacket', savedData);
				this.hasbeenfocused = false;
			},
			onHideView: function(event) {
				this.parent(event);
				this.backParams = {};
			}
		},

		focusView: emptyFn,

		resetFocus: function () {
			if (this.element) {
				this.element.navigate('down', [0, 0]);
			}
		}
	});
});
