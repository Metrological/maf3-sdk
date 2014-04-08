/**
 * @class MAF.mediaplayer
 * @classdesc > MAF.mediaplayer class defines the interactions available inside a app on the mediaplayer.
 * @singleton
 * @example
 * (function (event) {
 *    log(event.payload);
 * }).subscribeTo(MAF.mediaplayer, 'onStateChange');
 * 
 * var playlist = new MAF.media.Playlist();
 * playlist.addEntryByURL('http://my.url.com/video.mp4');
 * MAF.mediaplayer.playlist.set(playlist);
 * MAF.mediaplayer.playlist.start();
 */

/**
 * Indicates if the current playlist entry is in a active state. This can can be any of these states: PLAY, PAUSE, FORWARD, REWIND, BUFFERING, INFOLOADED
 * @name {Boolean|MAF.media.Playlist} isPlaylistEntryActive
 * @memberof MAF.mediaplayer
 * @readonly
 */
/**
 * Indicates if there currently is any kind of app view visible.
 * @name {Boolean} isSidebarHidden
 * @memberof MAF.mediaplayer
 * @readonly
 */
/**
 * Indicates if the TV is active as media playback. This also means there is no playlist entry.
 * @name {Boolean} isTVActive
 * @memberof MAF.mediaplayer
 * @readonly
 */

/**
 * Duration of the currently active media on the player.
 * @name {Float} player.currentMediaDuration
 * @memberof MAF.mediaplayer
 * @readonly
 */
/**
 * State of the player it is currently in.
 * @name {Number} player.currentPlayerState
 * @memberof MAF.mediaplayer
 * @readonly
 */
/**
 * Playback speed of the currently active media on the player.
 * @name {Number} player.currentSpeed
 * @memberof MAF.mediaplayer
 * @readonly
 */
/**
 * Time index of the currently active media on the player.
 * @name {Float} player.currentTimeIndex
 * @memberof MAF.mediaplayer
 * @readonly
 */

/**
 * Here are the possible enumeration constants for the player states.
 *
 * | Constant  | Description |
 * | ------------- | ------------- |
 * | BUFFEREMPTY  | The buffer is completely empty. The media may pause because there is no data in the buffer. BUFFERING should start. |
 * | BUFFERING  | Media is currently buffering. |
 * | EOF | The player has reached the end of the media file. |
 * | ERROR | The player gave an error while trying to playback a media file. |
 * | FORWARD | The media is moving forward on a increased speed. |
 * | INFOLOADED | Information about the media has been loaded, including header file information and media data. |
 * | INIT | The player is initializing. |
 * | PAUSE | The media file is paused. |
 * | PLAY | The media file is playing. |
 * | REWIND | The media file is rewinding. |
 * | STOP | The media file is stopped. |
 * | UNKNOWN | The player triggered a state unknown to the MAF.mediaplayer |
 * @name {Object} constants.states
 * @memberof MAF.mediaplayer
 */

/**
 * Continue the playback of the media that is paused. Only call this method when the media is paused.
 * @memberof MAF.mediaplayer
 * @method control.play
 */
/**
 * Pause the playback of the currently playing media.
 * @memberof MAF.mediaplayer
 * @method control.pause
 */
/**
 * Stop the playback of the currently playing media.
 * @memberof MAF.mediaplayer
 * @method control.stop
 */
/**
 * This will rewind current media. If the OEM supports faster speeds calling this method multiple times will increment the rewind speed.
 * @memberof MAF.mediaplayer
 * @method control.rewind
 */
/**
 * This will forward current media. If the OEM supports faster speeds calling this method multiple times will increment the forward speed.
 * @memberof MAF.mediaplayer
 * @method control.forward
 */
/**
 * Move the media position to the defined time.
 * @memberof MAF.mediaplayer
 * @method control.seek
 * @param {Number} time Seek to the specified time in seconds.
 * @param {Boolean} [absolute] Default this method will use the time parameter to seek relative from the current position in the media. Use true to seek to a absolute position.
 */
/**
 * The will mute the audio of the media.
 * @memberof MAF.mediaplayer
 * @method control.mute
 * @param {Boolean} muted Define true to mute the media false to unmute.
 */
/**
 * This will hide the media.
 * @memberof MAF.mediaplayer
 * @method control.hide
 */
/**
 * This will show the media.
 * @memberof MAF.mediaplayer
 * @method control.show
 */
/**
 * @memberof MAF.mediaplayer
 * @method playlist.get
 * @returns {MAF.media.Playlist} Currently active playlist.
 */
/**
 * Load the entry in the playlist defined bu the supplied idx parameter.
 * @memberof MAF.mediaplayer
 * @method playlist.loadEntry
 * @param {Number} idx Index defining the entry in the playlist to load.
 */
/**
 * Go to the next entry in the playlist.
 * @memberof MAF.mediaplayer
 * @method playlist.nextEntry
 */
/**
 * Go to the previous entry in the playlist.
 * @memberof MAF.mediaplayer
 * @method playlist.previousEntry
 */
/**
 * Set a playlist on the mediaplayer.
 * @memberof MAF.mediaplayer
 * @method playlist.set
 * @param {MAF.media.Playlist} pls The playlist to set on the mediaplayer.
 * @example
 * MAF.mediaplayer.playlist.set((new MAF.media.Playlist()).addEntry(new MAF.media.PlaylistEntry(config)));
 */
/**
 * This will try to start the playback of the playlist on the mediaplayer. A playlist needs to be set on the mediaplayer before calling this with MAF.mediaplayer.playlist.set()
 * @memberof MAF.mediaplayer
 * @method playlist.start
 */
/**
 * This will give information about a channel the tv currently is tuned to.
 * @method MAF.mediaplayer#getCurrentChannel
 * @returns {Object} TVChannel Containing:
 * * name - Channel name
 * * description - Description of the channel
 * * number - Number of the channel
 */
/**
 * This will give information about a current program the tv is currently tuned to.
 * @method MAF.mediaplayer#getCurrentProgram
 * @returns {Object} TVProgram Containing:
 * * title - Title of the program
 * * description - Description of the program
 * * startTime - Time the program started
 * * duration - Duration of the program in seconds.
 * * ageRating - What agesrating the program has been rated for.
 */

/**
 * Get the size and position of the players viewport.
 * @method MAF.mediaplayer#getViewportBounds
 * @returns {Object} Object containing:
 * * x - Horizontal position.
 * * y - Vertical position.
 * * width - Width of the players viewport.
 * * height - Height of the players viewport.
 */
/**
 * Set the channel the TV should try and tune to.
 * @method MAF.mediaplayer#setChannelByNumber
 * @param {Number} number Number to tune the TV to.
 */
/**
 * Set the size and position of the players viewport.
 * @method MAF.mediaplayer#setViewportBounds
 * @param {Number} x Horizontal position.
 * @param {Number} y Vertical position.
 * @param {Number} width Width of the players viewport.
 * @param {Number} height Height of the players viewport.
 */
/**
 * Fired when playback controls are pressed.
 * @event MAF.mediaplayer#onBufferChanged
 * @property {Object} payload
 * @property {Number} payload.bufferPercentage Indicates how far buffering is done with a percentage.
 * @property {Number} payload.playerStatus Indicates what state the player is in. Can be matched against MAF.mediaplayer.constants.states
 */
/**
 * Fired when the channel on the TV has changed.
 * @event MAF.mediaplayer#onChannelChange
 */
/**
 * Fired when the fast forward key was pressed on the remote control.
 * @event MAF.mediaplayer#onFastForwardRemoteKeyPress
 */
/**
 * Fired when the next playlist entry is called.
 * @event MAF.mediaplayer#onLoadNextPlaylistEntry
 */
/**
 * Fired when a playlist entry has been selected for playback.
 * @event MAF.mediaplayer#onLoadPlaylistEntry
 * @property {Object} payload
 * @property {Number} payload.index Playlist index to be loaded.
 */
/**
 * Fired when the previous playlist entry is called to be played.
 * @event MAF.mediaplayer#onLoadPreviousPlaylistEntry
 */
/**
 * Fired when pause key was pressed on the remote control.
 * @event MAF.mediaplayer#onPauseRemoteKeyPress
 */
/**
 * Fired when the playlist on the player has changed. event.preventDefault() will prevent the changes to be applied.
 * @event MAF.mediaplayer#onPlaylistChange
 * @property {Object} payload
 * @property {MAF.media.Playlist} payload.playlist The playlist that will be applied to the mediaplayer.
 */
/**
 * Fired when the end of the playlist has been reached.
 * @event MAF.mediaplayer#onPlaylistEnd
 */
/**
 * Fired when the player is repeating the playback of a playlist.
 * @event MAF.mediaplayer#onPlaylistRepeat
 */
/**
 * Fired when playback of a new playlist entry starts.
 * @event MAF.mediaplayer#onPlayPlaylistEntry
 */
/**
 * Fired when the play key was pressed on the remote control.
 * @event MAF.mediaplayer#onPlayRemoteKeyPress
 */
/**
 * Fired when the mediaplayer has selected a new playlist entry for playback.
 * @event MAF.mediaplayer#onProcessPlaylistEntry
 * @property {Object} payload
 * @property {MAF.media.PlaylistEntry} payload.entry The entry to be used for playback.
 */
/**
 * Fired when a key was pressed on the remote control. Can be used to handle all keys with a single handler if you call event.preventDefault()
 * @event MAF.mediaplayer#onRemoteKeyPress
 */
/**
 * Fired when the rewind key was pressed on the remote control.
 * @event MAF.mediaplayer#onRewindRemoteKeyPress
 */
/**
 * Fired when the playback speed has changed.
 * @event MAF.mediaplayer#onSetPlaybackSpeed
 * @property {Object} payload
 * @property {Number} payload.current Speed rate it currently plays the media on.
 * @property {Number} payload.previous Speed rate it previously was playing the media on.
 */
/**
 * Fired when a playlist starts playback. Usually when MAF.mediaplayer.playlist.start() is called.
 * @event MAF.mediaplayer#onStartPlaylist
 */
/**
 * Fired each time media gets into a new state. You can match the states in the payload against MAF.mediaplayer.constants.states
 * @event MAF.mediaplayer#onStateChange
 * @property {Object} payload
 * @property {Number} payload.newState The state the player just transitioned in.
 * @property {Number} payload.previousState The state the player was in.
 * @example
 * var onStateChange = function (event) {
 *    var state = event && event.payload && event.payload.newState,
 *        states = MAF.mediaplayer.constants.states;
 *    switch (state) {
 *       case states.PLAY:
 *          //Player is in the playback state.
 *          break;
 *       case states.PAUSE:
 *       	//Player is in the pause state.
 *       	break;
 *    }
 * }
 * onStateChange.subscribeTo(MAF.mediaplayer, 'onStateChange');
 */
/**
 * Fired when the stop key is pressed on the remote control.
 * @event MAF.mediaplayer#onStopRemoteKeyPress
 */
/**
 * Fired when the current playback position changed.
 * @event MAF.mediaplayer#onTimeIndexChanged
 * @property {Object} payload
 * @property {Float} payload.duration
 * @property {Float} payload.timeIndex
 */
/**
 * Fired when media playback bounds have changed.
 * @event MAF.mediaplayer#onViewportBoundsChanged
 * @property {Object} payload
 * @property {Object} payload.current Current size and position of the media playback bounds.
 * @property {Number} payload.current.x Horizontal position.
 * @property {Number} payload.current.y Vertical position
 * @property {Number} payload.current.width Width of the playback bound.
 * @property {Number} payload.current.height Height of the playback bound.
 * @property {Object} payload.previous Previous size and position of the media playback bounds.
 * @property {Number} payload.previous.x Horizontal position.
 * @property {Number} payload.previous.y Vertical position
 * @property {Number} payload.previous.width Width of the playback bound.
 * @property {Number} payload.previous.height Height of the playback bound.
 */

/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onConvertToSpeed
 */
/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onPlaybackBuffering
 */
/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onSetScreensaverMode
 */
/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onControlFastForward
 */
/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onControlPause
 */
/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onControlPlay
 */
/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onControlRewind
 */
/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onControlSeek
 */
/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onControlStop
 */
/**
 * Fired when playback controls are pressed.
 * @eventTODO MAF.mediaplayer#onControlStreamSwitch
 */
