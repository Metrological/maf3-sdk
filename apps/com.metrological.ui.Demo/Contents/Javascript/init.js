Theme.set({
	BaseFocus: {
		styles: {
			backgroundColor: 'rgba(3,138,224,.5)'
		}
	}
});

Theme.Fonts.add('InterstatePro-Bold', 'Fonts/InterstatePro-Bold');
Theme.Fonts.add('InterstatePro-ExtraLight', 'Fonts/InterstatePro-ExtraLight');
Theme.Fonts.add('InterstatePro-Light', 'Fonts/InterstatePro-Light');
Theme.Fonts.add('InterstatePro-Regular', 'Fonts/InterstatePro-Regular');

Theme.Fonts.setDefault('InterstatePro-Regular');

include('Javascript/Core/ApplicationManager.js');
include('Javascript/Views/Apps.js');

Facebook.init('183031261739046');
Twitter.init('requiredATM');

MAF.application.init({
	views: [
		{ id: 'view-Apps', viewClass: AppsView }
	],
	defaultViewId: 'view-Apps'
});
