define('MAF.control.PageIndicator', function () {
	return new MAF.Class({
		ClassName: 'ControlPageIndicator',

		Extends: MAF.control.Button,

		Protected: {
			dispatcher: function (event, payload) {
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
				var tk = this.ClassName + 'TextLink',
					ts = Theme.getStyles(tk),
					ss = this.config.imageSources;

				this.text = new MAF.element.Text({
					ClassName: this.ClassName + 'TextLink'
				}).freeze().appendTo(this);

				this.arrows = {
					left: new MAF.element.Image({
						ClassName: this.ClassName + 'Arrowleft',
						src: ss['<'],
						styles: {
							height: 1,
							vAlign: 'center',
							vOffset: -8,
							opacity: 0
						}
					}).appendTo(this),
					right: new MAF.element.Image({
						ClassName: this.ClassName + 'Arrowright',
						src: ss['>'],
						styles: {
							height: 1,
							vAlign: 'center',
							vOffset: -8,
							opacity: 0
						}
					}).appendTo(this)
				};
			},
			buildDots: function (curpage, pagecount, state) {
				var dots = '';
				for (var i = 0; i < pagecount; i++) {
					if (curpage === i) {
						dots += '&#9675; ';
					} else {
						dots += '&#9679; ';
					}
				}
				return dots;
			},
			buildText: function (curpage, pagecount, state) {
				if (this.config.updateText && this.config.updateText.call) {
					return this.config.updateText(curpage, pagecount, state);
				} else {
					return widget.getLocalizedString('PAGE', [parseInt(curpage, 10) + 1, pagecount]);
				}
			},
			updateArrows: function (curpage, pagecount) {
				var on  = {opacity: null},
					off = {opacity: 0.3},
					carousel = this.getSourceCarousel(),
					left  = this.arrows.left,
					right = this.arrows.right;
				if (pagecount === 1) {
					left.setStyles(off);
					right.setStyles(off);
				} else if (carousel) {
					left.setStyles(on);
					right.setStyles(on);
				} else {
					left.setStyles( curpage ? on : off );
					right.setStyles( curpage + 1 < pagecount ? on : off );
				}
				this.alignArrows();
			},
			alignArrows: function () {
				var ts = this.text.element.getTextBounds(),
					tw = ts.width,
					pw = this.width,
					ap = this.config.arrowPadding,
					al = this.arrows.left,
					ar = this.arrows.right;
				al.hOffset = pw / 2 - tw / 2 - al.width - ap;
				ar.hOffset = al.width + al.hOffset + tw + ap * 2;
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
			if (!this.config.imageSources) {
				this.config.imageSources = Theme.storage.get('ControlPageIndicator', 'sources');
			}
			var source = this.config.sourceElement || this.config.source;
			if (source) this.attachToSource(source);

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
			if (state && (state.pageChanging === false || state.currentPage === undefined)) {
				return this;
			}
			var currentPage = state && state.currentPage ? state.currentPage : this.getSourceCurrentPage() || 0,
				pageCount = state && state.pageCount ? state.pageCount : this.getSourcePageCount() || 1,
				useDots = pageCount < (parseInt(this.config.threshold, 10) || 0),
				build = useDots ? this.buildDots : this.buildText;

			if (this.text) {
				this.text.setText(build.call(this, currentPage, pageCount, state));
			}

			if (useDots) {
				this.element.wantsFocus = false;
				this.arrows.left.freeze();
				this.arrows.right.freeze();
			} else if (pageCount > 0) {
				this.element.wantsFocus = true;
				this.text.thaw();
				this.arrows.left.thaw();
				this.arrows.right.thaw();
			}

			this.updateArrows(currentPage, pageCount);

			if (this.config.focus === false) {
				this.element.wantsFocus = false;
			}

			if (this.config.autoDisableWhenEmpty) {
				this.setDisabled((pageCount < 2));
			}

			return this;
		},

		shiftSource: function (direction) {
			this.source.shift(direction);
		},

		suicide: function () {
			delete this.previousPage;
			delete this.source;
			this.text.suicide();
			delete this.text;
			Object.forEach(this.arrows, function (key, obj) {
				delete this.arrows[key];
				obj.suicide();
			}, this);
			delete this.arrows;
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
		},
		sources: {
			'<': Image.WHITE,
			'>': Image.WHITE
		}
	},
	ControlPageIndicatorTextLink: {
		styles: {
			width: 'inherit',
			height: 'inherit',
			anchorStyle: 'center'
		}
	},
	ControlPageIndicatorArrowleft: {
		styles: {
			marginLeft: '-12px',
			borderTop: '8px solid transparent',
			borderBottom: '8px solid transparent',
			borderRight: '8px solid white'
		}
	},
	ControlPageIndicatorArrowRight: {
		styles: {
			marginLeft: '2px',
			borderTop: '8px solid transparent',
			borderBottom: '8px solid transparent',
			borderLeft: '8px solid white'
		}
	}
});
