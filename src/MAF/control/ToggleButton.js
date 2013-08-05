define('MAF.control.ToggleButton', function () {
	return new MAF.Class({
		ClassName: 'ControlToggleButton',

		Extends: MAF.control.InputButton,

		changeValue: function (callback, value) {
			var options = this.getOptions(),
				index = options.map(function (o){
					return o.value;
				}).indexOf(value);
			index = index == -1 || index == options.length - 1 ? 0 : index + 1;
			var v = options[index].value;
			callback(v);
		}
	});
}, {
	ControlToggleButton: 'ControlButton'
});
