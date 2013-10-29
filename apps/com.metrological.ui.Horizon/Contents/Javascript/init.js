include('Javascript/Core/ApplicationManager.js');
include('Javascript/Views/Apps.js');

Facebook.init('183031261739046');
Twitter.init();

MAF.application.init({
	views: [
		{ id: 'view-Apps', viewClass: AppsView }
	],
	defaultViewId: 'view-Apps',
	settingsViewId: null
});

include('Javascript/Core/Horizon.js');
