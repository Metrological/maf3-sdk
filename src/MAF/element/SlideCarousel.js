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
 * @class MAF.control.SlideCarousel
 * @classdesc .
 * @extends MAF.control.Container
 * * All cells are based on descendants of MAF.element.SlideCarouselCell
 * * cellCreator() is a required method that returns a cell with no data.
 * * cellUpdater() is a required method that will update a cell with data.
 * @example new MAF.element.Grid({
 *    visibleCells: 5,
 *    focusIndex: 3,
 *    orientation: 'horizontal',
 *    blockFocus: 'false',
 *    slideDuration: 0.3,
 *    opacityOffset: 0,
 *    cellCreator: function () {
 *       var cell = new MAF.element.GridCell({
 *          events: {
 *             onSelect: function(event) {
 *                log('Selected', this.getDataItem());
 *             } 
 *          }
 *       });
 *
 *       cell.text = new MAF.element.Text({
 *          styles: {
 *             color: 'white'
 *          }
 *       }).appendTo(cell);
 *       return cell;
 *    },
 *    cellUpdater: function (cell, data) {
 *       cell.text.setText(data.label);
 *    }
 * }).appendTo(this);
 * @config {string} [title] The new job title.
 */
 /**
 * @cfg {Number} rows Number of cells visible for the viewer.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Number} indicates which position is always focused.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {String} orientation Horizontal or verticale orientation of the SlideCarousel.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Boolean} this determines whether the grid can be focus at all, this is handy when you decided to control your SlideCarousel with a different component.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Number} this determines how fast the cells will be moving to a new position.
 * @memberof MAF.element.SlideCarousel
 */
/**
 * @cfg {Number} this determines the opacity difference from the focusIndex.
 * @memberof MAF.element.SlideCarousel
 */

/**
 * Fired when the data set of the grid has changed.
 * @event MAF.element.SlideCarousel#onDatasetChanged
 */
/**
 * Fired when state of the grid is updated/changed.
 * @event MAF.element.SlideCarousel#onStateUpdated
 */
define('MAF.element.SlideCarousel', function() {
	var onNavigate = function(event){
		var direction = event.payload.direction;
		if(this.config.blockFocus || (this.config.orientation === 'horizontal' && (direction === 'left' || direction === 'right')) || 
			(this.config.orientation === 'vertical' && (direction === 'up' || direction === 'down'))){
			event.preventDefault();
		}
		this.shift(direction);
	};
	var animateCells = function(cells, dir, parent){
		if(cells){
			cells.forEach(function(cell, i){
				var small = (parent.currentDataset.length - 2) < parent.config.visibleCells,
				smallAmount = i === cells.length-1;
				if(cell){
					cell.animate({
						opacity: ((dir === 'right' || dir === 'down') && smallAmount) ? 0 : ((dir === 'left' || dir === 'up') && i === 0) ? 0 : ((dir === 'left' || dir === 'up') && small && smallAmount) ? 0 :  parent.opacityOffsets[i],
						duration: 0.1,
						events:{
							onAnimationEnded: function(){
								if(cell){
									cell.animate({
										hOffset: (parent.config.orientation === 'horizontal') ? parent.offsets[i] : 0,
										vOffset: (parent.config.orientation === 'vertical') ? parent.offsets[i] : 0,
										duration: parent.config.slideDuration,
										events:{
											onAnimationEnded: function(){
												parent.animating = false;
												cell.element.allowNavigation = false;
												cell.opacity = (small && smallAmount) ? 0 : parent.opacityOffsets[i];
												if(i === parent.config.focusIndex){
													cell.element.allowNavigation = (parent.config.blockFocus) ? false : true;
													if(!parent.config.blockFocus){
														cell.focus();
													}
												}
											}
										}
									});
								}
							}
						}
					});
				}
			}, this);
		}
	};

	return new MAF.Class({
		ClassName: 'SlideCarousel',
		Extends: MAF.element.Container,
		Protected: {
			registerEvents: function(types){
				this.parent(['navigate'].concat(types || []));
			},
			dispatchEvents: function(event){
				this.parent(event);
				switch(event.type){
					case 'navigate':
						this.fire('onNavigate', event.detail, event);
						break;
				}
			},
			handleFocusEvent: function (event) {
				var payload = event.payload;
				switch (event.type) {
					case 'onFocus':
						if(this.cells[this.config.focusIndex]){
							this.cells[this.config.focusIndex].focus();
						}
						break;
				}
			},
			generateCells: function (data){
				if(this.currentDataset.length > 0){
					var cell,
						o = this.config.orientation,
						cd = this.getCellDimensions(),
						dims;
					this.offsets = [];
					this.opacityOffsets = [];
					if(this.currentDataset.length === 1){
						dims = {
							width: (o === 'horizontal') ? ((1 / this.config.visibleCells) * 100) + '%' : '100%',
							height: (o === 'vertical') ? ((1 / this.config.visibleCells) * 100) + '%' :'100%',
							hOffset: (o === 'horizontal') ? (cd.width * -1) + (cd.width) : 0,
							vOffset: (o === 'vertical') ? (cd.height * -1) + (cd.height) : 0
						};
						cell = this.config.cellCreator.call(this).setStyles(dims);
						cell.setStyle('transform', 'translateZ(0)');
						cell.grid = this;
						cell.appendTo(this);
						cell.setStyle('opacity', 1);
						cell.element.allowNavigation = (this.config.blockFocus) ? false : true;
						this.cells.push(cell);
					}
					else{
						for(var i = 0; i < this.currentDataset.length; i++){
							dims = {
								width: (o === 'horizontal') ? ((1 / this.config.visibleCells) * 100) + '%' : '100%',
								height: (o === 'vertical') ? ((1 / this.config.visibleCells) * 100) + '%' :'100%',
								hOffset: (o === 'horizontal') ? (cd.width * -1) + (i * cd.width) : 0,
								vOffset: (o === 'vertical') ? (cd.height * -1) + (i * cd.height) : 0
							};
							cell = this.config.cellCreator.call(this).setStyles(dims);
							cell.setStyle('transform', 'translateZ(0)');
							cell.grid = this;
							cell.appendTo(this);
							cell.setStyle('opacity', (i === this.currentDataset.length-1) ? 0 : 1);
							if(Math.abs(this.config.focusIndex - i) > 0 && this.config.opacityOffset > 0){
								this.opacityOffsets.push(1 - Math.abs(this.config.focusIndex - i) * this.config.opacityOffset);
								cell.setStyle('opacity', this.opacityOffsets[this.opacityOffsets.length-1]);
							}
							cell.element.allowNavigation = (this.config.blockFocus) ? false : (i === this.config.focusIndex) ? true : false;
							this.cells.push(cell);
							this.offsets.push((o === 'horizontal') ? dims.hOffset : dims.vOffset);
						}
					}
				}
				return this.cells.length;
			},
			reOrder: function(data){
				if(this.config.focusIndex > 1){
					for(var i = 0; i < this.config.focusIndex - 1; i++){
						data.unshift(data.pop());
					}
				}
			},
			updateCells: function(data){
				var cellUpdater = this.config.cellUpdater;
				this.animating = false;
				this.buffDataset = [];
				this.currentDataset = [];
				var i = 0;
				if(data.length === undefined){
					data = [data];
				}
				if(data.length > 0){
					var tmp = [].concat(data);
					if(data.length === 1){
						this.currentDataset = [data[0]];
					}
					else if(data.length === this.config.visibleCells){
						this.reOrder(tmp);
						var main = [].concat(tmp);
						this.currentDataset.push(tmp.pop());
						for(i = 0; i < this.config.visibleCells; i++){
							this.currentDataset.push(main.shift());
						}
						this.currentDataset.push(tmp.shift());
					}
					else if(data.length < this.config.visibleCells){
						this.currentDataset.push(tmp.pop());
						for(i = 0; i < data.length; i++){
							this.currentDataset.push(data[i]);
						}
						this.currentDataset.push(tmp.shift());
					}
					else{
						this.reOrder(tmp);
						this.currentDataset.push(tmp.pop());
						for(i = 0; i < this.config.visibleCells + 1; i++){
							this.currentDataset.push(tmp.shift());
						}
						this.buffDataset = [].concat(tmp);
					}
				}
				if(this.cells.length && this.cells.length === this.currentDataset.length){
					this.cells.forEach(function(cell, u){
						cellUpdater.call(this, cell, this.currentDataset[u]);
					}, this);
				}
				else{
					while(this.cells.length){
						this.cells.pop().suicide();
					}
					if(this.generateCells() > 0){
						this.cells.forEach(function(cell, u){
							cellUpdater.call(this, cell, this.currentDataset[u]);
						}, this);
					}
				}
				this.fire('onStateUpdated');
			}
		},
		config: {
			visibleCells: 1,
			focusIndex: 1,
			opacityOffset: 0,
			orientation: 'horizontal',
			blockFocus: false,
			render: true
		},
		initialize: function(){
			this.config.visibleCells = this.config.visibleCells || 1;
			this.config.focusIndex = this.config.focusIndex || 1;
			this.config.orientation = this.config.orientation || 'horizontal';
			this.config.opacityOffset = this.config.opacityOffset || 0;
			this.config.blockFocus = this.config.blockFocus || false;
			this.config.slideDuration = this.config.slideDuration || 0.1;
			this.mainCollection = [];
			this.parent();
			this.cells = [];
			this.buffDataset = null;
			this.currentDataset = null;
			this.offsets = [];
			this.animating = false;
			onNavigate.subscribeTo(this, 'onNavigate', this);
			this.handleFocusEvent.subscribeTo(this, ['onFocus', 'onBlur'], this);
			this.setStyle('transform', 'translateZ(0)');
		},

		setVisibleCells: function(visibleCells){
			this.config.visibleCells = visibleCells;
		},

		getVisibleCells: function(){
			return this.config.visibleCells;
		},

		setFocusIndex: function(index){
			this.config.focusIndex = index;
		},

		getFocusIndex: function(){
			return (this.cells.length > 1) ? this.config.focusIndex : 0;
		},

		changeDataset: function(data){
			this.mainCollection = [].concat(data);
			this.updateCells(data);
			this.fire("onDatasetChanged");
		},

		getCellDataItem: function(c){
			for(var i = 0; i < this.cells.length; i++){
				if(c === this.cells[i]){
					return this.currentDataset[i];
				}
			}
		},

		/**
		 * @method MAF.element.SlideCarousel#getCurrentPage
		 * @return The zero-based index of the current page of data.
		 */
		getCurrentPage: function(){
			for(var i = 0; i < this.mainCollection.length; i++){
				if(this.getCurrentCell().getCellDataItem() === this.mainCollection[i]){
					return i;
				}
			}
		},

		/**
		 * @method MAF.element.SlideCarousel#getPageCount
		 * @return this.mainCollection.length. The number of items in the dataset.
		 */
		getPageCount: function(){
			return this.mainCollection.length;
		},

		/**
		 * Method for focussing a specific cell or dataitem in your grid.
		 * @method MAF.element.SlideCarousel#focucCell
		 * @param {integer} or {Object} which as to be focused and aligned with the proper focusIndex cell.
		 */
		focusCell: function(target){
			var data = [].concat(this.mainCollection),
				index = 0;
			if(isNaN(target)){
				for(var i = 0; i < data.length; i++){
					if(target === data[i]){
						index = i;
						break;
					}
				}
			}
			var tmp = data.splice(0, i);
			data = data.concat(tmp);
			this.updateCells(data);
		},

		/**
		 * Attach a accessory component to this component so it can update on grid events.
		 * @method MAF.element.SlideCarousel#attachAccessory
		 * @param {Class} accessory The accessory component.
		 * @return This component.
		 */
		attachAccessory: function (accessory) {
			if (accessory && accessory.attachToSource) {
				accessory.attachToSource(this);
			}
			return this;
		},

		/**
		 * Attach multiple accessory components to this component.
		 * @method MAF.element.SlideCarousel#attachAccessories
		 * @param {Array} arguments Contains muliple accessory components.
		 * @return This component.
		 */
		attachAccessories: function () {
			Array.slice(arguments).forEach(this.attachAccessory, this);
			return this;
		},

		/**
		 * Method for animating your SlideCarousel with a different component.
		 * @method MAF.element.SlideCarousel#shift
		 * @param {String} the direction the carousel has to slide.
		 */
		shift: function(direction){
			if(this.config.orientation === 'vertical' && (direction === 'right' || direction === 'left')){
				return;
			}
			if(this.config.orientation === 'horizontal' && (direction === 'up' || direction === 'down')){
				return;
			}
			if(direction && !this.animating){
				this.animating = true;
				if(this.cells.length === 1){
					return;
				}
				switch(direction){
					case 'up':
					case 'left':
						if(this.cells.length > 1){
							this.cells.unshift(this.cells.pop());
							this.buffDataset.unshift(this.currentDataset.pop());
							this.currentDataset.unshift(this.buffDataset.pop());
							this.config.cellUpdater.call(this, this.cells[0], this.currentDataset[0]);
						}
						break;
					case 'down':
					case 'right':
						if(this.cells.length > 1){
							this.cells.push(this.cells.shift());
							this.buffDataset.push(this.currentDataset.shift());
							this.currentDataset.push(this.buffDataset.shift());
							this.config.cellUpdater.call(this, this.cells[this.cells.length-1], this.currentDataset[this.currentDataset.length-1]);
						}
						break;
				}
				animateCells(this.cells, direction, this);
				this.fire('onStateUpdated');
			}
		},

		/**
		 * @method MAF.element.SlideCarousel#getCellDimensions
		 * @return {Object} With the width and height of the cells for the grid.
		 */
		getCellDimensions: function () {
			return {
				width: (this.config.orientation === 'horizontal') ? Math.floor(this.width / this.config.visibleCells) : this.width,
				height: (this.config.orientation === 'vertical') ? Math.floor(this.height / this.config.visibleCells) : this.height
			}
		},

		getCurrentCell : function(){
			return this.cells[(this.cells.length === 1 ) ? 0 : this.config.focusIndex];
		},

		suicide: function () {
			this.currentDataset = null;
			this.buffDataset = null;
			this.offsets = null;
			this.opacityOffsets = null;
			this.mainCollection = null;
			delete this.currentDataset;
			delete this.buffDataset;
			delete this.offsets;
			delete this.opacityOffsets;
			delete this.mainCollection;
			if (this.cells) {
				while(this.cells.length) {
					this.cells.pop().suicide();
				}
				delete this.cells;
			}
			if (this.body) {
				this.body.suicide();
				delete this.body;
			}
			this.parent();
		}
	});
});