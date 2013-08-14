define('MAF.media.PlaylistEntry', function () {
	var playlistStreams = {};
	return new MAF.Class({
		config: {
			url: null,
			bitrate: 0,
			startIndex: 0,
			streams: null
		},

		initialize: function() {
			var startIndex = this.config.startIndex;
			getter(this, 'startIndex', function() {
				return startIndex;
			});
			setter(this, 'startIndex', function(value) {
				startIndex = value;
			});

			var streams = playlistStreams[this._classID] = [];
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
				delete this.config.streams;
			}

			getter(this, 'streams', function () {
				return streams;
			});
		},

		streamsReady: function(callback) {
			return true;
		},

		addURL: function(url, bitrate) {
			var streams = playlistStreams[this._classID];
			if (url) {
				streams.push({
					url: url, 
					bitrate: isNaN(bitrate) ? 0 : bitrate
				});
				streams.sort(function (a, b) {
					if (a.bitrate === b.bitrate) {
						return 0;
					}
					return a.bitrate < b.bitrate ? 1 : -1;
				});
			}
			return this;
		},

		suicide: function () {
			delete playlistStreams[this._classID];
		}
	});
});
