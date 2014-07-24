/**
 * @classdesc > The YouTube.get method will return you a object that can be directly passed to a MAF.media.PlaylistEntry Class
 * @class Youtube
 * @singleton
 * @example
 *  YouTube.get('https://www.youtube.com/watch?v=9__EAOddo74', function(config) {
 *     MAF.mediaplayer.playlist.set((new MAF.media.Playlist()).addEntry(new MAF.media.PlaylistEntry(config)));
 *     MAF.mediaplayer.playlist.start();
 *  });
 */
/**
 * This will fetch info about a youtube video.
 * @method Youtube#get
 * @param {String} id Youtube video id or youtube url.
 * @param {Function} callback The method that will be triggered when the info about the video is available.
 * @param {Object} [scope] Define the scope if you want the callback to be run in a specific scope.
 */

/**
 * @method Youtube#regionQueryString
 */
