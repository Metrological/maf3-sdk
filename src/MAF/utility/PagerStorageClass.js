define('MAF.utility.PagerStorageClass', function () {
	return new MAF.Class({
		ClassName: 'PagerStorageClass',
		initialize: function () {
			this.items = [];
			if (this.config.data) {
				this.addItems([].concat(this.config.data));
				this.config.data = null;
				delete this.config.data;
			}
		},

		add: function (addItems) {
			this.addItems(addItems);
		},

		addItems: function (items) {
			this.items = this.items.concat(items || []).unique();
		},

		remove: function (o, k) {
			var index;
			o = [].concat(o);
			k = k === true ? true : false;
			for (var i=0,l=o.length;i<l;i++) {
				index = this.contains(o[i], k);
				if (index !== false) this.items.splice(itemIndex, 1);
			}
		},

		contains: function (o, byKey) {
			return Object.contains(o, this.items, byKey);
		},

		truncate: function () {
			this.items = [];
		}
	});
});
