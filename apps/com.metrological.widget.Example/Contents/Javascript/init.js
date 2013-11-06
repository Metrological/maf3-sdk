Theme.set({
	BaseFocus: {
		applyLayer: function (frame, args, theme) {
			if (!frame.hasClass('BaseFocus')) {
				frame.addClass('BaseFocus');
				return frame;
			}
			return;
		},
		styles: {
			backgroundColor: 'blue'
		}
	}
});

include('Javascript/Core/API.js');
include('Javascript/Views/TestView1.js');
include('Javascript/Views/TestView2.js');
include('Javascript/Views/TestView3.js');
include('Javascript/Views/TestView4.js');
include('Javascript/Views/TestView5a.js');
include('Javascript/Views/TestView5b.js');
include('Javascript/Views/TestView6.js');
include('Javascript/Views/TestView7.js');
include('Javascript/Views/TestView8.js');
include('Javascript/Views/TestView9.js');
include('Javascript/Views/TestView10.js');

var photopgr;

MAF.application.init({
	views: [
		{ id: 'view-TestView1', viewClass: TestView1 },
		{ id: 'view-TestView2', viewClass: TestView2 },
		{ id: 'view-TestView3', viewClass: TestView3 },
		{ id: 'view-TestView4', viewClass: TestView4 },
		{ id: 'view-TestView5a', viewClass: TestView5a },
		{ id: 'view-TestView5b', viewClass: TestView5b },
		{ id: 'view-TestView6', viewClass: TestView6 },
		{ id: 'view-TestView7', viewClass: TestView7 },
		{ id: 'view-TestView8', viewClass: TestView8 },
		{ id: 'view-TestView9', viewClass: TestView9 },
		{ id: 'view-TestView10', viewClass: TestView10 }
	],
	defaultViewId: 'view-TestView1',
	settingsViewId: 'view-TestView4'
});
