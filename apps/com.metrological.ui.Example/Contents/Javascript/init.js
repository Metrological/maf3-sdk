include('Javascript/Core/ApplicationManager.js');
include('Javascript/Core/API.js');
include('Javascript/Views/TestView1.js');
include('Javascript/Views/TestView2.js');
include('Javascript/Views/TestView3.js');
include('Javascript/Views/TestView4.js');
include('Javascript/Views/TestView5a.js');
include('Javascript/Views/TestView5b.js');

var photopgr;

MAF.application.init({
	views: [
		{ id: 'view-TestView1', viewClass: TestView1 },
		{ id: 'view-TestView2', viewClass: TestView2 },
		{ id: 'view-TestView3', viewClass: TestView3 },
		{ id: 'view-TestView4', viewClass: TestView4 },
		{ id: 'view-TestView5a', viewClass: TestView5a },
		{ id: 'view-TestView5b', viewClass: TestView5b }
	],
	defaultViewId: 'view-TestView1',
	settingsViewId: null
});
