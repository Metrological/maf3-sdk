define('MAF.system.IconView', function () {
	return new MAF.Class({
		ClassName: 'IconView',
		Extends: MAF.system.BaseView,
		viewType: 'ICON'
	});
}, {
	IconView: {
		styles: {
			width: '192px',
			height: '192px'
		}
	}
});
