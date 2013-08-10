define('MAF.utility.Pager', function () {
	var classIndex = {};
	//var curIndex = 0, nextIndex = 0, leftIndex = 0, rightIndex = 0, dataSize = 0, pageSize = 0, fetchSize = 0, loadFactor = 0,
	var paramsMap = {},
		fetch = {},
		allowFiltering = true,
		items = [];

	//var storage = new HashMap();

	return new MAF.Class({
		ClassName: 'Pager',
		_eventType: 'pageDone',
		Protected: {
			filterItems: function (filterFn) {
				var filterArray = [];
				classIndex[this._classID].storage.remove('filter');
				if (allowFiltering)
					classIndex[this._classID].dataSize = 0;
				
				classIndex[this._classID].storage.forEach(function (value, key) {
					var item = (filterFn && typeOf(filterFn) === 'function') ? filterFn(value, key) : value;
					if (item) {
						if (filterFn && typeOf(filterFn) === 'function')
							filterArray.push(key);
						else
							filterArray[key] = key;
						if (allowFiltering)
							classIndex[this._classID].dataSize++;
					}
				}, this);

				classIndex[this._classID].storage.set('filter', filterArray);
			},
			setData: function () {

			},
			getData: function (index, pagesize, filtered) {
				index = index || 0,
				pagesize = pagesize || classIndex[this._classID].dataSize,
				filtered = (typeOf(this.config.filter) === 'function' && filtered === true) ? true : false;

				var items = [],
					filters = (classIndex[this._classID].storage.get('filter') || []).slice(index, index + pagesize),
					i = 0;

				filters.forEach(function (value, key) {
					items.push(classIndex[this._classID].storage.get(value));
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
				fetch = { func: fetchcallback, obj: fetchscope };
				allowFiltering = false;
			}
		},

		initItems: function (data, total) {
			if (!data) return false;

			// TODO: For dynamic paging loading 
			var internal = classIndex[this._classID];
			internal.curIndex = 0;
			internal.nextIndex = 0;
			internal.leftIndex = 0;
			internal.rightIndex = 0;

			paramsMap = {};

			data.forEach(function (value, key) {
				internal.storage.set(key, value);
			}, this);

			internal.dataSize = total || data.length || 0;

			this.filterItems(this.config.filter);
		},

		setFilter: function (fn) {
			if (typeOf(fn) === 'function' && allowFiltering) {
				this.config.filter = fn;
				this.filterItems(this.config.filter);
			} else {
				warn('Filtering needs a function or is not allowed because its set on dynamic paging.');
			}
		},

		getItem: function (index) {
			var internal = classIndex[this._classID],
				filterindex = internal.storage.get('filter')[index];
			return internal.storage.get(filterindex);
		},

		getItems: function () {
			return this.getData();
		},

		addItems: function (items) {
			if (items && typeOf(items) === 'array') {
				var data = this.getItems().concat(items);
				this.initItems(data, data.length);
			}
		},

		removeItems: function (start, count) {
			var data = this.getItems();
			data.splice(start, count);
			this.initItems(data, data.length);
		},

		getPageSize: function () {
			return classIndex[this._classID].pageSize || 0;
		},

		setPageSize: function (size) {
			classIndex[this._classID].pageSize = size || 0;
		},

		getFetchSize: function () {
			return classIndex[this._classID].fetchSize || 0;
		},

		getItemsSize: function () {
			return this.getItems().length;
		},

		getDataSize: function () {
			return classIndex[this._classID].dataSize || 0;
		},

		getNumPages: function () {
			var internal = classIndex[this._classID];
			return internal.dataSize > 0 ? Math.ceil(internal.dataSize/internal.pageSize) : 0;
		},

		getPage: function (index, wrap, pagesize, quiet) {
			var internal = classIndex[this._classID];
			index = index || 0;
			pagesize = pagesize || internal.pageSize || 0;

			var items = this.getData(index, pagesize, true);
			if (items && items.length > 0) {
				var page = new MAF.utility.PagerStorageClass({ data: items });

				this.fire(this._eventType, {
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
				paramsMap[key] = entry;

				if (fetch && fetch.func) {
					fetch.func.call(fetch.obj, params);
				}
				return null;
			}
			
		},

		onGotPage: function(params, arrData, total) {
			var entry = paramsMap[params.key];
			if (!entry)
				return false;

			paramsMap[params.key] = null;

			var internal = classIndex[this._classID];
			arrData.forEach(function (value, key) {
				internal.storage.set(entry.add_index + key, value);
			}, this);
			this.filterItems(this.config.filter);

			if (total !== null) {
				internal.dataSize = total;
			}

			var results = this.getData(entry.index, entry.page_size);//this._items && this._items.slice(entry.index, entry.index+entry.page_size) || false;
			var page = new MAF.utility.PagerStorageClass({data: results});

			entry.quiet || this.fire(this._eventType, { data:page, index:entry.index, wrap:entry.wrap });
			return true;
		},

		suicide: function () {
			delete classIndex[this._classID];
		}
	});
});
