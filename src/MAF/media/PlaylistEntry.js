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
