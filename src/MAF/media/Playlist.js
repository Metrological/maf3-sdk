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
