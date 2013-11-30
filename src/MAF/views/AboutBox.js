define('MAF.views.AboutBox', function () {
	return new MAF.Class({
		ClassName: 'AboutBoxView',

		Extends: MAF.system.SidebarView,

		config: {
			BackButtonTitle: 'ABOUT'
		},

		createView: function () {
			var providedPages = ['copyright', 'tos', 'privacy'];
			var buttonHeight = parseInt(Theme.getStyles('ControlTextButton', 'normal').height, 10) || 51;
			
			var backButton = new MAF.control.BackButton({
				label: widget.getLocalizedString(this.config.BackButtonTitle),
				backParams: this.viewBackParams || {},
				events: {
					onSelect: function (event) {
						if (!this.getView().fire('onBackButtonSelect', event)){
							event.preventDefault();
						}
					}
				}
			}).appendTo(this);

			var list = [];

			if (profile.countryCode === 'de') { 
				if (!this.config.pages) {
					this.config.pages = [];
				}
				var impressum = this.config.pages.filter(function (page) {
					return page.id === 'impressum';
				});
				if (impressum.length === 0) {
					this.config.pages.push({
						id: 'impressum',
						name: widget.getLocalizedString('IMPRESSUM'),
						srcString: filesystem.readFile('About/' + profile.locale + '/impressum.txt', true)
					});
				}
			}

			if (typeOf(this.config.pages) === 'array') {
				this.config.pages.forEach(function (page) {
					if (providedPages.indexOf(page.id) > -1) {
						if (!('srcString' in page)) {
							try {
								page.srcString = filesystem.readFile('About/' + widget.locale + '/' + page.id + '.txt', true);
							} catch (e) {
								page.srcString = '';
							}
						}
						list.splice(0, 0, page);
					} else {
						list.push(page);
					}
				});
				list.length = (list.length > 5) ? 5 : list.length;
			} else {
				this.config.pages = [];
			}

			var menuHeight = buttonHeight * list.length;
			var contentHeight = this.height - (menuHeight + backButton.height);

			var contentContainer = new MAF.element.Container({
				styles: {
					width: this.width,
					height: contentHeight,
					vOffset: backButton.height
				}
			}).appendTo(this);
			
			var metadataName = new MAF.element.Text({
				ClassName: 'AboutBoxViewMetadataName',
				label: widget.getLocalizedString(widget.name),
				styles: {
					fontSize: Theme.getStyles('AboutBoxViewMetadataName', 'fontSize')
				}
			}).appendTo(contentContainer);

			var metadataDescription = new MAF.element.Text({
				ClassName: 'AboutBoxViewMetadataDescription',
				label: widget.getLocalizedString(widget.description),
				visibleLines: 1,
				styles: {
					fontSize: Theme.getStyles('AboutBoxViewMetadataDescription', 'fontSize'),
					vOffset: metadataName.outerHeight
				}
			}).appendTo(contentContainer);

			var PAD = Theme.get('AboutBoxViewMetadataAuthorNote', 'PAD_TOP');

			var metadataAuthorNote = new MAF.element.Text({
				ClassName: 'AboutBoxViewMetadataAuthorNote',
				label: widget.getLocalizedString('WIDGET_BY') + '...',
				visibleLines: 1,
				styles: {
					fontSize: Theme.getStyles('AboutBoxViewMetadataAuthorNote', 'fontSize'),
					vOffset: metadataDescription.outerHeight + PAD
				}
			}).appendTo(contentContainer);

			var metadataAuthor = new MAF.element.Text({
				ClassName: 'AboutBoxViewMetadataAuthor',
				label: ((!widget.author) || widget.author.length === 0 || (widget.author === widget.company) ? (widget.company || '') : widget.author + ', ' + (widget.company || '')),
				visibleLines: 1,
				styles: {
					fontSize: Theme.getStyles('AboutBoxViewMetadataAuthor', 'fontSize'),
					vOffset: metadataAuthorNote.outerHeight
				}
			}).appendTo(contentContainer);

			var metadataVersion = new MAF.element.Text({
				ClassName: 'AboutBoxViewMetadataVersion',
				label: widget.version,
				visibleLines: 1,
				styles: {
					fontSize: Theme.getStyles('AboutBoxViewMetadataVersion', 'fontSize'),
					vOffset: metadataAuthor.outerHeight
				}
			}).appendTo(contentContainer);

			if (widget.authorURL || widget.url) {
				PAD = Theme.get('AboutBoxViewMetadataUrlNote', 'PAD_TOP');

				var metadataUrlNote = new MAF.element.Text({
					ClassName: 'AboutBoxViewMetadataUrlNote',
					label: widget.getLocalizedString('MORE_INFO') + '...',
					visibleLines: 1,
					styles: {
						fontSize: Theme.getStyles('AboutBoxViewMetadataUrlNote', 'fontSize'),
						vOffset: metadataVersion.outerHeight + PAD
					}
				}).appendTo(contentContainer);

				var metadataUrl = new MAF.element.Text({
					ClassName: 'AboutBoxViewMetadataUrl',
					label: widget.authorURL || widget.url,
					visibleLines: 1,
					styles: {
						fontSize: Theme.getStyles('AboutBoxViewMetadataUrl', 'fontSize'),
						vOffset: metadataUrlNote.outerHeight
					}
				}).appendTo(contentContainer);
			}

			PAD = Theme.get('AboutBoxViewMetadataCopyright', 'PAD_BOTTOM');

			var metadataCopyright = new MAF.element.Text({
				ClassName: 'AboutBoxViewMetadataCopyright',
				label: widget.getLocalizedString('COPYRIGHT', (new Date()).getFullYear()) + ' ' + widget.copyright,
				visibleLines: 1,
				styles: {
					fontSize: Theme.getStyles('AboutBoxViewMetadataCopyright', 'fontSize'),
					vOffset: contentContainer.height - PAD
				}
			}).appendTo(contentContainer);

			PAD = Theme.get('AboutBoxViewMetadataReserved', 'PAD_BOTTOM');

			var metadataReserved = new MAF.element.Text({
				ClassName: 'AboutBoxViewMetadataReserved',
				label: widget.getLocalizedString('RIGHTS_RESERVED'),
				visibleLines: 1,
				styles: {
					fontSize: Theme.getStyles('AboutBoxViewMetadataReserved', 'fontSize'),
					vOffset: contentContainer.height - PAD
				}
			}).appendTo(contentContainer);

			// Pages
			if (list.length) {
				var button = null;
				var buttonContainer = new MAF.element.Core({
					styles: {
						width: this.width,
						height: (buttonHeight * list.length),
						vAlign: 'bottom'
					}
				}).appendTo(this);

				list.forEach(function (page) {
					if (page instanceof MAF.element.Button) {
						button = page;
					} else {
						button = new MAF.control.TextButton({
							label: page.name,
							value: page.srcString,
							styles: {
								vOffset: button ? button.outerHeight : 0
							},
							events: {
								onSelect: function () {
									var viewConfig = {
										id: this._classID + 'AboutDocView',
										data: {
											backLabel: this.config.label,
											value: this.config.value
										},
										viewClass: MAF.system.AboutDocView
									};
									MAF.application.addViewConfig(viewConfig);
									MAF.application.loadView(viewConfig.id, {
										documentText: this.config.value
									});
								}
							}
						});
					}
					button.appendTo(buttonContainer);
				});
			}
		}
	});
}, {
	AboutBoxView: 'SidebarView',
	AboutBoxViewMetadataName: {
		styles: {
			width: '100%',
			paddingLeft: 5,
			paddingRight: 5,
			truncation: 'end',
			vOffset: 67,
			fontSize: 32
		}
	},
	AboutBoxViewMetadataDescription: {
		styles: {
			width: '100%',
			paddingLeft: 5,
			paddingRight: 5,
			truncation: 'end',
			fontSize: 18,
			fontWeight: 'bold'
		}
	},
	AboutBoxViewMetadataAuthorNote: {
		'PAD_TOP': 20,
		styles: {
			hOffset: 5,
			fontSize: 23
		}
	},
	AboutBoxViewMetadataAuthor: {
		styles: {
			hOffset: 5,
			fontSize: 23
		}
	},
	AboutBoxViewMetadataVersion: {
		styles: {
			hOffset: 5,
			fontSize: 23
		}
	},
	AboutBoxViewMetadataUrlNote: {
		'PAD_TOP': 20,
		styles: {
			hOffset: 5,
			fontSize: 18
		}
	},
	AboutBoxViewMetadataUrl: {
		styles: {
			hOffset: 5,
			fontSize: 18
		}
	},
	AboutBoxViewMetadataCopyright: {
		'PAD_BOTTOM': 40,
		styles: {
			hOffset: 5,
			fontSize: 15
		}
	},
	AboutBoxViewMetadataReserved: {
		PAD_BOTTOM: 20,
		styles: {
			hOffset: 5,
			fontSize: 15
		}
	}
});
