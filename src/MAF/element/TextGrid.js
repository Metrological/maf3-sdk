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
 * @class MAF.element.TextGrid
 * @extends MAF.element.Text
 * @classdesc > Provides paging functionality on very long text through the use of a page or scroll indicator.
 * @example createView: function () {
 *    this.controls.scrollIndication = new MAF.control.ScrollIndicator({
 *       styles: {
 *          width: 20,
 *          height: this.height,
 *          hAlign: 'right'
 *       }
 *    }).appendTo(this);
 *
 *    this.controls.textGrid = new MAF.element.TextGrid({
 *       styles: {
 *          width: this.width - this.controls.scrollIndication.width,
 *          height: this.height
 *       }
 *    }).appendTo(this).attachAccessories(this.controls.scrollIndication);
 * }
 */
/**
 * @cfg {Boolean} carousel Defines if the grid needs to behave like a carousel. True will show the first view again after the last view has passed. Default false.
 * @memberof MAF.element.TextGrid
 */

/**
 * @cfg {Integer} scrolling Enables you to scroll through the page line by line instead of paging.
 * @memberof MAF.element.TextGrid
 */

define('MAF.element.TextGrid', function () {
	return new MAF.Class({
		ClassName: 'BaseTextGrid',

		Extends: MAF.element.Text,

		Protected: {
			dispatchEvents: function (event, payload) {
				if (event.type === 'layoutchange') {
					this.fire('onStateUpdated', {
						currentPage: this.getCurrentPage(),
						pageCount: this.getPageCount()
					}, event);
				}
				this.parent(event, payload);
			}
		},

		initialize: function () {
			this.parent();
			this.element.allowChangeEvents = true;
			this.element.textPaging = true;
			this.currentPage = 0;
		},

		/**
		 * @method MAF.element.TextGrid#getCurrentPage
		 * @return {Number} The page the component is currently on. Pages start at 0.
		 */
		getCurrentPage: function () {
			return this.currentPage;
		},

		/**
		 * @method MAF.element.TextGrid#getPageCount
		 * @return {Number} The number of pages this component has.
		 */
		getPageCount: function () {
			if (!this.totalLines){
				return 1;
			}
			
			var linesPerPage = this.height / this.lineHeight;
			var pages = (this.totalLines - 1) / (linesPerPage - 1);
			var lastPagePercentage = pages - Math.floor(pages);
			var percentageLastLine = ((this.height * lastPagePercentage) > this.lineHeight ? (this.height * lastPagePercentage) - this.lineHeight : (this.height * lastPagePercentage)) / this.lineHeight;
			var returnPages = Math.ceil(pages);
			
			if (this.config.scrolling){
				returnPages = Math.ceil(this.totalLines - (linesPerPage - 1));
			} else if (percentageLastLine > 0 && percentageLastLine <= 0.2){
				returnPages--;
			}
			return returnPages || 1;
		},

		/**
		 * @method MAF.element.TextGrid#getStartLine
		 * @param {Number} pagenum Pagenumber
		 * @return {Number} The first line of the page supplied by pagenum.
		 */
		getStartLine: function (pagenum) {
			return pagenum * this.visibleLines;
		},

		/**
		 * @method MAF.element.TextGrid#shift
		 * @param {String} direction A direction the page will change to. (left,right)
		 * @return {Class} This component.
		 */
		shift: function (direction) {
			var current = this.currentPage,
				pages = this.getPageCount(),
				target;
			
			if(!this.config.scrolling){
				this.element.lastChild.height = this.element.height*pages;
			}

			switch (direction) {
				case 'left':
					target = Math.max(current - 1, 0);
					break;
				case 'right':
					target = Math.min(current + 1, pages - 1);
					break;
			}

			var scrollTop = (this.element.lastChild.height/pages) * target;
			this.element.scrollTop = this.config.scrolling ? scrollTop : scrollTop - (this.element.lastChild.lineHeight*target);
			this.currentPage = target;

			return this;
		},

		/**
		 * This will take a single component and attach it to this component. This will trigger events to the class.
		 * @method MAF.element.TextGrid#attachAccessory
		 * @param {Class} accessory Class which is able to attach to a source component.
		 * @return {Class} This component.
		 */
		attachAccessory: function (accessory) {
			if (accessory && accessory.attachToSource) {
				accessory.attachToSource(this);
			}
			return this;
		},

		/**
		 * This will take a array of components and will attach them to this component using the attachAccessory method.
		 * @method MAF.element.TextGrid#attachAccessories
		 * @param {Array} arguments Array with classes able to attach to a source component.
		 * @return {Class} This component.
		 */
		attachAccessories: function () {
			Array.slice(arguments).forEach(this.attachAccessory, this);
			return this;
		},

		/**
		 * Set which text to display on this component.
		 * @method MAF.element.TextGrid#setText
		 * @param {String} text The text
		 */
		setText: function (text) {
			this.firstLine = 0;
			this.currentPage = 0;
			this.parent(text);
		}
	});
});
