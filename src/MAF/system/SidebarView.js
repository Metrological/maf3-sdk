define('MAF.system.SidebarView', function () {
	return new MAF.Class({
		ClassName: 'SidebarView',
		Extends: MAF.system.WindowedView,
		viewType: 'SIDEBAR'
	});
}, {
	SidebarView: {
		styles: {
			width: '588px',
			height: '930px'
		}
	}
});
