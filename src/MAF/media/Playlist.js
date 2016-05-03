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
 * @class MAF.media.Playlist
 * @classdesc Provides media playlist for the media player.
 */
/**
 * @cfg {Boolean} autoStart Start the media when it can play. Default is true.
 * @memberof MAF.media.Playlist
 */
/**
 * @cfg {Boolean} repeatAll When the last media entry has finished playback, when set to true this will start playback of the first entry again. Default is false.
 * @memberof MAF.media.Playlist
 */
/**
 * @cfg {Boolean} forcePlay Even when the bandwidth is not high enough for playback this will force playback on the lowest available bitrate stream for each entry.
 * @memberof MAF.media.Playlist
 */
define('MAF.media.Playlist', function () {
	return new MAF.Class({
		config: {
			autoStart: true,
			repeatAll: false,
			forcePlay: true
		},

		initialize: function() {
			var playlist = {
				entries: [],
				autoStart: this.config.autoStart === true,
				repeatAll: this.config.repeatAll === true,
				forcePlay: this.config.forcePlay === true
			};
			getter(this, 'autoStart', function () {
				return playlist.autoStart;
			});
			setter(this, 'autoStart', function (value) {
				playlist.autoStart = Boolean(value);
			});
			getter(this, 'repeatAll', function () {
				return playlist.repeatAll;
			});
			setter(this, 'repeatAll', function (value) {
				playlist.repeatAll = Boolean(value);
			});
			getter(this, 'forcePlay', function () {
				return playlist.forcePlay;
			});
			setter(this, 'forcePlay', function (value) {
				playlist.forcePlay = Boolean(value);
			});
			getter(this, 'entries', function () {
				return playlist.entries;
			});
			setter(this, 'entries', function (entries) {
				playlist.entries = entries || [];
			});
		},

		/**
		 * Remove the media entry from the playlist at the specified index.
		 * @method MAF.media.Playlist#removeEntry
		 * @param {Number} index Media entry index.
		 */
		removeEntry: function (index) {
			this.entries.slice(index);
		},

		/**
		 * Clear all media playlist entries from the playlist.
		 * @method MAF.media.Playlist#clearEntries
		 */
		clearEntries: function() {
			this.entries = [];
		},

		/**
		 * Add a media playlist entry to the playlist.
		 * @method MAF.media.Playlist#addEntry
		 * @param {MAF.media.PlaylistEntry} entry Media playlist entry to add.
		 * @return {MAF.media.Playlist} This component.
		 * @example
		 * var playlist = new MAF.media.Playlist();
		 * playlist.addEntry(new MAF.media.PlaylistEntry({
		 *    url: "http://my.media.nl/video1.mp4",
		 *    bitrate: 2192
		 * }));
		 */
		addEntry: function(entry) {
			return this.addEntries([entry]);
		},

		/**
		 * Add multiple playlist entries to the playlist.
		 * @method MAF.media.Playlist#addEntries
		 * @param {Array} entries Multiple playlist entries in a array.
		 * @return {MAF.media.Playlist} This component.
		 * @example
		 * var playlist = new MAF.media.Playlist();
		 * var entries = [];
		 * entries.push(new MAF.media.PlaylistEntry({ url: "http://my.media.nl/video1.mp4", asset: { title: 'Video 1' } }));
		 * entries.push(new MAF.media.PlaylistEntry({ url: "http://my.media.nl/video2.mp4", asset: { title: 'Video 2' } }));
		 * playlist.addEntries(entries);
		 */
		addEntries: function(entries) {
			this.entries = this.entries.concat(entries).filter(function (entry) {
				return entry instanceof MAF.media.PlaylistEntry;
			});
			return this;
		},

		/**
		 * Add a media playlist entry to the playlist defined by a url.
		 * @method MAF.media.Playlist#addEntryByURL
		 * @param {String} url Path to the media.
		 * @param {String} bitrate Bitrate the media has.
		 * @example
		 * var playlist = new MAF.media.Playlist();
		 * playlist.addEntryByURL("http://my.media.nl/video1.mp4", 2192);
		 * @todo Extend for new playlist entry -> Asset
		 */
		addEntryByURL: function(url, bitrate, startIndex, startTime) {
			return this.addEntry(new MAF.media.PlaylistEntry({
				url: url,
				bitrate: bitrate,
				startTime: startTime || 0,
				startIndex: startIndex || 0
			}));
		}
	});
});
