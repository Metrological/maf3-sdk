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
 * @class MAF.utility.Pager
 * @classdesc > The pager is a storage class for data. Grids can communicate with them by default.
 * @param {Number} pagesize Size of the page, default is 1.
 * @param {Number} fetchsize Fetch size, the number of items in the data set fetched at one time. The default fetch size is 48. You can fetch several pages at ones from the server.
 * @param {Number} [fetchcallback] A fetch method callback you provide for the next data set of items. This is the event delegate that knows how to fetch data in your server’s unique way.
 * @param {Number} [fetchscope] Scope object in which to run the fetchCallback method in.
 * @param {Number} [buffersize] Size of the page
 */
/**
 *
 */
define('MAF.utility.Pager', function () {
	var classIndex = {};
	return new MAF.Class({
		ClassName: 'Pager',

		eventType: 'pageDone',

		Protected: {
			filterItems: function (filterFn) {
				var filterArray = [],
					internal = classIndex[this._classID];
				internal.storage.remove('filter');
				if (internal.allowFiltering) {
					internal.dataSize = 0;
				}
				internal.storage.forEach(function (value, key) {
					var item = (filterFn && typeOf(filterFn) === 'function') ? filterFn(value, key) : value;
					if (item !== false && item !== undefined && item !== null) {
						if (filterFn && typeOf(filterFn) === 'function') {
							filterArray.push(key);
						} else {
							filterArray[key] = key;
						}
						if (internal.allowFiltering) {
							internal.dataSize++;
						}
					}
				}, this);
				internal.storage.set('filter', filterArray);
			},
			setData: function () {
			},
			getData: function (index, pagesize, filtered) {
				var internal = classIndex[this._classID];
				index = index || 0;
				pagesize = pagesize || internal.dataSize;
				filtered = (typeOf(this.config.filter) === 'function' && filtered === true) ? true : false;
				var items = [],
					filters = (internal.storage.get('filter') || []).slice(index, index + pagesize);
				filters.forEach(function (value, key) {
					items.push(internal.storage.get(value));
				}, this);
				return items;
			}
		},

		config: {
			filter: null
		},

		initialize: function (pagesize, fetchsize, fetchcallback, fetchscope, buffersize) {
			var internal = classIndex[this._classID] = {};
			internal.pageSize = pagesize || 1;
			internal.fetchSize = fetchsize || 48;
			internal.loadFactor = buffersize;
			internal.storage = new HashMap();
			if (fetchcallback) {
				internal.fetch = { func: fetchcallback, obj: fetchscope };
				internal.allowFiltering = false;
			} else {
				internal.allowFiltering = true;
			}
		},

		/**
		 * Initialize pager with data, you can call this multiple times. This will reset the pager.
		 * @method MAF.utility.Pager#initItems
		 * @param {Array} data Data that needs to be stored for paging.
		 * @param {Number} total Total data size.
		 */
		initItems: function (data, total) {
			if (!data) {
				return false;
			}

			// TODO: For dynamic paging loading 
			var internal = classIndex[this._classID];
			internal.curIndex = 0;
			internal.nextIndex = 0;
			internal.leftIndex = 0;
			internal.rightIndex = 0;
			internal.paramsMap = {};
			internal.storage.clear();

			data.forEach(function (value, key) {
				internal.storage.set(key, value);
			}, this);

			internal.dataSize = total || data.length || 0;

			this.filterItems(this.config.filter);
		},

		/**
		 * @method MAF.utility.Pager#setFilter
		 * @param {Function} fn Callback method in which you can define which values to filter.
		 * @example
		 *  var pager = new MAF.utility.Pager(2, 6);
		 *  pager.initItems([1,2,3,4,5,6], 6);
		 *  pager.setFilter(function (value, key) {
		 *     if (value > 2)
		 *        return value;
		 *     }
		 *  });
		 *  pager.getItems(); // Returns [3,4,5,6]
		 */
		setFilter: function (fn) {
			var internal = classIndex[this._classID];
			if (typeOf(fn) === 'function' && internal.allowFiltering) {
				this.config.filter = fn;
				this.filterItems(this.config.filter);
			} else {
				warn('Filtering needs a function or is not allowed because its set on dynamic paging.');
			}
		},

		/**
		 * @method MAF.utility.Pager#getItem
		 * @param {Number} index retrieves item at this index.
		 * @returns {Mixed} Item at the specified index.
		 */
		getItem: function (index) {
			var internal = classIndex[this._classID],
				filterindex = internal.storage.get('filter')[index];
			return internal.storage.get(filterindex);
		},

		/**
		 * Retrieve all data that is stored.
		 * @method MAF.utility.Pager#getItems
		 * @returns {Array} An Array containing the data thats stored, if a filter is set the data returned will be filtered.
		 */
		getItems: function () {
			return this.getData();
		},

		/**
		 * Takes a Array of items and adds them to the dataset.
		 * @method MAF.utility.Pager#addItems
		 * @param {Array} items These will be added to the dataset.
		 */
		addItems: function (items) {
			if (items && typeOf(items) === 'array') {
				var data = this.getItems().concat(items);
				this.initItems(data, data.length);
			}
		},

		/**
		 * Remove data from the dataset.
		 * @method MAF.utility.Pager#removeItems
		 * @param {Number} start At which index to start removing the data.
		 * @param {Number} count How many items to remove.
		 */
		removeItems: function (start, count) {
			var data = this.getItems();
			data.splice(start, count);
			this.initItems(data, data.length);
		},

		/**
		 * @method MAF.utility.Pager#getPageSize
		 * @return {Number} The size of the page that the pager is configured to.
		 */
		getPageSize: function () {
			return classIndex[this._classID].pageSize || 0;
		},

		/**
		 * @method MAF.utility.Pager#setPageSize
		 * @param {Number} size The size that the page needs to be changed to.
		 */
		setPageSize: function (size) {
			classIndex[this._classID].pageSize = size || 0;
		},

		/**
		 * Retrieves the value indicating how large a fetch for more data will be.
		 * @method MAF.utility.Pager#getFetchSize
		 * @returns {Number} The size of a fetch in a slice. Default is 48.
		 */
		getFetchSize: function () {
			return classIndex[this._classID].fetchSize || 0;
		},

//
		/**
		 * @method MAF.utility.Pager#getItemsSize
		 * @returns {Number} The size of the dataset. This will reflect its size filtered.
		 */
		getItemsSize: function () {
			return this.getItems().length;
		},

		/**
		 * Retrieves the total size of the dataset.
		 * @method MAF.utility.Pager#getDataSize
		 * @returns {Number} Total size of the dataset.
		 */
		getDataSize: function () {
			return classIndex[this._classID].dataSize || 0;
		},

		/**
		 * @method MAF.utility.Pager#getNumPages
		 * @returns {Number} The number of pages in the dataset.
		 */
		getNumPages: function () {
			var internal = classIndex[this._classID];
			return internal.dataSize > 0 ? Math.ceil(internal.dataSize/internal.pageSize) : 0;
		},

		/**
		 * Retrieves a page size nr of items.
		 * @method MAF.utility.Pager#getPage
		 * @param {Number} index Page index to fetch and return.
		 * @param {Boolean} [wrap] The data size is wrapped across multiple pages.
		 * @param {Number} [pagesize] The size the page needs to be.
		 * @param {Boolean} [quiet] Notify subscribers or not. Default it notifies.
		 * @returns {MAF.utility.PagerStorageClass} A page of items as a storageClass.
		 */
		getPage: function (index, wrap, pagesize, quiet) {
			var internal = classIndex[this._classID];
			index = index || 0;
			pagesize = pagesize || internal.pageSize || 0;

			var items = this.getData(index, pagesize, true);
			if (items && items.length > 0) {
				var page = new MAF.utility.PagerStorageClass({ data: items });

				this.fire(this.eventType, {
					data: page,
					index: index,
					wrap: wrap
				});

				return page;
			} else {
				var pn = Math.floor(index / internal.fetchSize);
				var pp = Math.max(pagesize, internal.fetchSize);
				var key = ''+Date.now()+Math.random();
				var entry = {
					index: index,
					wrap: wrap,
					add_index: pn * internal.fetchSize,
					page_size: pagesize || internal.pageSize,
					quiet: quiet
				};
				var params = {
					page: pn,
					per_page: pp,
					key: key
				};
				if (!internal.paramsMap) {
					internal.paramsMap = {};
				}
				internal.paramsMap[key] = entry;
				if (internal.fetch && internal.fetch.func) {
					internal.fetch.func.call(internal.fetch.obj, params);
				} else {
					this.fire(this.eventType, {
						data: new MAF.utility.PagerStorageClass({ data: [] }),
						index: index,
						wrap: wrap
					});
				}
				return null;
			}
			
		},

		onGotPage: function(params, arrData, total) {
			var internal = classIndex[this._classID],
				entry = internal.paramsMap[params.key];
			if (!entry) {
				return false;
			}
			internal.paramsMap[params.key] = null;
			arrData.forEach(function (value, key) {
				internal.storage.set(entry.add_index + key, value);
			}, this);
			this.filterItems(this.config.filter);
			if (total !== null) {
				internal.dataSize = total;
			}
			var results = this.getData(entry.index, entry.page_size);//this._items && this._items.slice(entry.index, entry.index+entry.page_size) || false;
			var page = new MAF.utility.PagerStorageClass({data: results});
			if (!entry.quiet) {
				this.fire(this.eventType, { data:page, index:entry.index, wrap:entry.wrap });
			}
			return true;
		},

		suicide: function () {
			var internal = classIndex[this._classID];
			if (internal)
				delete internal.storage;
			delete classIndex[this._classID];
		}
	});
});
