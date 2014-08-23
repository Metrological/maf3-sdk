// Create a class and extended it from the MAF.system.SidebarView
var MainView = new MAF.Class({
	ClassName: 'MainView',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		// Reference to the current view
		var view = this;
		view.parent(); // Call super class constructor
		// Add tabs array to view
		view.tabs = [
			{label: 'Tab 1', value: '1', src: 'Images/tv.png'},
			{label: 'Tab 2', value: '2'},
			{label: 'Tab 3', value: '3'},
			{label: 'Tab 4', value: '4'},
			{label: 'Tab 5', value: '5', src: 'Images/tv.png'},
			{label: 'Tab 6', value: '6'},
			{label: 'Tab 7', value: '7'},
			{label: 'Tab 8', value: '8', src: 'Images/tv.png'}
		];
	},

	// Create your view template
	createView: function () {
		var view = this;

		var fixedTabLabel = new MAF.element.Text({
			label: 'Fixed Tab',
			styles: {
				height: 50,
				width: view.width,
				fontSize: 35,
				paddingLeft: 20
			}
		}).appendTo(view);

		// Create a fixed tab
		var fixedTab = new MAF.control.FixedTab({
			options: view.tabs,
			defaultTab: 0,
			carousel: true,
			styles: {
				height: 60,
				width: view.width,
				vOffset: fixedTabLabel.outerHeight
			},
			events: {
				onTabChanged: function () {
					console.log('onTabChanged function');
				}
			}
		}).appendTo(view);

		var singleTabLabel = new MAF.element.Text({
			label: 'Single Tab',
			styles: {
				height: 50,
				width: view.width,
				vOffset: fixedTab.outerHeight + 70,
				fontSize: 35,
				paddingLeft: 20
			}
		}).appendTo(view);

		// Create a single tab
		var singleTab = new MAF.control.SingleTab({
			options: view.tabs,
			defaultTab: 0,
			carousel: true,
			styles: {
				height: 60,
				width: view.width,
				vOffset: singleTabLabel.outerHeight
			},
			events: {
				onTabChanged: function () {
					console.log('onTabChanged function');
				}
			}
		}).appendTo(view);

		var tabPipeLabel = new MAF.element.Text({
			label: 'TabPipe',
			styles: {
				height: 50,
				width: view.width,
				vOffset: singleTab.outerHeight + 70,
				fontSize: 35,
				paddingLeft: 20
			}
		}).appendTo(view);

		// Create a tab pipe
		var tabPipe = view.elements.tabPipe = new MAF.control.TabPipe({
			theme: false,
			defaultTab: 3,
			styles: {
				borderBottom: '2px solid white',
				width: view.width,
				vOffset: tabPipeLabel.outerHeight
			},
			events: {
				onTabSelect: function () {
					console.log('onTabSelect function');
				}
			}
		}).appendTo(view);

		var tabStripLabel = new MAF.element.Text({
			label: 'TabStrip',
			styles: {
				height: 50,
				width: view.width,
				vOffset: tabPipe.outerHeight + 70,
				fontSize: 35,
				paddingLeft: 20
			}
		}).appendTo(view);

		// Create tab strip, same as tab pipe without margins
		var tabStrip = view.elements.tabStrip = new MAF.control.TabStrip({
			theme: false,
			defaultTab: 6,
			styles: {
				borderBottom: '2px solid white',
				width: view.width,
				vOffset: tabStripLabel.outerHeight
			},
			events: {
				onTabSelect: function () {
					console.log('onTabSelect function');
				}
			}
		}).appendTo(view);

		var customTabPipeLabel = new MAF.element.Text({
			label: 'Custom TabPipe',
			styles: {
				height: 50,
				width: view.width,
				vOffset: tabStrip.outerHeight + 70,
				fontSize: 35,
				paddingLeft: 20
			}
		}).appendTo(view);

		// Create a custom styled tab pipe, the ClassName can be used
		// in combination with the theme
		var customPipe = view.elements.cutomTabPipe = new MAF.control.TabPipe({
			ClassName: 'CustomTab',
			theme: false,
			defaultTab: 2,
			styles: {
				width: view.width,
				height: 80,
				vOffset: customTabPipeLabel.outerHeight,
				borderBottom: 0
			},
			events: {
				onTabSelect: function () {
					console.log('onTabSelect function');
				}
			}
		}).appendTo(view);
	},

	// After create view and when returning to the view
	// the update view is called
	updateView: function () {
		var view = this,
			elements = view.elements;
		// Use tabs array from view to set the tab strip
		elements.tabStrip.initTabs(view.tabs);
		// Init tabs with data for both tab pipe and a custom tab pipe
		elements.tabPipe.initTabs([
			{label: 'Tab 1', src: 'Images/tv.png', value: '1'},
			{label: 'Tab 2', value: '2'},
			{label: 'Tab 3', src: 'Images/tv.png', value: '3'},
			{label: 'Tab 4', src: 'Images/tv.png', value: '4'},
			{label: 'Tab 5', src: 'Images/tv.png', value: '5'},
			{label: 'Tab 6', src: 'Images/tv.png', value: '6'}
		]);
		elements.cutomTabPipe.initTabs([
			{label: 'Tab 1', value: '1'},
			{label: 'Tab 2', value: '2'},
			{label: 'Tab 3', value: '3'},
			{label: 'Tab 4', value: '4'},
			{label: 'Tab 5', value: '5'},
			{label: 'Tab 6', value: '6'}
		]);
	},

	// When closing the application make sure you unreference 
	// you're objects and arrays from the view
	destroyView: function () {
		var view = this;
		delete view.tabs;
	}
});
