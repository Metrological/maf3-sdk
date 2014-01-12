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
 * @class MAF.media.PlaylistEntry
 */
define('MAF.media.PlaylistEntry', function () {
	var sortOnBitrate = function (streams) {
		streams.sort(function (a, b) {
			if (a.bitrate === b.bitrate) {
				return 0;
			}
			return a.bitrate < b.bitrate ? 1 : -1;
		});
	};
	return new MAF.Class({
		config: {
			url: null,
			bitrate: 0,
			asset: null,
			streams: null
		},

		initialize: function () {
			var streams = [];
			if (this.config.url) {
				streams.push({
					url: this.config.url,
					bitrate: this.config.bitrate
				});
			}

			if (this.config.streams instanceof Array) {
				this.config.streams.forEach(function (stream) {
					if (stream.url) {
						streams.push({
							url: stream.url,
							bitrate: stream.bitrate || this.config.bitrate
						});
					}
				}, this);
				sortOnBitrate(streams);
				delete this.config.streams;
			}

			getter(this, 'asset', function () {
				return this.config.asset;
			});

			getter(this, 'streams', function () {
				return streams;
			});
		},

		streamsReady: function () {
			return true;
		},

		hasURL: function (url) {
			return this.streams.filter(function (stream) {
				return stream.url === url;
			}).length > 0;
		},

		addURL: function (url, bitrate) {
			if (url) {
				this.streams.push({
					url: url, 
					bitrate: isNaN(bitrate) ? 0 : bitrate
				});
				sortOnBitrate(this.streams);
			}
			return this;
		}
	});
});
