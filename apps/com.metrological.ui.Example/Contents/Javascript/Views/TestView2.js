var TestView2 = new MAF.Class({
	ClassName: 'TestView2',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		var button1 = new MAF.control.BackButton({
			label: 'Back'
		}).appendTo(this);

		var button2 = new MAF.control.TextButton({
			label: 'Load TestView3',
			styles: {
				vOffset: button1.outerHeight + 1
			},
			events: {
				onSelect: function () {
					MAF.application.loadView('view-TestView3');
				}
			}
		}).appendTo(this);

		var button3 = new MAF.control.TextButton({
			label: 'Screenshot',
			styles: {
				vOffset: button2.outerHeight + 1
			},
			events: {
				onSelect: function () {
					var view = this.owner,
						current = widget.getElementById('screenshot'),
						screenshot = view.element.createImage();
					if (current) {
						current.destroy();
					}
					screenshot.setAttribute('id', 'screenshot');
					screenshot.setStyles({
						width: 588,
						height: 930,
						hAlign: 'center',
						vAlign: 'center',
						border: '3px solid ' + Theme.getStyles('BaseFocus', 'backgroundColor'),
						zOrder: 99
					}).appendTo(document.body);
				}
			}
		}).appendTo(this);

		var header1 = new MAF.control.Header({
			label: 'Header Small',
			headerStyle: 'small',
			styles: {
				vOffset: button3.outerHeight + 1
			}
		}).appendTo(this);

		var header2 = new MAF.control.Header({
			label: 'Header Large',
			styles: {
				vOffset: header1.outerHeight + 1
			}
		}).appendTo(this);

		var emptySpace = new MAF.control.EmptySpace({
			styles: {
				vOffset: header2.outerHeight + 1,
				width: 'inherit',
				height: 100
			}
		}).appendTo(this);

		var text1 = new MAF.element.TextField({
			label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis turpis vestibulum, rutrum ipsum in, ultricies eros. Sed egestas faucibus interdum. Donec dictum quam ac dignissim ultricies. Pellentesque sed est ac metus ornare ornare et id mauris. Aenean hendrerit elit iaculis lacus aliquam, venenatis cursus risus imperdiet. Nulla sagittis facilisis mi sed sagittis. Nunc et justo tincidunt, congue odio id, rutrum lectus. Vivamus dignissim consectetur tellus. Vivamus lobortis tincidunt augue sed vestibulum. Nulla fringilla gravida purus vel tempus.',
			styles: {
				color: '#ddd',
				vOffset: header2.outerHeight + 1,
				wrap: true,
				anchorStyle: 'justify',
				hOffset: 20,
				width: this.width - 40,
				height: 100
			},
			events: {
				onFocus: function () {
					this.setStyle('color', 'white');
				},
				onBlur: function () {
					this.setStyle('color', '#ddd');
				},
				onKeyDown: function (event) {
					if (event.payload.key === 'a') {
						this.element.cursor = 5;
					}
				},
				onCursor: function (event) {
					log(event, this.element.cursor);
				}
			}
		}).appendTo(this);

		text1.visibleLines = 3;
		text1.firstLine = 1;

		var button4 = new MAF.control.TextButton({
			label: 'Scroll Down',
			styles: {
				width: (this.width / 3) - 1,
				vOffset: emptySpace.outerHeight + 1
			},
			events: {
				onSelect: function () {
					text1.firstLine += 1;
				}
			}
		}).appendTo(this);

		var button5 = new MAF.control.TextButton({
			label: 'Scroll Up',
			styles: {
				width: this.width / 3,
				hOffset: button4.width + 1,
				vOffset: emptySpace.outerHeight + 1
			},
			textStyles: {
				anchorStyle: 'center'
			},
			events: {
				onSelect: function () {
					text1.firstLine -= 1;
				}
			}
		}).appendTo(this);

		var button6 = new MAF.control.TextButton({
			label: 'Empty',
			styles: {
				width: this.width / 3,
				hOffset: button5.outerWidth + 1,
				vOffset: emptySpace.outerHeight + 1
			},
			textStyles: {
				anchorStyle: 'right'
			},
			events: {
				onSelect: function () {
					text1.data = '';
				}
			}
		}).appendTo(this);

		var keyboard = new MAF.control.Keyboard({
			styles: {
				vOffset: button4.outerHeight + 10
			},
			events: {
				onValueChanged: function (event) {
					text1.data = event.payload.value.replace(/</g,"&lt;").replace(/>/g,"&gt;");
					text1.firstLine = (text1.totalLines - text1.visibleLines);
				}
			}
		}).appendTo(this);

		var button7 = new MAF.control.TextButton({
			label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis turpis vestibulum, rutrum ipsum in, ultricies eros.',
			styles: {
				height: 100,
				vOffset: keyboard.outerHeight + 10
			}
		}).appendTo(this);

		var button8 = new MAF.control.Button({
			styles: {
				vOffset: button7.outerHeight + 1
			},
			events: {
				onSelect: function () {
					log('Button onSelect');
				},
				onFocus: function (event) {
					log('Button onFocus');
					event.preventDefault();
				},
				onBlur: function (event) {
					log('Button onBlur');
					event.preventDefault();
				}
			}
		}).appendTo(this);
	}
});
