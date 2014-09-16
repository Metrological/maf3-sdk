Theme.set({
	BaseFocus: {
		styles: {
			backgroundColor: 'rgba(3,138,224,.5)'
		}
	}
});

var TOS = 1;

include('Javascript/core/Horizon.js');
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
