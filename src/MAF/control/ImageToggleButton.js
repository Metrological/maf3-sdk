define('MAF.control.ImageToggleButton', function () {
	return new MAF.Class({
		ClassName: 'ImageToggleButton',

		Extends: MAF.control.InputButton,

		config: {
			styling: true
		},

		changeValue: function (callback, value) {
			var options = this.getOptions(),
				index = options.map(function (o) {
					return o.value;
				}).indexOf(value);
			index = index == -1 || index == options.length - 1 ? 0 : index + 1;
			callback(options[index].value);
		}
	});
}, {
	ImageToggleButton: 'ControlButton'
});
