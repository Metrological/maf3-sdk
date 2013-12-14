/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2013  Metrological
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 **/
define('MAF.system.OptionSelectView', function () {
	return new MAF.Class({
		ClassName: 'OptionSelectView',

		Extends: MAF.system.SidebarView,

		Protected: {
			cancelDialogNeeded: function (cancelType) {
				log('cancelDialogNeeded OptionSelectView');
			},
			onOptionCancelled: function (cancelType) {
				this.unregisterHandlers();
				var packet = {};
				if (this.config.data.guid) {
					packet[this.config.data.guid] = {
						optionSelected: false,
						optionViewId: this.config.id,
						cancelType: cancelType
					};
				}
				MAF.application.previousView(packet);
			}
		},

		config: {
			data: {
				optionGridRows: 1,
				optionGridColumns: 1,
				value: null,
				backLabel: 'Select an Option'
			}
		},

		createView: function () {
			var backbutton = new MAF.control.BackButton({
				label: this.config.data.backLabel,
				events: {
					onSelect: this.cancelOption.bindTo(this)
				}
			}).appendTo(this);

			var pageindicator = new MAF.control.PageIndicator({
				styles: {
					vAlign: 'bottom'
				}
			}).appendTo(this);

			this.elements.grid = new MAF.control.Grid({
				rows:    this.config.data.optionGridRows,
				columns: this.config.data.optionGridColumns,
				styles: {
					width:  this.width,
					height: this.height - backbutton.height - pageindicator.height,
					vOffset: backbutton.height
				},
				cellCreator: this.optionCellCreator, 
				cellUpdater: this.optionCellUpdater
			}).attachAccessory(pageindicator).appendTo(this);
		},

		updateView: function () {
			this.registerHandlers();
			this.elements.grid.changeDataset(this.config.data.options);
		},

		submitOption: function (option) {
			this.unregisterHandlers();
			var packet = {};
			if (this.config.data.guid) {
				packet[this.config.data.guid] = {
					optionSelected: true,
					option: option,
					optionViewId: this.config.viewId
				};
			}
			MAF.application.previousView(packet);
		},

		cancelOption: function (event) {
			event.preventDefault();
			if (this.config.data.cancelDialog) {
				this.cancelDialogNeeded(event.type);
			} else {
				this.onOptionCancelled(event.type);
			}
		},

		registerHandlers: function () {
			this.cancel = this.cancelOption.bindTo(this);
			this.cancel.subscribeTo(MAF.application, ['onActivateBackButton','onActivateSettingsButton','onActivateHomeButton']);
		},

		unregisterHandlers: function () {
			this.cancel.unsubscribeFrom(MAF.application, ['onActivateBackButton','onActivateSettingsButton','onActivateHomeButton']);
			delete this.cancel;
		},

		optionCellCreator: function () {
			var cell = new MAF.control.GridCell({
				styles: this.getCellDimensions(),
				events: {
					onSelect: function (){
						var option = this.getCellDataItem();
						this.grid.owner.submitOption(option);
					}
				}
			});

			cell.content = new MAF.element.Text({
				ClassName: 'ControlOptionSelectCellText',
				styles: {
					width: cell.width - 10,
					height: cell.height
				}
			}).appendTo(cell);

			return cell;
		},

		optionCellUpdater: function (cell, data) {
			cell.content.setText(data.label);
		}
	});
}, {
	ControlOptionSelectCellText: {
		styles: {
			width: '100%',
			height: 'inherit',
			//wrap: true,  			With this it doesn't center anymore
			//truncation: 'end',	With this the innerText gets a max-width of 1px
			paddingLeft: 10,
			paddingRight: 10,
			anchorStyle: 'leftCenter'
		}
	}
});
