define('MAF.element.SlideCarousel', function() {
	var onNavigate = function(event){
		var direction = event.payload.direction;
		if(this.config.blockFocus || (this.config.orientation === 'horizontal' && (direction === 'left' || direction === 'right')) || 
			(this.config.orientation === 'vertical' && (direction === 'up' || direction === 'down'))){
			event.preventDefault();
		}
		if(!this.animating && this.currentDataset && this.buffDataset){
			if(this.config.orientation === 'horizontal'){
				switch(direction){
					case 'right':
						if(this.cells.length === 1){
							event.stop();
							break;
						}
						this.animating = true;
						this.cells.push(this.cells.shift());
						if(this.buffDataset.length){
							this.buffDataset.push(this.currentDataset.shift());
							this.currentDataset.push(this.buffDataset.shift());
							this.config.cellUpdater.call(this, this.cells[this.cells.length-1], this.currentDataset[this.currentDataset.length-1]);
						}
						animateCells(this.cells, direction, this);
						break;
					case 'left':
						if(this.cells.length === 1){
							event.stop();
							break;
						}
						this.animating = true;
						this.cells.unshift(this.cells.pop());
						if(this.buffDataset.length){
							this.buffDataset.unshift(this.currentDataset.pop());
							this.currentDataset.unshift(this.buffDataset.pop());
							this.config.cellUpdater.call(this, this.cells[0], this.currentDataset[0]);
						}
						animateCells(this.cells, direction, this);
						break;
				}
			}
			else{
				switch(direction){
					case 'down':
						if(this.cells.length === 1){
							event.stop();
							break;
						}
						this.animating = true;
						this.cells.push(this.cells.shift());
						if(this.buffDataset.length){
							this.buffDataset.push(this.currentDataset.shift());
							this.currentDataset.push(this.buffDataset.shift());
							this.config.cellUpdater.call(this, this.cells[this.cells.length-1], this.currentDataset[this.currentDataset.length-1]);
						}
						animateCells(this.cells, direction, this);
						break;
					case 'up':
						if(this.cells.length === 1){
							event.stop();
							break;
						}
						this.animating = true;
						this.cells.unshift(this.cells.pop());
						if(this.buffDataset.length){
							this.buffDataset.unshift(this.currentDataset.pop());
							this.currentDataset.unshift(this.buffDataset.pop());
							this.config.cellUpdater.call(this, this.cells[0], this.currentDataset[0]);
						}
						animateCells(this.cells, direction, this);
						break;
				}
			}
		}
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
						this.currentDataset.push(tmp.pop());
						for(i = 0; i < this.config.visibleCells; i++){
							this.currentDataset.push(data.shift());
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

		callForSlide: function(direction){
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
			}
		},

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
			delete this.currentDataset;
			delete this.buffDataset;
			delete this.offsets;
			delete this.opacityOffsets;
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