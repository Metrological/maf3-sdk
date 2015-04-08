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
 * @class MAF.control.PageIndicator
 * @classdesc This is a component that can be attached to a grid to indicate how many data items are in the grid.
 * @extends MAF.control.Button
 */
define('MAF.control.PageIndicator', function () {
	return new MAF.Class({
		ClassName: 'ControlPageIndicator',

		Extends: MAF.control.Button,

		Protected: {
			dispatchEvents: function (event, payload) {
				switch(event.type) {
					case 'navigate':
						if (event.detail && event.detail.direction) {
							if (event.detail.direction === 'left' || event.detail.direction === 'right') {
								event.preventDefault();
								return this.shiftSource(event.detail.direction);
							}
						}
						break;
				}
				this.parent(event, payload);
			},
			createContent: function () {
				this.content = new MAF.element.Text({
					ClassName: this.ClassName + 'TextLink'
				}).appendTo(this);
			},
			buildDots: function (curpage, pagecount, state) {
				if (this.config.updateDots && this.config.updateDots.call) {
					return this.config.updateDots.call(this, curpage, pagecount, state);
				} else {
					var dots = '';
					for (var i = 0; i < pagecount; i++) {
						dots += FontAwesome.get(curpage === i ? 'circle-o' : 'circle') + ' ';
					}
					return dots.trim();
				}
			},
			buildText: function (curpage, pagecount, state) {
				if (this.config.updateText && this.config.updateText.call) {
					return this.config.updateText.call(this, curpage, pagecount, state);
				} else {
					return FontAwesome.get('caret-left') + ' ' + widget.getLocalizedString('PAGE', [parseInt(curpage, 10) + 1, pagecount]) + ' ' + FontAwesome.get('caret-right');
				}
			},
			onSourceUpdated: function (event) {
				return this.update(event.payload);
			}
		},

		config: {
			threshold: 0,
			arrowPadding: 6,
			imageSources: null,
			autoDisableWhenEmpty: true
		},

		initialize: function () {
			this.parent();
			var source = this.config.sourceElement || this.config.source;
			if (source) {
				this.attachToSource(source);
			}
			this.config.source = null;
			delete this.config.source;
			this.config.sourceElement = null;
			delete this.config.sourceElement;
		},

		/**
		 * Attach this to a source to listen to state update events.
		 * @method MAF.control.PageIndicator#attachToSource
		 */
		attachToSource: function (source) {
			if (!source || source === this.source) {
				return this.update();
			}
			this.source = source;
			this.onSourceUpdated.subscribeTo(this.source, 'onStateUpdated', this);
			return this.update();
		},

		/**
		 * What is the currently active page in the attached component.
		 * @method MAF.control.PageIndicator#getSourceCurrentPage
		 * @return {Number} Active page.
		 */
		getSourceCurrentPage: function () {
			return this.source ? this.source.getCurrentPage() : 1;
		},

		/**
		 * How many pages are in the attached component.
		 * @method MAF.control.PageIndicator#getSourcePageCount
		 * @return {Number} Number of pages.
		 */
		getSourcePageCount: function () {
			return this.source ? this.source.getPageCount() : 1;
		},

		/**
		 * Check if the attached component is configured to act like a carousel.
		 * @method MAF.control.PageIndicator#getSourceCarousel
		 * @return {Boolean} True if source is acting like a carousel.
		 */
		getSourceCarousel: function () {
			return this.source ? this.source.config.carousel : false;
		},

		update: function (state) {
			var currentPage = state && state.currentPage ? state.currentPage : this.getSourceCurrentPage() || 0,
				pageCount = state && state.pageCount ? state.pageCount : this.getSourcePageCount() || 1,
				useDots = pageCount < (parseInt(this.config.threshold, 10) || 0),
				build = useDots ? this.buildDots : this.buildText;

			this.content.setText(build.call(this, currentPage, pageCount, state));

			if (useDots) {
				this.content.setStyle('fontSize', '66%');
			} else {
				this.content.setStyle('fontSize', null);
			} 

			if (this.config.focus === false || pageCount === 0) {
				this.element.wantsFocus = false;
			} else if (pageCount > 0) {
				this.element.wantsFocus = true;
			}

			if (this.config.autoDisableWhenEmpty) {
				this.setDisabled((pageCount < 2));
			}

			return this;
		},

		/**
		 * Change the page the attached component is on.
		 * @method MAF.control.PageIndicator#shiftSource
		 * @param {String} direction Which direction to change the page to. See for example {@link MAF.element.Grid#shift}
		 */
		shiftSource: function (direction) {
			this.source.shift(direction);
		},

		suicide: function () {
			delete this.source;
			this.parent();
		}
	});
}, {
	ControlPageIndicator: {
		renderSkin: function (state, w, h, args, theme) {
			var ff = new Frame();
			theme.applyLayer('BaseGlow', ff);
			if (state === 'focused') {
				theme.applyLayer('BaseFocus', ff);
			}
			theme.applyLayer('BaseHighlight', ff);
			return ff;
		},
		styles: {
			width: 'inherit',
			height: '38px'
		}
	},
	ControlPageIndicatorTextLink: {
		styles: {
			width: 'inherit',
			height: 'inherit',
			anchorStyle: 'center'
		}
	}
});
