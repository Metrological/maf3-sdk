include('Javascript/core/ApplicationManager.js');
include('Javascript/views/AutoStart.js');

MAF.application.init({
	views: [
		{ id: 'AutoStart', viewClass: AutoStart }
	],
	defaultViewId: 'AutoStart',
	settingsViewId: null
});
