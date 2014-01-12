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
 * @class MAF.control.ScrollIndicator
 * @extends MAF.control.Button
 */
define('MAF.control.ScrollIndicator', function () {
	return new MAF.Class({
		ClassName: 'ControlScrollIndicator',

		Extends: MAF.control.Button,

		Protected: {
			dispatchEvents: function (event, payload) {
				switch(event.type) {
					case 'navigate':
						var direction = event.detail && event.detail.direction;
						if (direction === 'up' || direction === 'down') {
							var current = this.getSourceCurrentPage(),
								total = this.getSourcePageCount() - 1;
							if ((direction === 'up' && current === 0) || (direction === 'down' && current === total)) {
								break;
							}
							event.preventDefault();
							return this.shiftSource(event.detail.direction === 'up' ? 'left' : 'right');
						}
						break;
				}
				this.parent(event, payload);
			},
			createContent: function () {
				this.content = new MAF.element.Container({
					ClassName: this.ClassName + 'Scroll',
					styles: {
						visible: false
					}
				}).appendTo(this);
			},
			onSourceUpdated: function (event) {
				return this.update(event.payload);
			}
		},

		config: {
			autoHideWhenEmpty: true,
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

		attachToSource: function (source) {
			if (!source || source === this.source) {
				return this.update();
			}
			this.source = source;
			this.onSourceUpdated.subscribeTo(this.source, 'onStateUpdated', this);
			return this.update();
		},

		getSourceCurrentPage: function () {
			return this.source ? this.source.getCurrentPage() : 1;
		},

		getSourcePageCount: function () {
			return this.source ? this.source.getPageCount() : 1;
		},

		getSourceCarousel: function () {
			return this.source ? this.source.config.carousel : false;
		},

		update: function (state) {
			var currentPage = state && state.currentPage ? state.currentPage : this.getSourceCurrentPage() || 0,
				pageCount = state && state.pageCount ? state.pageCount : this.getSourcePageCount() || 1,
				height = this.height * (1 / pageCount),
				offset = height * currentPage;
			if (this.content.height === height && this.content.retrieve('offset') === offset) {
				return;
			}
			if (this.config.autoDisableWhenEmpty) {
				this.setDisabled(pageCount < 2);
			}
			if (this.config.autoHideWhenEmpty) {
				this.content.visible = !(pageCount < 2);
			}
			this.content.height = height;
			if (this.content.retrieve('offset') !== offset) {
				this.content.store('offset', offset);
				this.content.animate({
					properties: ['top'],
					duration: 0.3,
					top: offset
				});
			}
			if (this.config.focus === false || pageCount === 0) {
				this.element.wantsFocus = false;
			} else if (pageCount > 0) {
				this.element.wantsFocus = true;
			}
			return this;
		},

		shiftSource: function (direction) {
			this.source.shift(direction);
		},

		suicide: function () {
			delete this.source;
			this.parent();
		}
	});
}, {
	ControlScrollIndicator: {
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
			width: '7px',
			height: 'inherit',
			borderRadius: '3px'
		}
	},
	ControlScrollIndicatorScroll: {
		styles: {
			width: 'inherit',
			height: 'inherit',
			backgroundColor: 'rgba(255,255,255,.9)',
			borderRadius: 'inherit'
		}
	}
});
