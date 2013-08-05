include('Javascript/Views/TestView1.js');

MAF.application.init({
	views: [
		{ id: 'view-TestView1', viewClass: TestView1 }
	],
	defaultViewId: 'view-TestView1',
	settingsViewId: null
});
