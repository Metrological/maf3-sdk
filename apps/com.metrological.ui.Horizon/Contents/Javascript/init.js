Theme.set({
	BaseFocus: {
		styles: {
			backgroundColor: 'rgba(3,138,224,.5)'
		}
	}
});

var TOS = 1;

include('Javascript/Core/Horizon.js');
include('Javascript/Core/ApplicationManager.js');
include('Javascript/Views/Apps.js');

Facebook.init('183031261739046');
Twitter.init('requiredATM');

MAF.application.init({
	views: [
		{ id: 'view-Apps', viewClass: AppsView }
	],
	defaultViewId: 'view-Apps',
	settingsViewId: null
});
