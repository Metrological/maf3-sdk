/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2014  Metrological
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
/** 
 * @class MAF.views.AboutDocView
 * @classdesc > <p>This is view already configured with a BackButton, TextGrid and a PageIndicator.</p>
 * MAF.views.AboutBox uses this view class for viewing its pages config options.
 * * this.controls.backButton - contains a MAF.control.BackButton
 * * this.elements.textGrid - contains a MAF.element.TextGrid
 * * this.controls.pageIndicator -  contains a MAF.control.PageIndicator
 * @extends MAF.system.SidebarView
 */
define('MAF.views.AboutDocView', function () {
	return new MAF.Class({
		ClassName: 'AboutDocView',
		Extends: MAF.system.SidebarView,

		config: {
			data: {
				backLabel: 'Back',
				value: ''
			}
		},

		createView: function () {
			this.controls.backButton = new MAF.control.BackButton({
				guid: this._classID + '.BackButton',
				label: this.config.data.backLabel
			}).appendTo(this);

			this.controls.pageIndicator = new MAF.control.PageIndicator({
				guid: this._classID + '.PageIndicator',
				styles: {
					width: this.width,
					vAlign: 'bottom'
				}
			}).appendTo(this);

			var margin = Theme.getStyles('AboutDocViewTextGrid', 'margin');
			this.elements.textGrid = new MAF.element.TextGrid({
				ClassName: 'AboutDocViewTextGrid',
				styles: {
					width: this.width - (margin * 2),
					height: this.height - (this.controls.pageIndicator.height + this.controls.backButton.height) - (margin * 2),
					vOffset: this.controls.backButton.outerHeight,
					anchorStyle: 'justify'
				}
			}).appendTo(this).attachAccessories(this.controls.pageIndicator);
		},

		updateView: function () {
			this.elements.textGrid.setText(this.config.data.value);
		}
	});
}, {
	AboutDocViewTextGrid: {
		styles: {
			fontSize: 22,
			color: '#FFFFFF',
			margin: 7,
			wrap: true
		}
	}
});
