include('Javascript/Core/ApplicationManager.js');
include('Javascript/Core/API.js');
include('Javascript/Views/TestView1.js');
include('Javascript/Views/TestView2.js');
include('Javascript/Views/TestView3.js');

MAF.application.init({
	views: [
		{ id: 'view-TestView1', viewClass: TestView1 },
		{ id: 'view-TestView2', viewClass: TestView2 },
		{ id: 'view-TestView3', viewClass: TestView3 },
		{ id: 'view-TestView4', viewClass: MAF.views.AboutBox }
	],
	defaultViewId: 'view-TestView1',
	settingsViewId: null
});
