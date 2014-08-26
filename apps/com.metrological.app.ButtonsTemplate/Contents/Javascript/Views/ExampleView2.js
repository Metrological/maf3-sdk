var ExampleView2 = new MAF.Class({
	ClassName: 'ExampleView2',

	Extends: MAF.system.SidebarView,

	// Add back params when going to the previous view
	viewBackParams: {
		myBackData: [1, 2, 3]
	},

	createView: function () {
		var view = this;

		var backButtonLabel = new MAF.element.Text({
			label: $_('MAF.control.BackButton'),
			styles: {
				height: 40,
				width: 400,
				hOffset: (view.width - 400) / 2
			}
		}).appendTo(view);

		// Create a BackButton
		var backButton = new MAF.control.BackButton({
			backParams: view.viewBackParams, // Add backParms on select of BackButton
			styles: {
				width: 400,
				height: 60,
				hOffset: backButtonLabel.hOffset,
				vOffset: backButtonLabel.outerHeight,
				backgroundColor: Theme.getStyles('BaseGlow', 'backgroundColor')
			},
			events:{
				onSelect: function () {
					log('onSelect function BackButton');
				}
			}
		}).appendTo(view);

		var labelSelectButton = new MAF.element.Text({
			label: $_('MAF.control.SelectButton'),
			styles: {
				height: 40,
				width: 400,
				hOffset: backButtonLabel.hOffset,
				vOffset: backButton.outerHeight + 40
			}
		}).appendTo(view);

		// Create a SelectButton
		var selectButton = view.controls.selectButton = new MAF.control.SelectButton({
			guid: 'SelectButton', // Remember focus when returned to view on this button
			label: $_('SelectButton'),
			value: '1',
			//valueOnSubline: true, // Position of the valueDisplay (selectbutton) can be changed with the following option
			optionGridRows: 5,
			options: [
				{ value: '1', label: $_('Option1') },
				{ value: '2', label: $_('Option2') },
				{ value: '3', label: $_('Option3') },
				{ value: '4', label: $_('Option4') }
			],
			styles: {
				width: 400,
				vOffset: labelSelectButton.outerHeight,
				hOffset: backButtonLabel.hOffset
			},
			events: {
				onOptionSelected: function(event) {
					var options = this.getOptions(),
						idx = event.payload.value - 1;
					log('onOptionSelected function SelectButton', options[idx].value);
					this.setValue(options[idx].value);
				}
			}
		}).appendTo(view);

		var textEntryButtonLabel = new MAF.element.Text({
			label: $_('MAF.control.TextEntryButton'),
			styles: {
				height: 40,
				width: 400,
				hOffset: backButtonLabel.hOffset,
				vOffset: selectButton.outerHeight + 40
			}
		}).appendTo(view);

		// Create a TextEntryButton
		var textEntryButton = new MAF.control.TextEntryButton({
			label: $_('Search'),
			styles: {
				width: 400,
				hOffset: backButtonLabel.hOffset,
				vOffset: textEntryButtonLabel.outerHeight
			},
			events: {
				onCancel: function () {
					this.valueDisplay.setText('');
				}
			}
		}).appendTo(view);

		var promptButtonLabel = new MAF.element.Text({
			label: $_('MAF.control.PromptButton'),
			styles: {
				height: 40,
				width: 400,
				hOffset: backButtonLabel.hOffset,
				vOffset: textEntryButton.outerHeight + 40
			}
		}).appendTo(view);

		// Create a PromptButton
		var promptButton = new MAF.control.PromptButton({
			label: $_('PromptButton'),
			value: '1',
			options: [
				{ value: '1', label: 'Option1' },
				{ value: '2', label: 'Option2' }
			],
			styles: {
				width: 400,
				hOffset: backButtonLabel.hOffset,
				vOffset: promptButtonLabel.outerHeight
			}
		}).appendTo(view);
	},

	updateView: function () {
		// Data from load view recieved
		var view = this,
			myData = view.persist && view.persist.myData;
		if (myData)
			log('updateView recieved data from load view', myData);
	}
});
