include('Javascript/Core/ApplicationManager.js');
include('Javascript/Views/AutoStart.js');

MAF.application.init({
	views: [
		{ id: 'AutoStart', viewClass: AutoStart }
	],
	defaultViewId: 'AutoStart',
	settingsViewId: null
});
