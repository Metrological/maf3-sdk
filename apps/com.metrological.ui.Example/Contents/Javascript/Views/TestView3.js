var TestView3 = new MAF.Class({
	ClassName: 'TestView3',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		var back = new MAF.control.BackButton({
			label: 'Back'
		}).appendTo(this);

		var button1 = new MAF.control.TextButton({
			label: 'Reload',
			styles: {
				vOffset: back.outerHeight + 1
			},
			events: {
				onSelect: function () {
					ApplicationManager.reload();
				}
			}
		}).appendTo(this);

		var button2 = new MAF.control.TextButton({
			label: 'Close Window',
			styles: {
				width: this.width / 2,
				vOffset: button1.outerHeight + 1
			},
			events: {
				onSelect: function () {
					window.close();
				}
			}
		}).appendTo(this);

		var button3 = new MAF.control.TextButton({
			label: 'Applications',
			styles: {
				width: (this.width / 2) - 1,
				hOffset: button2.outerWidth + 1,
				vOffset: button1.outerHeight + 1
			},
			events: {
				onSelect: function () {
					log(ApplicationManager.getApplications());
				}
			}
		}).appendTo(this);

		var button4 = new MAF.control.TextButton({
			label: 'Launch App',
			styles: {
				width: this.width / 3,
				vOffset: button2.outerHeight + 1
			},
			events: {
				onSelect: function () {
					var apps = ApplicationManager.getApplications();
					ApplicationManager.load(apps[0]);
					ApplicationManager.open(apps[0]);
				}
			}
		}).appendTo(this);

		var button5 = new MAF.control.TextButton({
			label: 'Picasa',
			styles: {
				width: (this.width / 3) - 2,
				hOffset: button4.outerWidth + 1,
				vOffset: button2.outerHeight + 1
			},
			textStyles: {
				anchorStyle: 'center'
			},
            events: {
                onSelect: function () {
                    MAF.application.loadView('view-TestView5a');
                }
            }
		}).appendTo(this);

		var button6 = new MAF.control.TextButton({
			label: 'Button6',
			styles: {
				width: this.width / 3,
				hOffset: button5.outerWidth + 1,
				vOffset: button2.outerHeight + 1
			},
			textStyles: {
				anchorStyle: 'right'
			}
		}).appendTo(this);

		var button7 = new MAF.control.TextButton({
			label: 'Button7',
			styles: {
				width: this.width,
				vOffset: button4.outerHeight + 1
			}
		}).appendTo(this);

		var button8 = new MAF.control.TextButton({
			label: 'Button8',
			styles: {
				width: this.width / 2,
				vOffset: button7.outerHeight + 1
			}
		}).appendTo(this);

		var button9 = new MAF.control.TextButton({
			label: 'Button9',
			styles: {
				width: (this.width / 2) - 1,
				hOffset: button8.outerWidth + 1,
				vOffset: button7.outerHeight + 1
			}
		}).appendTo(this);

		var button10 = new MAF.control.TextButton({
			label: 'Button10',
			styles: {
				width: this.width / 2,
				vOffset: button8.outerHeight + 1
			}
		}).appendTo(this);

		var button11 = new MAF.control.TextButton({
			label: 'Button11',
			styles: {
				width: (this.width / 2) - 1,
				hOffset: button10.outerWidth + 1,
				vOffset: button8.outerHeight + 1
			},
			events: {
				onSelect: function () {
					button10.suicide();
				}
			}
		}).appendTo(this);

		var button12 = new MAF.control.ToggleButton({
			label: 'ToggleButton',
			value: '#00FF00',
			options: [{value: "#FF0000", label: "Red"},{value: "#00FF00", label: "Green"}],
			styles: {
				vOffset: button11.outerHeight + 1
			}
		}).appendTo(this);

		this.controls.button13 = new MAF.control.SelectButton({
			guid: 'selectacolor',
			label: 'SelectButton',
			value: '#FF0000',
			optionGridRows: 8,
			options: [
				{value: "#FF0000", label: "Red"},
				{value: "#00FF00", label: "Green"},
				{value: "#0000FF", label: "Blue"}
			],
			styles: {
				vOffset: button12.outerHeight + 1
			}
		}).appendTo(this);

		var button14 = new MAF.control.PromptButton({
			label: 'PromptButton',
			value: '#00FF00',
			options: [{value: "#FF0000", label: "Red"},{value: "#00FF00", label: "Green"}],
			styles: {
				vOffset: this.controls.button13.outerHeight + 1
			}
		}).appendTo(this);

		var button15 = new MAF.control.TextEntryButton({
			label: 'TextEntryButton',
			value: '#00FF00',
			styles: {
				vOffset: button14.outerHeight + 1
			}
		}).appendTo(this);

		var testList = new MAF.element.Container({
			element: List,
			styles: {
				width: 200,
				height: 51,
				backgroundColor: 'red',
				hOffset: (this.width - 200) / 2,
				vOffset: button15.outerHeight + 1
			}
		}).appendTo(this);

		var button16 = new MAF.control.TextButton({
			label: 'AboutBox View',
			styles: {
				width: this.width,
				vAlign: 'bottom'
			},
			events: {
				onSelect: function() {
					KONtx.application.loadView('view-TestView4',  {pages: [
				{id: 'copyright', name: 'Copyright'}, 
				{id: 'tos', name: 'Terms of Service', srcString: 'TOS jhkjasjka sakjhkas hkjash kjahsk'}, 
				{id: 'privacy', name: 'Privacy'},
				new MAF.control.TextButton({label: 'Button(s) you can pass along',styles: {width: 588, vAlign: 'bottom'}})]});
				}
			}
		}).appendTo(this);
	}
});
