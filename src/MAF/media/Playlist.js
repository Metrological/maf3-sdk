define('MAF.media.Playlist', function () {
	var playlists = {};
	return new MAF.Class({
		config: {
			autoStart: false,
			repeatAll: false,
			forcePlay: true
		},

		initialize: function() {
			var playlist = playlists[this._classID] = {};
			playlist.entries = [];
			playlist.autoStart = this.config.autoStart === true;
			playlist.repeatAll = this.config.repeatAll === true;
			playlist.forcePlay = this.config.forcePlay === true;

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
		},

		removeEntry: function (index) {
			playlists[this._classID].entries.slice(index);
		},

		clearEntries: function() {
			playlists[this._classID].entries = [];
		},

		addEntry: function(entry) {
			return this.addEntries([entry]);
		},

		addEntries: function(entries) {
			playlists[this._classID].entries = [].concat(entries).filter(function (entry) {
				return entry instanceof MAF.media.PlaylistEntry;
			});
			return this;
		},

		addEntryByURL: function(url, bitrate, startIndex) {
			return this.addEntry(new MAF.media.PlaylistEntry({
				url: url,
				bitrate: bitrate,
				startIndex: startIndex
			}));
		},

		suicide: function () {
			delete playlists[this._classID];
		}
	});
});
