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
 * @classdesc This is used by the MAF.utility.Pager to store a page size array of items. 
 * @class MAF.utility.PagerStorageClass
 * @example var page = new MAF.utility.PagerStorageClass({data: items});
 */
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

		/**
		 * @method MAF.utility.PagerStorageClass#add
		 * @deprecated Use {@link MAF.utility.PagerStorageClass#addItems} instead.
		 */
		add: function (addItems) {
			this.addItems(addItems);
		},

		/**
		 * @method MAF.utility.PagerStorageClass#addItems
		 * @param {Array} items These will be added to the Page. Duplicates will be removed.
		 */
		addItems: function (items) {
			this.items = this.items.concat(items || []).unique();
		},

		/**
		 * @method MAF.utility.PagerStorageClass#remove
		 * @param  {Array} o Array of items to remove from this PagerStorageClass
		 * @param  {Boolean} k
		 */
		remove: function (o, k) {
			o = [].concat(o);
			k = k === true ? true : false;
			for (var i = 0, l = o.length; i < l; i++) {
				if (this.contains(o[i], k) !== false) {
					this.items.splice(itemIndex, 1);
				}
			}
		},

		/**
		 * @method MAF.utility.PagerStorageClass#contains
		 */
		contains: function (o, key) {
			return Object.contains(o, this.items, key);
		},

		/**
		 * Clears the items in this storage class.
		 * @method MAF.utility.PagerStorageClass#truncate
		 */
		truncate: function () {
			this.items = [];
		}
	});
});
