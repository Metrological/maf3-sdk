// Create a new View class and extended it from the MAF.system.SidebarView
var MainView = new MAF.Class( {
	ClassName: 'MainView',

	Extends: MAF.system.SidebarView,

	// Add tabs array to view
	tabs: [
		{ label: $_( 'Tab1' ), value: '1', src: 'Images/tv.png' },
		{ label: $_( 'Tab2' ), value: '2' },
		{ label: $_( 'Tab3' ), value: '3' },
		{ label: $_( 'Tab4' ), value: '4' },
		{ label: $_( 'Tab5' ), value: '5', src: 'Images/tv.png' },
		{ label: $_( 'Tab6' ), value: '6' },
		{ label: $_( 'Tab7' ), value: '7' },
		{ label: $_( 'Tab8' ), value: '8', src: 'Images/tv.png' }
	],

	// Create your view template
	createView: function() {
		var fixedTabLabel = new MAF.element.Text( {
			label: $_( 'FixedTab' ),
			styles: {
				height: 50,
				width: this.width,
				fontSize: 35,
				paddingLeft: 20
			}
		} ).appendTo( this );

		// Create a fixed tab
		var fixedTab = new MAF.control.FixedTab( {
			options: this.tabs,
			defaultTab: 0,
			carousel: true,
			styles: {
				height: 60,
				width: this.width,
				vOffset: fixedTabLabel.outerHeight
			},
			events: {
				onTabChanged: function() {
					log( 'fixedTab onTabChanged function' );
				}
			}
		} ).appendTo( this );

		var singleTabLabel = new MAF.element.Text( {
			label: $_( 'SingleTab' ),
			styles: {
				height: 50,
				width: this.width,
				vOffset: fixedTab.outerHeight + 70,
				fontSize: 35,
				paddingLeft: 20
			}
		} ).appendTo( this );

		// Create a single tab
		var singleTab = new MAF.control.SingleTab( {
			options: this.tabs,
			defaultTab: 0,
			carousel: true,
			styles: {
				height: 60,
				width: this.width,
				vOffset: singleTabLabel.outerHeight
			},
			events: {
				onTabChanged: function() {
					log( 'singleTab onTabChanged function' );
				}
			}
		} ).appendTo( this );

		var tabPipeLabel = new MAF.element.Text( {
			label: $_( 'TabPipe' ),
			styles: {
				height: 50,
				width: this.width,
				vOffset: singleTab.outerHeight + 70,
				fontSize: 35,
				paddingLeft: 20
			}
		} ).appendTo( this );

		// Create a tab pipe
		var tabPipe = this.elements.tabPipe = new MAF.control.TabPipe( {
			theme: false,
			defaultTab: 3,
			styles: {
				borderBottom: '2px solid #F1F1F1',
				width: this.width,
				vOffset: tabPipeLabel.outerHeight
			},
			events: {
				onTabSelect: function() {
					log( 'tabPipe onTabSelect function' );
				}
			}
		} ).appendTo( this );

		var tabStripLabel = new MAF.element.Text( {
			label: $_( 'TabStrip' ),
			styles: {
				height: 50,
				width: this.width,
				vOffset: tabPipe.outerHeight + 70,
				fontSize: 35,
				paddingLeft: 20
			}
		} ).appendTo( this );

		// Create tab strip, same as tab pipe without margins
		var tabStrip = this.elements.tabStrip = new MAF.control.TabStrip( {
			theme: false,
			defaultTab: 6,
			styles: {
				borderBottom: '2px solid #F1F1F1',
				width: this.width,
				vOffset: tabStripLabel.outerHeight
			},
			events: {
				onTabSelect: function() {
					log( 'tabStrip onTabSelect function' );
				}
			}
		} ).appendTo( this );

		var customTabPipeLabel = new MAF.element.Text( {
			label: $_( 'CustomTabPipe' ),
			styles: {
				height: 50,
				width: this.width,
				vOffset: tabStrip.outerHeight + 70,
				fontSize: 35,
				paddingLeft: 20
			}
		} ).appendTo( this );

		// Create a custom styled tab pipe, the ClassName can be used
		// in combination with the theme
		this.elements.cutomTabPipe = new MAF.control.TabPipe( {
			ClassName: 'CustomTab',
			theme: false,
			defaultTab: 2,
			styles: {
				width: this.width,
				height: 80,
				vOffset: customTabPipeLabel.outerHeight,
				borderBottom: 0
			},
			events: {
				onTabSelect: function() {
					log( 'customPipe onTabSelect function' );
				}
			}
		} ).appendTo( this );
	},

	// After create view and when returning to the view
	// the update view is called
	updateView: function() {
		var elements = this.elements;

		// Use tabs array from view to set the tab strip
		elements.tabStrip.initTabs( this.tabs );

		// Init tabs with data for both tab pipe and a custom tab pipe
		elements.tabPipe.initTabs( [
			{ label: $_( 'Tab1' ), src: 'Images/tv.png', value: '1' },
			{ label: $_( 'Tab2' ), value: '2' },
			{ label: $_( 'Tab3' ), src: 'Images/tv.png', value: '3' },
			{ label: $_( 'Tab4' ), src: 'Images/tv.png', value: '4' },
			{ label: $_( 'Tab5' ), src: 'Images/tv.png', value: '5' },
			{ label: $_( 'Tab6' ), src: 'Images/tv.png', value: '6' }
		] );

		elements.cutomTabPipe.initTabs( [
			{ label: $_( 'Tab1' ), value: '1' },
			{ label: $_( 'Tab2' ), value: '2' },
			{ label: $_( 'Tab3' ), value: '3' },
			{ label: $_( 'Tab4' ), value: '4' },
			{ label: $_( 'Tab5' ), value: '5' },
			{ label: $_( 'Tab6' ), value: '6' }
		] );
	},

	// When closing the application make sure you unreference
	// your objects and arrays from the view
	destroyView: function() {
		this.tabs = null;
	}
});
