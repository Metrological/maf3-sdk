var TestView3 = new MAF.Class({
	ClassName: 'TestView3',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		var back = new MAF.control.BackButton({
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
			label: 'Muzzley',
			styles: {
				width: (this.width / 2) - 1,
				hOffset: button2.outerWidth + 1,
				vOffset: button1.outerHeight + 1
			},
			events: {
				onSelect: function () {
					MAF.application.loadView('view-TestView8');
				}
			}
		}).appendTo(this);

		this.controls.button4 = new MAF.control.TextButton({
			guid: 'demoApp',
			label: 'Launch App #1',
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

		this.controls.button5 = new MAF.control.TextButton({
			guid: 'picasaApp',
			label: 'Picasa',
			styles: {
				width: (this.width / 3) - 2,
				hOffset: this.controls.button4.outerWidth + 1,
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
			label: 'Apps Total #' + ApplicationManager.getApplications().length,
			styles: {
				width: this.width / 3,
				hOffset: this.controls.button5.outerWidth + 1,
				vOffset: button2.outerHeight + 1
			},
			textStyles: {
				anchorStyle: 'right'
			}
		}).appendTo(this);

		var button7 = new MAF.control.TextButton({
			label: 'Secured Button',
			secure: true,
			verifySecure: function(verify) {
				new MAF.dialogs.VerifyPin({
					title: $_('Enter Profile Pin'),
					message: $_('You must provide a correct PIN to proceed'),
					errorMessage: 'ERROR!!!',
					callback: verify,
					forgotPinCallback: function (result) {
						log('forgotPinCallback triggered', result);
					}
				}).show();
			},
			styles: {
				width: this.width,
				vOffset: this.controls.button4.outerHeight + 1
			},
			events: {
				onSelect: function () {
					new MAF.dialogs.Alert({
						title: 'Pin result.',
						message: 'The pin you entered was correct.',
						buttons: [
							{ label: 'Ok' }
						]
					}).show();
				}
			}
		}).appendTo(this);

		var button8 = new MAF.control.TextButton({
			label: 'Alert Dialog',
			styles: {
				width: this.width / 2,
				vOffset: button7.outerHeight + 1
			},
			events: {
				onSelect: function () {
					new MAF.dialogs.Alert({
						title: 'Alert Dialog.',
						message: 'Select a button from below. Select a button from below. Select a button from below. Select a button from below. Select a button from below. Select a button from below. Select a button from below. Select a button from below.',
						buttons: [
							{ label: 'Option 1' },
							{ label: 'Option 2' },
							{ label: 'Option 3' },
							{ label: 'Option 4' },
							{ label: 'Option 5' },
							{ label: 'Option 6' },
							{ label: 'Option 7' }
						]
					}).show();
				}
			}
		}).appendTo(this);

		var button9 = new MAF.control.TextButton({
			label: 'TextEntry Dialog',
			styles: {
				width: (this.width / 2) - 1,
				hOffset: button8.outerWidth + 1,
				vOffset: button7.outerHeight + 1
			},
			events: {
				onSelect: function () {
					new MAF.dialogs.TextEntry({
						title: 'TextEntry Dialog',
						message: 'Enter a desired value'
					}).show();
				}				
			}
		}).appendTo(this);

		var button10 = new MAF.control.TextButton({
			label: 'Profile API',
			styles: {
				width: this.width / 2,
				vOffset: button8.outerHeight + 1
			},
			events: {
				onSelect: function () {
					MAF.application.loadView('view-TestView6');
				}
			}
		}).appendTo(this);

		var button11 = new MAF.control.TextButton({
			label: 'TV API',
			styles: {
				width: (this.width / 2) - 1,
				hOffset: button10.outerWidth + 1,
				vOffset: button8.outerHeight + 1
			},
			events: {
				onSelect: function () {
					MAF.application.loadView('view-TestView7');
				}
			}
		}).appendTo(this);

		var button12 = new MAF.control.ToggleButton({
			label: 'ToggleButton',
			value: '#00FF00',
			valueOnSubline: true,
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

		var button16 = new MAF.control.TextButton({
			label: 'AboutBox View',
			styles: {
				width: this.width,
				vAlign: 'bottom'
			},
			events: {
				onSelect: function () {
					MAF.application.loadView('view-TestView4');
				}
			}
		}).appendTo(this);

		new MAF.element.Grid({
			rows: 2,
			columns: 2,
			carousel: true,
			dataset: ApplicationManager.getApplications(),
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events: {
						onSelect: function (event) {
							var apps = ApplicationManager.getApplications();
							ApplicationManager.load(apps[this.getCellDataIndex()]);
							ApplicationManager.open(apps[this.getCellDataIndex()]);
						},
						onFocus: function () {
							this.setStyle('backgroundColor', Theme.getStyles('BaseFocus', 'backgroundColor'));
						},
						onBlur: function () {
							this.setStyle('backgroundColor', null);
						}
					}
				});
				cell.text = new MAF.element.Text({
					styles: {
						backgroundColor: 'black',
						fontSize: 24,
						color: 'white',
						width: cell.width - 20,
						height: cell.height - 20,
						hOffset: 10,
						vOffset: 10,
						anchorStyle: 'center'
					}
				}).appendTo(cell);
				return cell;
			},
			cellUpdater: function (cell, data) {
				cell.text.setText(data.split('.').pop());
			},
			styles: {
				width: this.width,
				height: 200,
				vOffset: button15.outerHeight + 1
			}
		}).appendTo(this);
	}
});
