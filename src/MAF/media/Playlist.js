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

		removeEntry: function (index) {
			this.entries.slice(index);
		},

		clearEntries: function() {
			this.entries = [];
		},

		addEntry: function(entry) {
			return this.addEntries([entry]);
		},

		addEntries: function(entries) {
			this.entries = this.entries.concat(entries).filter(function (entry) {
				return entry instanceof MAF.media.PlaylistEntry;
			});
			return this;
		},

		addEntryByURL: function(url, bitrate, startIndex) {
			return this.addEntry(new MAF.media.PlaylistEntry({
				url: url,
				bitrate: bitrate,
				startIndex: startIndex || 0
			}));
		}
	});
});
