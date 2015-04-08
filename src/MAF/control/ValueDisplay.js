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
 * @class MAF.control.ValueDisplay
 * @extends MAF.element.Core
 */
define('MAF.control.ValueDisplay', function () {
	return new MAF.Class({
		ClassName: 'ControlValueDisplay',

		Extends: MAF.element.Core,

		Protected: {
			onSourceUpdated: function () {
				var value = this.getSourceDisplayValue();
				this.updateContent(value);
			},
//@TODO still required?
/*
			adjustContent: function () {
				this.content.setStyle('width', this.width);
				this.buffer.setStyle('width', this.width);
			},
*/
			updateContent: function (value, options) {
				options = options || {};
				
				if (!this.config.animate || options.transition=='none') {
					this.content.data = value;
					return;
				}
				
				this.content.freeze();
				this.content.appendTo(this.buffer);	
				this.buffer.freeze();
				this.content.hide();
				this.content.thaw();
				this.content.appendTo(this);
				this.content.data = value;
				
				var acfg = this.config.animation,
					anims = [],
					a = (function (keys){
						var out = {};
						keys.forEach(function(k){
							out[k] = k in options ? options[k] : acfg[k]; 
						});
						return out;
					})(['duration','fade','slide','direction','ease']),
					w    = this.width,
					h    = this.height,
					cont = this.content.element,
					buff = this.buffer.element,
					done = this.contentUpdated.bindTo(this);
				
				if (!a.slide && !a.fade) {
					return done();
				}
				
				if (a.fade) {
					anims.push(new FadeAnimation(cont, 255, a.duration, a.ease));
					anims.push(new FadeAnimation(buff, 0, a.duration, a.ease));
				}
				
				if (a.slide) {
					switch (a.direction) {
					case 'left':
						cont.hOffset = w;
						anims.push(new MoveAnimation(buff, 0 - w, 0, a.duration, a.ease));
						break;
					case 'right':
						cont.hOffset = 0 - w;
						anims.push(new MoveAnimation(buff, w, 0, a.duration, a.ease));
						break;
					case 'up':
						cont.vOffset = h;
						anims.push(new MoveAnimation(buff, 0, 0 - h, a.duration, a.ease));
						break;
					case 'down':
						cont.vOffset = 0 - h;
						anims.push(new MoveAnimation(buff, 0, h, a.duration, a.ease));
						break;
					}
					anims.push(new MoveAnimation(cont, 0, 0, a.duration, a.ease, done));
				}
				this.content.show();
				//animator.start(anims);
			},

			contentUpdated: function () {
				this.content.show();
				
				this.buffer.hide();
				
				this.buffer.setStyles({
					hOffset: 0,
					vOffset: 0,
					opacity: 255
				});
				
				this.buffer.thaw();

				this.buffer.show();
			}
		},

		config: {
			eventTypes: ['onValueChanged','onValueInitialized'],
			//animate: MAF.config.animationEnabled,
			sourceElement: null,
			source: null,
			animation: {
				duration:  250,
				fade:      true,
				slide:     true,
				direction: 'left',
				ease:      0//animator.kEaseInOut
			}
		},

		initialize: function () {
			this.parent();
			this.createContent();

			var source = this.config.sourceElement || this.config.source;
			if (source) {
				this.attachToSource(source);
			}
			
			this.config.source = null;
			delete this.config.source;
			this.config.sourceElement = null;
			delete this.config.sourceElement;
		},

		getSourceDisplayValue: function () {
			return this.source ? this.source.getDisplayValue() : '';
		},

		createContent: function () {
			this.content = new MAF.element.Text({
				ClassName: 'ControlValueContainerText',
				label: '...'
			}).appendTo(this);
			
			this.buffer = new MAF.element.Core().appendTo(this);
		},

		attachToSource: function (source) {
			var value = null;
			if (!source || this.source === source) {
				value = this.getSourceDisplayValue();
				return this.updateContent(value, {transition:'none'});
			}
			this.source = source;
			this.onSourceUpdated.subscribeTo(this.source, this.config.eventTypes, this);
			value = this.getSourceDisplayValue();
			this.updateContent(value, {transition:'none'});
		},

		suicide: function () {
			this.content.suicide();
			delete this.content;
			this.buffer.suicide();
			delete this.buffer;
			delete this.source;
			this.parent();
		}
	});
}, {
	ControlValueContainerText: {
		styles: {
			width: '100%',
			height: 'inherit',
			paddingLeft: 10,
			paddingRight: 10,
			anchorStyle: 'rightCenter',
			opacity: '0.7'
		}
	}
});
