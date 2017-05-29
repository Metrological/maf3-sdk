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
 * @classdesc This defines a media entry for the playlist in which multiple streams with different bitrates can be added. 
 * If you provide multiple streams with bitrates the fastest will be selected thats supported by the user's connection speed. 
 */
/**
 * @cfg {String} url Media path
 * @memberof MAF.media.PlaylistEntry
 */
/**
 * @cfg {Number} bitrate Bitrate of the media.
 * @memberof MAF.media.PlaylistEntry
 */
/**
 * @cfg {MAF.media.Asset} asset Information about the media.(title, description, poster)
 * @memberof MAF.media.PlaylistEntry
 */
/**
 * @cfg {Array} streams Array of objects with a url and a bitrate property. When the object contains no bitrate it will inherit from the bitrate config.
 * @memberof MAF.media.PlaylistEntry
 * @example <caption>The below example will add 2 streams to the media entry both having a bitrate of 1000</caption>
 * new MAF.media.PlaylistEntry({
 *    bitrate: 1000,
 *    streams: [
 *       { url: 'http://my.url/video1.mp4' },
 *       { url: 'http://my.url/video2.mp4' }
 *    ]
 * });
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
			streams: null,
			startTime: 0,
			customData: null,
			handleKey: null
		},

		initialize: function () {
			var streams = [];
			if (this.config.url) {
				streams.push({
					url: this.config.url,
					bitrate: this.config.bitrate,
					startTime: this.config.startTime % 1 === 0 && this.config.startTime || 0,
					customData: this.config.customData || null,
					handleKey: this.config.handleKey || null
				});
			}

			if (this.config.streams instanceof Array) {
				this.config.streams.forEach(function (stream) {
					if (stream.url) {
						streams.push({
							url: stream.url,
							bitrate: stream.bitrate || this.config.bitrate,
							startTime: stream.startTime % 1 === 0 && stream.startTime || 0,
							customData: this.config.customData || null,
							handleKey: this.config.handleKey || null
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

		/**
		 * Checks if this playlist entry has the url as defined by the parameter.
		 * @method MAF.media.PlaylistEntry#hasURL
		 * @param {String} url Media path.
		 * @return {Boolean} True if the url is already in this playlist entry.
		 */
		hasURL: function (url) {
			return this.streams.filter(function (stream) {
				return stream.url === url;
			}).length > 0;
		},

		/**
		 * Add a new stream to this media entry.
		 * @method MAF.media.PlaylistEntry#addURL
		 * @param {String} url Media path.
		 * @param {Number} [bitrate] Bitrate of media.
		 * @return {MAF.media.PlaylistEntry} This component.
		 */
		addURL: function (url, bitrate, startTime) {
			if (url) {
				this.streams.push({
					url: url,
					startTime: startTime % 1 === 0 && startTime || 0,
					bitrate: isNaN(bitrate) ? 0 : bitrate
				});
				sortOnBitrate(this.streams);
			}
			return this;
		}
	});
});
