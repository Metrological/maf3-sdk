Theme.set({
	BaseFocus: {
		styles: {
			backgroundColor: 'rgba(160,234,255,.6)'
		}
	}
});

var TOS = 1;

include('Javascript/core/ApplicationManager.js');
include('Javascript/views/Apps.js');

Facebook.init('183031261739046');
Twitter.init('requiredATM');

MAF.application.init({
	views: [
		{ id: 'view-Apps', viewClass: AppsView }
	],
	defaultViewId: 'view-Apps',
	settingsViewId: null
});

include('Javascript/core/D4A.js');
