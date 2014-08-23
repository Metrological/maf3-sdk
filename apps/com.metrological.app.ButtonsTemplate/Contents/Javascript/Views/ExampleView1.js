// Create a class and extended it from the MAF.system.SidebarView
var ExampleView1 = new MAF.Class({
	ClassName: 'ExampleView1',

	Extends: MAF.system.SidebarView,

	// Create your view template
	createView: function () {
		// Reference to the current view
		var view = this;

		// Create a Text element with translated label
		var textButtonLabel = new MAF.element.Text({
			label: $_('MAF.control.TextButton'),
			styles: {
				height: 40,
				width: 400,
				hOffset: (view.width - 400) / 2
			}
		}).appendTo(view);

		// Create a Text button with a select event
		var textButton = new MAF.control.TextButton({
			label: $_('TextButton'),
			styles: {
				width: textButtonLabel.width,
				height: 60,
				hOffset: textButtonLabel.hOffset,
				vOffset: textButtonLabel.outerHeight
			},
			textStyles: {
				anchorStyle: 'center'
			},
			events: {
				onSelect: function () {
					log('onSelect function TextButton');
				}
			}
		}).appendTo(view);

		var buttonLabel = new MAF.element.Text({
			label: $_('MAF.element.Button'),
			styles: {
				height: textButtonLabel.height,
				width: textButtonLabel.width,
				hOffset: textButton.hOffset,
				vOffset: textButton.outerHeight + 40
			}
		}).appendTo(view);

		// Create a Button element and get styling from the Theme
		var elementButton = new MAF.element.Button({
			styles: {
				width: textButtonLabel.width,
				height: textButton.height,
				hOffset: textButtonLabel.hOffset,
				vOffset: buttonLabel.outerHeight,
				backgroundColor: Theme.getStyles('BaseGlow', 'backgroundColor')
			},
			events:{
				onFocus: function () {
					// Use animate to change background color and scale
					this.animate({
						duration: 0.2,
						backgroundColor: 'orange',
						scale: 1.2
					});
				},
				onBlur: function () {
					this.animate({
						duration: 0.2,
						backgroundColor: Theme.getStyles('BaseGlow', 'backgroundColor'),
						scale: 1
					});
				},
				onSelect: function () {
					log('onSelect function Button');
				}
			}
		}).appendTo(view);

		var controlButtonLabel = new MAF.element.Text({
			label: $_('MAF.control.Button'),
			styles: {
				height: textButtonLabel.height,
				width: textButtonLabel.width,
				hOffset: textButton.hOffset,
				vOffset: elementButton.outerHeight + 40
			}
		}).appendTo(view);

		// Create a Button element with default styling from framework
		// Difference between a MAF.element.Button and MAF.control.Button 
		// is basic styling and guid support
		var controlButton = new MAF.control.Button({
			styles: {
				width: textButtonLabel.width,
				height: textButton.height,
				hOffset: textButtonLabel.hOffset,
				vOffset: controlButtonLabel.outerHeight
			},
			events:{
				onSelect: function () {
					log('onSelect function Button');
				}
			}
		}).appendTo(view);

		var imageToggleButtonLabel = new MAF.element.Text({
			label: $_('MAF.control.ImageToggleButton'),
			styles: {
				height: textButtonLabel.height,
				width: textButtonLabel.width,
				hOffset: textButtonLabel.hOffset,
				vOffset: controlButton.outerHeight + 40
			}
		}).appendTo(view);

		// Create an ImageToggleButton
		var imageToggleButton = new MAF.control.ImageToggleButton({
			label: $_('ImageToggleButton'),
			value: "0",
			theme: false, // Disable standard Theme
			options: [
				{ value: "0", src: "Images/ButnOff.png" },
				{ value: "1", src: "Images/ButnOn.png"  }
			],
			styles: {
				height: textButton.height,
				width: textButtonLabel.width,
				hOffset: textButtonLabel.hOffset,
				vOffset: imageToggleButtonLabel.outerHeight,
				backgroundColor: Theme.getStyles('BaseGlow', 'backgroundColor')
			},
			textStyles: {
				fontSize: 22,
				vOffset: 2,
				hOffset: 10
			},
			events: {
				onFocus: function (event){
					if (parseInt(this.getValue(), 10) === 1)
						this.valueDisplay.setSource('Images/ButnOnF.png');
					else
						this.valueDisplay.setSource('Images/ButnOffF.png');
				},
				onBlur: function (event){
					if (parseInt(this.getValue(), 10) === 1)
						this.valueDisplay.setSource('Images/ButnOn.png');
					else
						this.valueDisplay.setSource('Images/ButnOff.png');
				},
				onValueChanged: function (event) {
					var value = parseInt(event.payload.value, 10);
					log('onValueChanged function ImageToggleButton', value);
					this.valueDisplay.setSource(value === 1 ? 'Images/ButnOnF.png' : 'Images/ButnOffF.png');
					event.stop(); // Prevent default behaviour
				}
			}
		}).appendTo(view);

		var toggleButtonLabel = new MAF.element.Text({
			label: $_('MAF.control.ToggleButton'),
			styles: {
				height: textButtonLabel.height,
				width: textButtonLabel.width,
				hOffset: textButtonLabel.hOffset,
				vOffset: imageToggleButton.outerHeight + 40
			}
		}).appendTo(view);

		// Create a ToggleButton
		var toggleButton = new MAF.control.ToggleButton({
			label: $_('ToggleButton'),
			value: '0',
			styles: {
				height: textButton.height,
				width: textButtonLabel.width,
				hOffset: textButtonLabel.hOffset,
				vOffset: toggleButtonLabel.outerHeight
			},
			options: [
				{ value: "0", label: $_('Option1') },
				{ value: "1", label: $_('Option2') }
			],
			events: {
				onValueChanged : function (event) {
					var value = parseInt(event.payload.value, 10);
					log('onValueChanged function ToggleButton', value);
				}
			}
		}).appendTo(view);

		// Create a TextButton to load the next view, by adding it into
		// the view.controls object and adding an unique guid the focus
		// will be remembered by the view
		var nextView = view.controls.nextView = new MAF.control.TextButton({
			guid: 'loadExampleView2',
			label: $_('ExampleView 2'),
			styles: {
				width: textButtonLabel.width,
				height: textButton.height,
				hOffset: textButtonLabel.hOffset,
				vOffset: view.height - 100
			},
			textStyles:{
				hOffset: 10
			},
			content: [
				new MAF.element.Text({
					label: FontAwesome.get('chevron-right'), // Create a FontAwesome icon 
					styles: {
						height: 'inherit',
						width: 'inherit',
						hOffset: -10,
						anchorStyle: 'rightCenter'
					}
				})
			],
			events: {
				onSelect: function () {
					// Load next Example view with data
					MAF.application.loadView('view-ExampleView2', {
						myData: [1, 2, 3]
					});
				}
			}
		}).appendTo(view);
	},

	// After create view and when returning to the view
	// the update view is called
	updateView: function () {
		// Data from previous view 
		var view = this,
			myBackData = view.backParams && view.backParams.myBackData;
		if (myBackData)
			log('updateView recieved data from previous view', myBackData);
	}
});
