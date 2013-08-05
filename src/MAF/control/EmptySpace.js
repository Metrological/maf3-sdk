define('MAF.control.EmptySpace', function () {
	return new MAF.Class({
		ClassName: 'ControlEmptySpace',

		Extends: MAF.element.Core
	});
}, {
	ControlEmptySpace: {
		styles: {
			backgroundImage: 'url(' + Image.CHECKERS + ')'
		}
	}
});
