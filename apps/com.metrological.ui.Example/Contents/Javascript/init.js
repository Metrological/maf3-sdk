include('Javascript/core/ApplicationManager.js');
include('Javascript/views/UI.js');

Facebook.init('183031261739046');
Twitter.init('183031261739046');

MAF.application.init({
	views: [
		{ id: 'view-UI', viewClass: UI }
	],
	defaultViewId: 'view-UI',
	settingsViewId: null
});
