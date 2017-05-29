var YT = {
  playlist: [],
  current: null,
  channelName: 'YOUTUBE_CHANNEL_NAME',
  key: 'YOUTUBE_API_KEY',
  doRequest: function( endpoint, data, err, cb ) {
    function failure() { err( $_( 'NoData' ) ); }

    new Request( {
      url: 'https://www.googleapis.com/youtube/v3' + endpoint,
      proxy: true,
      method: 'get',
      onSuccess: function( json ) {
        if ( json ) return cb( json );
        failure();
      },
      onError: failure,
      onFailure: failure,
      onTimeout: failure
    } ).send( Object.merge( { key: this.key }, data ) );
  },
  getChannel: function ( err, cb ) {
    this.doRequest( '/channels', {
      part: 'contentDetails',
      forUsername: this.channelName
    }, err, cb );
  },
  getPlaylist: function( err, cb, id ) {
    this.doRequest( '/playlistItems', {
      part: 'snippet',
      playlistId: id,
      maxResults: 50
    }, err, cb );
  },
  getVideos: function( err, cb ) {
    this.getChannel( err, function( channel ) {
      this.getPlaylist(
        err,
        function( data ) {
          this.playlist = data.items.map( function( item ) {
            return {
              img: item.snippet.thumbnails.high.url || null,
              title: item.snippet.title || '',
              description: item.snippet.description || '',
              date: moment( item.snippet.publishedAt ).format( 'DD MMM YYYY HH:MM' ),
              id: item.snippet.resourceId.videoId || null
            };
          } );

          cb( this.playlist );
        }.bind( this ),

        channel.items[ 0 ].contentDetails.relatedPlaylists.uploads
      );
    }.bind( this ) );
  },
  next: function() {
    if ( !this.current ) return;

    if ( this.current.index === this.playlist.length - 1 )
      this.current.index = -1;

    this.current = {
      item: this.playlist[ ++this.current.index ],
      index: this.current.index
    };
  },
  prev: function() {
    if ( !this.current ) return;

    if ( 0 === this.current.index )
      this.current.index = this.playlist.length;

    this.current = {
      item: this.playlist[ --this.current.index ],
      index: this.current.index
    };
  }
};
