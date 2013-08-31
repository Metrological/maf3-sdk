var TestView1 = new MAF.Class({
	ClassName: 'TestView1',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		//log(MAF.Browser);
		this.parent();
		this.registerMessageCenterListenerCallback(this.dataHasChanged);
	},

	dataHasChanged: function (event) {
		if (!this.frozen && event.payload.key === 'dataSet' && event.payload.value) {
			this.elements.grid1.changeDataset(event.payload.value);
			this.elements.tab2.setValue('3');
		}
	},

	createView: function () {
		var button1 = new MAF.control.TextButton({
			label: 'Load View 2',
			events: {
				onSelect: function () {
					MAF.application.loadView('view-TestView2');
				}
			}
		}).appendTo(this);

		button1.rotate = 2;

		var button2 = new MAF.control.TextButton({
			label: 'Set Tabs',
			styles: {
				vOffset: button1.outerHeight + 1
			},
			events: {
				onSelect: function () {
					this.owner.elements.tab1.initTabs([{
						label: 'Show demo type',
						value: '1',
						src: 'Images/tv.png'
					},{
						label: 'Show prod type',
						value: '2'
					},{
						label: 'Show all',
						value: '3',
						src: 'Images/tv.png'
					},{
						label: 'Tab 4',
						value: '4'
					},{
						label: 'Longer Tab button 5',
						value: '6',
						src: 'Images/tv.png'
					},{
						label: 'Longer Tab button 5',
						value: '7'
					},{
						label: 'Longer Tab button 5',
						value: '8'
					},{
						label: 'Tab 4',
						value: '9',
						src: 'Images/tv.png'
					},{
						label: 'Longer Tab button 5',
						value: '10'
					},{
						label: 'Tab 4',
						value: '11'
					}]);
				}
			}
		}).appendTo(this);

		var button3 = new MAF.control.TextButton({
			label: 'Reset Tabs',
			styles: {
				vOffset: button2.outerHeight + 1
			},
			events: {
				onSelect: function () {
					this.owner.elements.tab1.initTabs([]);
				}
			}
		}).appendTo(this);

		this.elements.tab1 = new MAF.control.TabPipe({
			defaultTab: 3,
			styles: {
				vOffset: button3.outerHeight + 1
			},
			events: {
				onTabSelect: function (event) {
					var view = this.getView();
					var grid = view.elements.grid1;
					switch (event.payload.index) {
						case 0:
							grid.setFilter(function (value,key) {
								if (value.type === 'demo')
									return value;
							});
							break;
						case 1:
							grid.setFilter(function (value,key) {
								if (value.type === 'prod')
									return value;
							});
							break;
						case 2:
							grid.setFilter(function (value,key) {
								if (value.type !== 'all')
									return value;
							});
							break;
					}
					grid.focus();
				}
			}
		}).appendTo(this);

		this.elements.tab2 = new MAF.control.FixedTab({
			options: [{
				label: 'Show demo type',
				value: 1
			},{
				label: 'Show prod type',
				value: 2
			},{
				label: 'Show all',
				value: 3
			}],
			styles: {
				vOffset: this.elements.tab1.outerHeight + 1
			},
			textStyles: {
				fontSize: 18,
				fontWeight: 'bold'
			},
			events: {
				onTabChanged: function (event) {
					var view = this.getView();
					var grid = view.elements.grid1;
					switch (event.payload.index) {
						case 0:
							grid.setFilter(function (value,key) {
								if (value.type === 'demo')
									return value;
							});
							break;
						case 1:
							grid.setFilter(function (value,key) {
								if (value.type === 'prod')
									return value;
							});
							break;
						case 2:
							grid.setFilter(function (value,key) {
								if (value.type !== 'all')
									return value;
							});
							break;
					}
					//grid.focus();
				}
			}
		}).appendTo(this);

		var metaData = new MAF.control.MetadataDisplay({
			updateMethod: function (data) {
				this.setText('Metadata grid: ' + data.text);
			},
			styles: {
				vOffset: this.elements.tab2.outerHeight
			}
		}).appendTo(this);

		var pageindicator = new MAF.control.PageIndicator({
			threshold: 7,
			styles: {
				vOffset: this.height - 38
			}
		}).appendTo(this);

		this.elements.grid1 = new MAF.element.Grid({
			rows: 2,
			columns: 2,
			carousel: true,
			cellCreator: function () {
				var cell = new MAF.element.GridCell({
					styles: this.getCellDimensions(),
					events: {
						onSelect: function (event) {
							new MAF.dialogs.Alert({
								title: (event.payload && event.payload.dataItem) ? event.payload.dataItem.text.capitalize() : 'Cell ' + this.getCellIndex(),
								message: 'You have selected a cell in this grid.',
								buttons: [
									{ label: 'Close', callback: this.dialogCallback },
									{ label: 'Continues', callback: this.dialogCallback }
								],
								focusOnCompletion: this.grid
							}).show();
						},
						onFocus: function () {
							this.setStyle('backgroundColor', Theme.getStyles('BaseFocus', 'backgroundColor'));
							var coords = this.getCellCoordinates(),
								origin;
							if (coords.column === 0) {
								origin = 'left '
							} else if (coords.column === (coords.columns - 1)) {
								origin = 'right '
							} else {
								origin = 'center '
							}
							if (coords.row === 0) {
								origin += 'top '
							} else if (coords.row === (coords.rows - 1)) {
								origin += 'bottom '
							} else {
								origin += 'center '
							}
							this.setStyles({
								transform: Browser.firefox ? 'scale(1.1)' : (new CSSMatrix()).scale(1.1),
								transformOrigin: origin,
								zOrder: 999,
							});
						},
						onBlur: function () {
							this.setStyle('backgroundColor', null);
							this.setStyles({
								transform: null,
								transformOrigin: null,
								zOrder: null
							});
						}
					}
				});

				cell.setStyles({
					backgroundRepeat: 'no-repeat',
					backgroundImage: 'Images/tv.png',
					backgroundPosition: 'center'
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
				cell.text.setText(data.text);
				switch (data.type) {
					case 'demo':
						cell.text.setStyle('backgroundColor', Theme.getStyles('BaseGlow', 'backgroundColor'));
						break;
					case 'prod':
						cell.text.setStyle('backgroundColor', Theme.getStyles('BaseActive', 'backgroundColor'));
						break;
				}
			},
			styles: {
				width: this.width,
				height: this.height - metaData.outerHeight - pageindicator.height,
				vOffset: metaData.outerHeight
			},
			events: {
				onBroadcast: function (event) {
//					log('onBroadcast', event);
				}
			}
		}).appendTo(this);

		pageindicator.attachToSource(this.elements.grid1);
		metaData.attachToSource(this.elements.grid1);
	},

	dialogCallback: function (event) {
		log('dialogCallback', event);
	},

	updateView: function () {
		this.elements.tab1.initTabs([{
			label: 'Show demo type',
			value: '1'
		},{
			label: 'Show prod type',
			value: '2'
		},{
			label: 'Show all',
			value: '3'
		}]);
		getPagingData({}, true);
	}
});
