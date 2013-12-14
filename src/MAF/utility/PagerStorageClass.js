/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2013  Metrological
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
			o = [].concat(o);
			k = k === true ? true : false;
			for (var i = 0, l = o.length; i < l; i++) {
				if (this.contains(o[i], k) !== false) {
					this.items.splice(itemIndex, 1);
				}
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
