define('MAF.control.ImageToggleButton', function () {
	return new MAF.Class({
		ClassName: 'ImageToggleButton',
		Extends: MAF.control.InputButton,

		config: {
			styling: true
		},

		changeValue: function (change_callback, current_value) {
			var options = this.getOptions(),
				index = options.map(function(o) {
					return o.value;
				}).indexOf(current_value);

			index = index == -1 || index == options.length - 1 ? 0 : index + 1;
			var next_value = options[index].value;
			change_callback(next_value);
		}
	});
}, {
	ImageToggleButton: 'ControlButton'
});
