/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2017  Metrological
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
 * @classdesc A VAST Parser Class that will download and parse a VAST XML document.
 * @class MAF.VAST
 * @example var VAST = new MAF.VAST( { wrapperLimit: 3 } );
 * VAST.get( 'http://ads.example.com/vast.xml', function( error, vast ) {
 *   // handle the VAST response
 * } );
 */
 /**
 * @cfg {Number} [timeout = 1000] Number of miliseconds to wait for a VAST response to load from the ad server.
 * @memberof MAF.VAST
 */
 /**
 * @cfg {Boolean} [withCredentials = false] A boolean to enable the withCredentials options for the VAST xml request.
 * @memberof MAF.VAST
 */
/**
 * @cfg {Number} [wrapperLimit = 5] A number of available Wrapper responses that can be received with no InLine response.
 * @memberof MAF.VAST
 */
/**
 * Fired when an error has occured while parsing the VAST XML document.
 * @event MAF.VAST#onVASTError
 */

define( 'MAF.VAST', function() {
  var client;

  var urlFilters = [];

  function leftpad( str ) {
    if ( str.length >= 8 ) return str;

    var j       = 0;
    var len     = 8 - str.length;
    var results = [];

    for ( ; 0 <= len ? j < len : j > len; 0 <= len ? j++ : j-- )
      results.push( '0' );

    return results.join( '' ) + str;
  }

  function encodeURIComponentRFC3986( str ) {
    return encodeURIComponent( str ).replace( /[!'()*]/g, function( c ) {
      return '%' + c.charCodeAt( 0 ).toString( 16 );
    } );
  }

  function parseNodeText( node ) {
    return node && ( node.textContent || node.text || '' ).trim();
  }

  function copyNodeAttribute( name, source, dest ) {
    var value = source.getAttribute( name );
    if ( value ) dest.setAttribute( name, value );
  }

  function arrayActionByName( arr, action, name ) {
    return Array.prototype[ action ].call( arr, function( item ) {
      return item.nodeName === name;
    } );
  }

  function childByName( node, name ) {
    return arrayActionByName( node.childNodes, 'find', name );
  }

  function childsByName( node, name ) {
    return arrayActionByName( node.childNodes, 'filter', name );
  }

  function parseXPosition( pos ) {
    if ( pos === 'left' || pos === 'right' ) return pos;
    return parseInt( pos || 0 );
  }

  function parseYPosition( pos ) {
    if ( pos === 'top' || pos === 'bottom' ) return pos;
    return parseInt( pos || 0 );
  }

  function parseDuration( durationString ) {
    if ( !durationString ) return -1;

    return moment.duration( durationString ).seconds();
  }

  function parseWrapperElement( wrapperElement ) {
    var ad                = parseInLineElement( wrapperElement );
    var wrapperURLElement = childByName( wrapperElement, 'VASTAdTagURI' );

    if ( wrapperURLElement )
      ad.nextWrapperURL = parseNodeText( wrapperURLElement );
    else {
      wrapperURLElement = childByName( wrapperElement, 'VASTAdTagURL' );

      if ( wrapperURLElement )
        ad.nextWrapperURL = parseNodeText( childByName( wrapperURLElement, 'URL' ) );
    }

    ad.creatives.forEach( function( creative ) {
      if ( creative.type === 'linear' || creative.type === 'nonlinear' ) {
        if ( creative.trackingEvents ) {
          ad.trackingEvents || ( ad.trackingEvents = {} );
          ad.trackingEvents[ creative.type ] = creative.trackingEvents;
        }

        if ( creative.videoClickTrackingURLTemplates )
          ad.videoClickTrackingURLTemplates = creative.videoClickTrackingURLTemplates;

        if ( creative.videoClickThroughURLTemplate )
          ad.videoClickThroughURLTemplate = creative.videoClickThroughURLTemplate;

        if ( creative.videoCustomClickURLTemplates )
          ad.videoCustomClickURLTemplates = creative.videoCustomClickURLTemplates;
      }
    } );

    if ( ad.nextWrapperURL ) return ad;
  }

  function parseCreativeLinearElement( creativeElement ) {
    var creative = {
      trackingEvents: {}
    , type: 'linear'
    , duration: 0
    , skipDelay: null
    , mediaFiles: []
    , videoClickThroughURLTemplate: null
    , videoClickTrackingURLTemplates: []
    , videoCustomClickURLTemplates: []
    , adParameters: null
    , icons: []
    };

    creative.duration = parseDuration( parseNodeText( childByName( creativeElement, 'Duration' ) ) );

    if ( creative.duration === -1 && creativeElement.parentNode.parentNode.parentNode.nodeName !== 'Wrapper' )
      return null;

    var skipOffset = creativeElement.getAttribute( 'skipoffset' );

    if ( skipOffset === null )
      creative.skipDelay = null;
    else if ( skipOffset.charAt( skipOffset.length - 1 ) === '%' )
      creative.skipDelay = creative.duration * ( parseInt( skipOffset, 10 ) / 100 );
    else
      creative.skipDelay = parseDuration( skipOffset );

    var videoClicksElement = childByName( creativeElement, 'VideoClicks' );

    if ( videoClicksElement ) {
      creative.videoClickThroughURLTemplate = parseNodeText( childByName( videoClicksElement, 'ClickThrough' ) );

      childsByName( videoClicksElement, 'ClickTracking' ).forEach( function( child ) {
        creative.videoClickTrackingURLTemplates.push( parseNodeText( child ) );
      } );

      childsByName( videoClicksElement, 'CustomClick' ).forEach( function( child ) {
        creative.videoCustomClickURLTemplates.push( parseNodeText( child ) );
      } );
    }

    var adParamsElement = childByName( creativeElement, 'AdParameters' );

    if ( adParamsElement ) creative.adParameters = parseNodeText( adParamsElement );

    childsByName( creativeElement, 'TrackingEvents' ).forEach( function( trackingEvent ) {
      childsByName( trackingEvent, 'Tracking' ).forEach( function( tracker ) {
        var event           = tracker.getAttribute( 'event' );
        var offset          = tracker.getAttribute( 'offset' );
        var trackerTemplate = parseNodeText( tracker );

        if ( event && trackerTemplate ) {
          if ( event === 'progress' ) {
            if ( !offset ) return;

            if ( offset.charAt( offset.length - 1 ) === '%' )
              event = 'progress-' + offset;
            else
              event = 'progress-' + Math.round( parseDuration( offset ) );
          }

          if ( !creative.trackingEvents[ event ] )
            creative.trackingEvents[ event ] = [];

          creative.trackingEvents[ event ].push( trackerTemplate );
        }
      } );
    } );

    childsByName( creativeElement, 'MediaFiles' ).forEach( function( node ) {
      childsByName( node, 'MediaFile' ).forEach( function( child ) {
        var mediaFile = {
          id: child.getAttribute( 'id' )
        , fileURL: parseNodeText( child )
        , deliveryType: child.getAttribute( 'delivery' ) || 'progressive'
        , mimeType: child.getAttribute( 'type' )
        , codec: child.getAttribute( 'codec' )
        , bitrate: parseInt( child.getAttribute( 'bitrate' ) || 0 )
        , minBitrate: parseInt( child.getAttribute( 'minBitrate' ) || 0 )
        , maxBitrate: parseInt( child.getAttribute( 'maxBitrate' ) || 0 )
        , width: parseInt( child.getAttribute( 'width' ) || 0 )
        , height: parseInt( child.getAttribute( 'height' ) || 0 )
        , apiFramework: child.getAttribute( 'apiFramework' )
        , scalable: null
        , maintainAspectRatio: null
        };

        var scalable = child.getAttribute( 'scalable' );

        if ( scalable && typeOf( scalable ) === 'string' ) {
          scalable = scalable.toLowerCase();

          if ( scalable === 'true' ) mediaFile.scalable = true;
          else if ( scalable === 'false' ) mediaFile.scalable = false;
        }

        var maintainAspectRatio = child.getAttribute( 'maintainAspectRatio' );

        if ( maintainAspectRatio && typeOf( maintainAspectRatio ) === 'string' ) {
          maintainAspectRatio = maintainAspectRatio.toLowerCase();

          if ( maintainAspectRatio === 'true' ) mediaFile.maintainAspectRatio = true;
          else if ( maintainAspectRatio === 'false' ) mediaFile.maintainAspectRatio = false;
        }

        creative.mediaFiles.push( mediaFile );
      } );
    } );

    var iconsElement = childByName( creativeElement, 'Icons' );

    if ( iconsElement ) {
      childsByName( iconsElement, 'Icon' ).forEach( function( child ) {
        var icon = {
          program: child.getAttribute( 'program' )
        , height: parseInt( child.getAttribute( 'height' ) || 0 )
        , width: parseInt( child.getAttribute( 'width' ) || 0 )
        , xPosition: parseXPosition( child.getAttribute( 'xPosition' ) )
        , yPosition: parseYPosition( child.getAttribute( 'yPosition' ) )
        , apiFramework: child.getAttribute( 'apiFramework' )
        , offset: parseDuration( child.getAttribute( 'offset' ) )
        , duration: parseDuration( child.getAttribute( 'duration' ) )
        , type: null
        , staticResource: null
        , htmlResource: null
        , iframeResource: null
        , iconClickThroughURLTemplate: null
        , iconClickTrackingURLTemplates: []
        , iconViewTrackingURLTemplate: null
        };

        childsByName( child, 'HTMLResource' ).forEach( function( html ) {
          icon.type = html.getAttribute( 'creativeType' ) || 'text/html';
          icon.htmlResource = parseNodeText( html );
        } );

        childsByName( child, 'IFrameResource' ).forEach( function( iframe ) {
          icon.type = iframe.getAttribute( 'creativeType' ) || 0;
          icon.iframeResource = parseNodeText( iframe );
        } );

        childsByName( child, 'StaticResource' ).forEach( function( static ) {
          icon.type = static.getAttribute( 'creativeType' ) || 0;
          icon.staticResource = parseNodeText( static );
        } );

        var iconClicksElement = childByName( child, 'IconClicks' );

        if ( iconClicksElement ) {
          icon.iconClickThroughURLTemplate = parseNodeText( childByName( iconClicksElement, 'IconClickThrough' ) );

          childsByName( iconClicksElement, 'IconClickTracking' ).forEach( function( iconTracker ) {
            icon.iconClickTrackingURLTemplates.push( parseNodeText( iconTracker ) );
          } );
        }

        icon.iconViewTrackingURLTemplate = parseNodeText( childByName( child, 'IconViewTracking' ) );

        creative.icons.push( icon );
      } );
    }

    return creative;
  }

  function parseNonLinear( creativeElement ) {
    var creative = {
      type: 'nonlinear'
    , variations: []
    , trackingEvents: {}
    };

    childsByName( creativeElement, 'TrackingEvents' ).forEach( function( trackerEvent ) {
      childsByName( trackerEvent, 'Tracking' ).forEach( function( tracker ) {
        var eventName           = tracker.getAttribute( 'event' );
        var trackingURLTemplate = parseNodeText( tracker );

        if ( eventName && trackingURLTemplate ) {
          if ( !creative.trackingEvents[ eventName ] )
            creative.trackingEvents[ eventName ] = [];

          creative.trackingEvents[ eventName ].push( trackingURLTemplate );
        }
      } );
    } );

    childsByName( creativeElement, 'NonLinear' ).forEach( function( nonLinear ) {
      var nonlinearAd = {
        id: nonLinear.getAttribute( 'id' ) || null
      , width: nonLinear.getAttribute( 'width' ) || 0
      , height: nonLinear.getAttribute( 'height' ) || 0
      , minSuggestedDuration: nonLinear.getAttribute( 'minSuggestedDuration' ) || '00:00:00'
      , apiFramework: nonLinear.getAttribute( 'apiFramework' ) || 'static'
      , type: null
      , staticResource: null
      , htmlResource: null
      , iframeResource: null
      , nonlinearClickThroughURLTemplate: null
      };

      childsByName( nonLinear, 'HTMLResource' ).forEach( function( htmlElement ) {
        nonlinearAd.type = htmlElement.getAttribute( 'creativeType' ) || 'text/html';
        nonlinearAd.htmlResource = parseNodeText( htmlElement );
      } );

      childsByName( nonLinear, 'IFrameResource' ).forEach( function( iframe ) {
        nonlinearAd.type = iframe.getAttribute( 'creativeType' ) || 0;
        nonlinearAd.iframeResource = parseNodeText( iframe );
      } );

      childsByName( nonLinear, 'StaticResource' ).forEach( function( static ) {
        nonlinearAd.type = static.getAttribute( 'creativeType' ) || 0;
        nonlinearAd.staticResource = parseNodeText( static );
      } );

      nonlinearAd.nonlinearClickThroughURLTemplate = parseNodeText( childByName( nonLinear, 'NonLinearClickThrough' ) );

      creative.variations.push( nonlinearAd );
    } );

    return creative;
  }

  function parseCompanionAd( creativeElement ) {
    var creative = {
      trackingEvents: {}
    , type: 'companion'
    , variations: []
    };

    childsByName( creativeElement, 'Companion' ).forEach( function( companion ) {
      var companionAd = {
        id: companion.getAttribute( 'id' ) || null
      , width: companion.getAttribute( 'width' ) || 0
      , height: companion.getAttribute( 'height' ) || 0
      , type: null
      , staticResource: null
      , htmlResource: null
      , iframeResource: null
      , companionClickThroughURLTemplate: []
      , trackingEvents: {}
      };

      childsByName( companion, 'HTMLResource' ).forEach( function( html ) {
        companionAd.type = html.getAttribute( 'creativeType' ) || 'text/html';
        companionAd.htmlResource = parseNodeText( html );
      } );

      childsByName( companion, 'IFrameResource' ).forEach( function( iframe ) {
        companionAd.type = iframe.getAttribute( 'creativeType' ) || 0;
        companionAd.iframeResource = parseNodeText( iframe );
      } );

      childsByName( companion, 'StaticResource' ).forEach( function( static ) {
        companionAd.type = static.getAttribute( 'creativeType' ) || 0;
        companionAd.staticResource = parseNodeText( static );
      } );

      childsByName( companion, 'TrackingEvents' ).forEach( function( child ) {
        childsByName( child, 'Tracking' ).forEach( function( tracker ) {
          var eventName           = tracker.getAttribute( 'event' );
          var trackingURLTemplate = parseNodeText( tracker );

          if ( eventName && trackingURLTemplate ) {
            if ( !companionAd.trackingEvents[ eventName ] )
              companionAd.trackingEvents[ eventName ] = [];

            companionAd.trackingEvents[ eventName ].push( trackingURLTemplate );
          }
        } );
      } );

      childsByName( companion, 'CompanionClickTracking' ).forEach( function( clickTrack ) {
        companionAd.companionClickTrackingURLTemplates.push( parseNodeText( clickTrack ) );
      } );

      companionAd.companionClickThroughURLTemplate = parseNodeText( childByName( companion, 'CompanionClickThrough' ) );
      companionAd.companionClickTrackingURLTemplate = parseNodeText( childByName( companion, 'CompanionClickTracking' ) );

      creative.variations.push( companionAd );
    } );

    return creative;
  }

  function parseExtension( collection, extensions ) {
    var results = [];

    extensions.forEach( function( extNode ) {
      var ext = {
        attributes: {}
      , children: []
      };

      if ( extNode.attributes )
        Array.prototype.forEach.call( extNode.attributes, function( attribute ) {
          ext.attributes[ attribute.nodeName ] = attribute.nodeValue;
        } );

      extNode.childNodes.forEach( function( child ) {
        var txt      = parseNodeText( child );
        var extChild = {
          name: null
        , value: null
        , attributes: {}
        };

        if ( child.nodeName !== '#comment' && txt ) {
          extChild.name = child.nodeName;
          extChild.value = txt;

          if ( child.attributes )
            Array.prototype.forEach.call( child.attributes, function( attribute ) {
              extChild.attributes[ attribute.nodeName ] = attribute.nodeValue;
            } );

          ext.children.push( extChild );
        }
      } );

      results.push( collection.push( ext ) );
    } );

    return results;
  }

  function parseInLineElement( inLineElement ) {
    var ad = {
      id: inLineElement.getAttribute( 'id' ) || null
    , sequence: inLineElement.getAttribute( 'sequence' ) || null
    , system: null
    , title: null
    , description: null
    , advertiser: null
    , pricing: null
    , survey: null
    , errorURLTemplates: []
    , impressionURLTemplates: []
    , creatives: []
    , extensions: []
    };

    inLineElement.childNodes.forEach( function( node ) {
      var nodeName = node.nodeName;

      if ( nodeName === 'Error' )
        ad.errorURLTemplates.push( parseNodeText( node ) );
      else if ( nodeName === 'Impression' )
        ad.impressionURLTemplates.push( parseNodeText( node ) );
      else if ( nodeName === 'Creatives' )
        childsByName( node, 'Creative' ).forEach( function( creative ) {
          creative.childNodes.forEach( function( child ) {
            var adCreative;

            if ( child.nodeName === 'Linear' )
              adCreative = parseCreativeLinearElement( child );
            else if ( child.nodeName === 'NonLinearAds' )
              adCreative = parseNonLinear( child );
            else if ( child.nodeName === 'CompanionAds' )
              adCreative = parseCompanionAd( child );

            if ( adCreative ) ad.creatives.push( adCreative );
          } );
        } );
      else if ( nodeName === 'Extensions' )
        parseExtension( ad.extensions, childsByName( node, 'Extension' ) );
      else if ( nodeName === 'AdSystem' )
        ad.system = {
          value: parseNodeText( node )
        , version: node.getAttribute( 'version' ) || null
        };
      else if ( nodeName === 'AdTitle' )
        ad.title = parseNodeText( node );
      else if ( nodeName === 'Description' )
        ad.description = parseNodeText( node );
      else if ( nodeName === 'Advertiser' )
        ad.advertiser = parseNodeText( node );
      else if ( nodeName === 'Pricing' )
        ad.pricing = {
          value: parseNodeText( node )
        , model: node.getAttribute( 'model' ) || null
        , currency: node.getAttribute( 'currency' ) || null
        };
      else if ( nodeName === 'Survey' )
        ad.survey = parseNodeText( node );
    } );

    return ad;
  }

  function parseAdElement( adElement ) {
    var element;

    adElement.childNodes.forEach( function( node ) {
      if ( node.nodeName !== 'Wrapper' && node.nodeName !== 'InLine' ) return;

      copyNodeAttribute( 'id', adElement, node );
      copyNodeAttribute( 'sequence', adElement, node );

      if ( node.nodeName === 'Wrapper' )
        element = parseWrapperElement( node );

      else if ( node.nodeName === 'InLine' )
        element = parseInLineElement( node );
    } );

    return element;
  }

  function resolveURLTemplates( URLTemplates, variables ) {
    if ( !variables ) variables = {};

    if ( variables.ASSETURI )
      variables.ASSETURI = encodeURIComponentRFC3986( variables.ASSETURI );

    if ( variables.CONTENTPLAYHEAD )
      variables.CONTENTPLAYHEAD = encodeURIComponentRFC3986( variables.CONTENTPLAYHEAD );

    if ( variables.ERRORCODE && !/^[0-9]{3}$/.test( variables.ERRORCODE ) )
      variables.ERRORCODE = 900;

    variables.CACHEBUSTING = leftpad( Math.round( Math.random() * 1.0e+8 ).toString() );
    variables.TIMESTAMP    = encodeURIComponentRFC3986( ( new Date ).toISOString() );

    variables.RANDOM = variables.random = variables.CACHEBUSTING;

    return URLTemplates.map( function( URLTemplate ) {
      Object.forEach( variables, function( key, val ) {
        URLTemplate = URLTemplate.replace( '[' + key + ']', val ).replace( '%%' + key + '%%', val );
      } );

      return URLTemplate;
    } );
  }

  function trackError( templates, errorCode ) {
    client.fire( 'onVASTError', { errorCode: errorCode } );
    return track( templates, errorCode );
  }

  function track( URLTemplates, variables ) {
    return resolveURLTemplates( URLTemplates, variables ).map( function( URL ) {
      var img    = new Image();
      img.source = URL;
      return img;
    } );
  }

  function requestError( cb, xhr ) {
    cb( new Error( 'Request Error: ' + ( xhr && xhr.statusText || '' ) ) );
  }

  function get( url, options, cb ) {
    var request;
    var response;

    if ( !cb ) {
      if ( typeOf( options ) === 'function') cb = options;
      options = {};
    }

    if ( options.response != null ) {
      response = options.response;
      delete options.response;
      return cb( null, response );
    }

    if ( window.location.protocol === 'https:' && url.indexOf( 'http://' ) === 0 )
      return cb( new Error( 'HTTPS to HTTP is not supported.' ) );

    try {
      request = new Request( {
        url: url
      , proxy: false
      , method: 'get'
      , timeout: options.timeout || 0
      , withCredentials: options.withCredentials || false
      , onSuccess: function( xhr ) { cb( null, xhr ); }
      , onError: requestError.bind( null, cb )
      , onFailure: requestError.bind( null, cb )
      , onTimeout: requestError.bind( null, cb )
      } );

      request.overrideMimeType && request.overrideMimeType( 'text/xml' );

      return request.send();

    } catch( e ) { cb( new Error( 'Unexpected network error.' ) ); }
  }

  function parse( url, baseURLS, options, cb ) {
    if ( urlFilters && urlFilters.length )
      urlFilters.forEach( function( filter ) { url = filter( url ); } );

    if ( !baseURLS ) baseURLS = [];

    baseURLS.push( url );

    get( url, options, function( err, xml ) {
      var response = {
        ads: []
      , errorURLTemplates: []
      };

      if ( err != null ) return cb( err );

      if ( !xml || !xml.documentElement || xml.documentElement.nodeName !== 'VAST' )
        return cb( new Error( 'Invalid VAST XMLDocument' ) );

      if ( !xml.documentElement.childNodes || !xml.documentElement.childNodes.length )
        return cb( new Error( 'Empty VAST XMLDocument' ) );

      xml.documentElement.childNodes.forEach( function( node ) {
        var ad;

        if ( node.nodeName === 'Error' )
          response.errorURLTemplates.push( parseNodeText( node ) );

        else if ( node.nodeName === 'Ad' ) {
          ad = parseAdElement( node );

          if ( ad ) response.ads.push( ad );
          else trackError( response.errorURLTemplates, { ERRORCODE: 101 } );
        }
      } );

      function complete( errorAlreadyRaised ) {
        var noCreatives = true;

        if ( !response ) return;

        if ( response.ads.some( function( ad ) { return ad.nextWrapperURL; } ) ) return;

        response.ads.forEach( function( ad ) {
          if ( ad.creatives.length > 0 ) noCreatives = false;
        } );

        if ( noCreatives && !errorAlreadyRaised )
          trackError( response.errorURLTemplates, { ERRORCODE: 303 } );

        if ( response.ads.length === 0 ) response = null;

        return cb( null, response );
      }

      response.ads.forEach( function( ad ) {
        if ( !ad.nextWrapperURL ) return;

        if ( baseURLS.length >= 10 || baseURLS.indexOf( ad.nextWrapperURL) >= 0 ) {
          trackError( ad.errorURLTemplates, { ERRORCODE: 302 } );
          response.ads.splice( response.ads.indexOf( ad ), 1 );
          complete();
          return;
        }

        if ( ad.nextWrapperURL.indexOf( '//' ) === 0 )
          ad.nextWrapperURL = '' + location.protocol + ad.nextWrapperURL;
        else if ( ad.nextWrapperURL.indexOf( '://' ) === -1 )
          ad.nextWrapperURL = url.slice( 0, url.lastIndexOf( '/' ) ) + '/' + ad.nextWrapperURL;

        parse( ad.nextWrapperURL, baseURLS, options, function( error, wrappedResponse ) {
          var index;
          var errorAlreadyRaised = false;

          if ( error ) {
            trackError( ad.errorURLTemplates, { ERRORCODE: 301 } );
            response.ads.splice( response.ads.indexOf( ad ), 1 );
            errorAlreadyRaised = true;
          } else if ( !wrappedResponse ) {
            trackError( ad.errorURLTemplates, { ERRORCODE: 303 } );
            response.ads.splice( response.ads.indexOf( ad ), 1 );
            errorAlreadyRaised = true;
          } else {
            response.errorURLTemplates = response.errorURLTemplates.concat( wrappedResponse.errorURLTemplates );
            index = response.ads.indexOf( ad );
            response.ads.splice( index, 1 );

            wrappedResponse.ads.forEach( function( wrappedAd ) {
              wrappedAd.errorURLTemplates      = ad.errorURLTemplates.concat( wrappedAd.errorURLTemplates );
              wrappedAd.impressionURLTemplates = ad.impressionURLTemplates.concat( wrappedAd.impressionURLTemplates );
              wrappedAd.extensions             = ad.extensions.concat( wrappedAd.extensions );

              wrappedAd.creatives.forEach( function( creative ) {
                if ( ad.trackingEvents && ad.trackingEvents[ creative.type ] )
                  Object.keys( ad.trackingEvents[ creative.type ] ).forEach( function( eventName ) {
                    var events = creative.trackingEvents[ eventName ];

                    if ( events && events.length )
                      creative.trackingEvents[ eventName ] = events.concat( ad.trackingEvents[ creative.type ][ eventName ] );
                  } );

                if ( creative.type !== 'linear' ) return;

                if ( ad.videoClickTrackingURLTemplates )
                  creative.videoClickTrackingURLTemplates = creative.videoClickTrackingURLTemplates.concat( ad.videoClickTrackingURLTemplates );
                if ( ad.videoCustomClickURLTemplates )
                  creative.videoCustomClickURLTemplates = creative.videoCustomClickURLTemplates.concat( ad.videoCustomClickURLTemplates );
                if ( ad.videoClickThroughURLTemplate && !creative.videoClickThroughURLTemplate )
                  creative.videoClickThroughURLTemplate = ad.videoClickThroughURLTemplate;
              } );

              response.ads.splice( ++index, 0, wrappedAd );
            } );
          }

          delete ad.nextWrapperURL;

          complete( errorAlreadyRaised );
        } );

      } );

      complete();
    } );
  }

  function onStart() { client.lastSuccessfullAd = Date.now(); }

  return new MAF.Class( {
    ClassName: 'VAST'
  , Protected: {
      /**
       * Get a URL and parse the response XML into a valid VAST object.
       * @method MAF.VAST#get
       * @param {String} url The URL for getting the VAST XML document.
       * @param {Function} callback Function to be called once the VAST document is parsed. If an error occured the first parameter will contain this error. Null otherwise. The VAST object is passed as the 2nd parameter.
       */
      get: function( url, cb ) {
        var now               = Date.now();
        var timeSinceLastCall = now - this.lastSuccessfullAd;

        if ( this.totalCallsTimeout < now ) {
          this.totalCalls = 1;
          this.totalCallsTimeout = now + 36e5;
        } else this.totalCalls++;

        if ( timeSinceLastCall < 0 ) this.lastSuccessfullAd = 0;

        parse( url, null, this.config, cb );
      }

      /**
       * @classdesc A VAST Tracker Class that process the tracking URLs of the given ad/creative.
       * @class MAF.VAST.Tracker
       * @example var tracker = new VAST.Tracker( ad, creative );
       */
      /**
       * Fired after load() method has been called.
       * @event MAF.VAST.Tracker#onCreateView
       */
      /**
       * Fired only for linear ads with a duration. Fired on the 1st non-null setProgress(duration) call.
       * @event MAF.VAST.Tracker#onStart
       */
      /**
       * Fired only for linear ads with a duration. Fired on every setProgress(duration) call, where [0-100] is the adunit percentage completion.
       * @event MAF.VAST.Tracker#progress-[0-100]%
       */
      /**
       * Fired only for linear ads with a duration. Fired on every setProgress(duration) call, where [currentTime] is the adunit current time.
       * @event MAF.VAST.Tracker#progress-[currentTime]
       */
      /**
       * Fired only for linear ads with a duration. Fired when the adunit has reached 25% of its duration.
       * @event MAF.VAST.Tracker#firstQuartile
       */
      /**
       * Fired only for linear ads with a duration. Fired when the adunit has reached 50% of its duration.
       * @event MAF.VAST.Tracker#midpoint
       */
      /**
       * Fired only for linear ads with a duration. Fired when the adunit has reached 75% of its duration.
       * @event MAF.VAST.Tracker#thirdQuartile
       */
      /**
       * Fired only for linear ads with a duration. Fired after complete() has been called.
       * @event MAF.VAST.Tracker#onComplete
       */
      /**
       * Fired  when calling setPaused(paused) and changing the pause state from true to false.
       * @event MAF.VAST.Tracker#onResume
       */
      /**
       * Fired when calling setPaused(paused) and changing the pause state from false to true.
       * @event MAF.VAST.Tracker#onPause
       */
      /**
       * Fired when setProgress(duration) is called with a smaller duration than the previous one.
       * @event MAF.VAST.Tracker#onRewind
       */
      /**
       * Fired after calling skip().
       * @event MAF.VAST.Tracker#onSkip
       */
      /**
       * Fired only for linear ads, fired when close() is called.
       * @event MAF.VAST.Tracker#onCloseLinear
       */
      /**
       * Fired only for linear ads, fired when close() is called.
       * @event MAF.VAST.Tracker#onClose
       */
      /**
       * Fired when calling setMuted(muted) and changing the mute state from false to true.
       * @event MAF.VAST.Tracker#onMute
       */
      /**
       * Fired when calling setMuted(muted) and changing the mute state from true to false.
       * @event MAF.VAST.Tracker#onUnmute
       */
      /**
       * Fired when calling setFullscreen(fullscreen) and changing the fullscreen state from false to true.
       * @event MAF.VAST.Tracker#onFullscreen
       */
      /**
       * Fired when calling setFullscreen(fullscreen) and changing the fullscreen state from true to false.
       * @event MAF.VAST.Tracker#onExitfullscreen
       */
      /**
       * Fired when calling click() if there is at least one clickThroughURLTemplate element. A URL will be passed as a data.
       * @event MAF.VAST.Tracker#onClickthrough
       */
      /**
       * Fired when calling setExpand(expanded) and changing the expanded state from false to true.
       * @event MAF.VAST.Tracker#onExpand
       */
      /**
       * Fired when calling setExpand(expanded) and changing the expanded state from true to false.
       * @event MAF.VAST.Tracker#onCollapse
       */

    , Tracker: new MAF.Class( {
        Protected: {
          setDuration: function( duration ) {
            this.assetDuration = duration;

            this.quartiles = {
              firstQuartile: Math.round( 25 * this.assetDuration ) / 100,
              midpoint: Math.round( 50 * this.assetDuration ) / 100,
              thirdQuartile: Math.round( 75 * this.assetDuration ) / 100
            };

            return this.quartiles;
          }

          /**
           * Update the current time value. This is required for tracking time related events such as start, firstQuartile, midpoint, thirdQuartile or rewind.
           * @method MAF.VAST.Tracker#setProgress
           * @param {Number} progress The current playback time in seconds.
           * @return {Number} returns progress.
           */
        , setProgress: function( progress ) {
            var events  = [];
            var percent = Math.round( progress / this.assetDuration * 100 );

            var skipDelay = this.skipDelay === null ? this.skipDelayDefault : this.skipDelay;

            if ( skipDelay !== -1 && !this.skipable ) {
              if ( skipDelay > progress )
                this.fire( 'onSkipCountdown', { progress: skipDelay - progress } );
              else {
                this.skipable = true;
                this.fire( 'onSkipCountdown', { progress: 0 } );
              }
            }

            if ( this.linear && this.assetDuration > 0 ) {
              if ( progress > 0 ) {
                events.push( 'start' );

                events.push( 'progress-' + percent + '%' );
                events.push( 'progress-' + Math.round( progress ) );

                Object.forEach( this.quartiles, function( key, val ) {
                  if ( val <= progress && progress <= val + 1 )
                    events.push( key );
                } );
              }

              events.forEach( function( event ) {
                this.track( event, true );
              }, this );

              if ( progress < this.progress )
                this.track( 'rewind' );
            }

            this.progress = progress;

            return this.progress;
          }

          /**
           * Update the mute state and call the mute/unmute tracking URLs.
           * @method MAF.VAST.Tracker#setMuted
           * @param {Boolean} muted Indicate if the video is muted or not.
           * @fires MAF.VAST.Tracker#onMute
           * @fires MAF.VAST.Tracker#onUnmute
           * @return {Boolean} returns muted.
           */
        , setMuted: function( muted ) {
            if ( this.muted !== muted )
              this.track( muted ? 'mute' : 'unmute' );

            this.muted = muted;

            return this.muted;
          }

          /**
           * Update the pause state and call the resume/pause tracking URLs.
           * @method MAF.VAST.Tracker#setPaused
           * @param {Boolean} paused Indicate if the video is paused or not.
           * @fires MAF.VAST.Tracker#onPause
           * @fires MAF.VAST.Tracker#onResume
           * @return {Boolean} returns paused.
           */
        , setPaused: function( paused ) {
            if ( this.paused !== paused )
              this.track( paused ? 'pause' : 'resume' );

            this.paused = paused;

            return this.paused;
          }

          /**
           * Update the fullscreen state and call the fullscreen tracking URLs.
           * @method MAF.VAST.Tracker#setFullscreen
           * @param {Boolean} fullscreen Indicate if the video is in fullscreen mode.
           * @fires MAF.VAST.Tracker#onFullscreen
           * @fires MAF.VAST.Tracker#onExitfullscreen
           * @return {Boolean} returns fullscreen.
           */
        , setFullscreen: function( fullscreen ) {
            if ( this.fullscreen !== fullscreen )
              this.track( fullscreen ? 'fullscreen' : 'exitFullscreen' );

            this.fullscreen = fullscreen;

            return this.fullscreen;
          }

          /**
           * Update the expand state and call the expand/collapse tracking URLs.
           * @method MAF.VAST.Tracker#setExpand
           * @param {Boolean} paused Indicate if the video is expanded or not.
           * @fires MAF.VAST.Tracker#onExpand
           * @fires MAF.VAST.Tracker#onCollapse
           * @return {Boolean} returns expanded.
           */
        , setExpand: function( expanded ) {
            if ( this.expanded !== expanded )
              this.track( expanded ? 'expand' : 'collapse' );

            this.expanded = expanded;

            return this.expanded;
          }

          /**
           * Must be called if you want to overwrite the Linear Skipoffset value. This will init the skip countdown duration. Then, every time you call setProgress(), it will decrease the countdown and emit a skip-countdown event with the remaining time.<br><br>Do not call this method if you want to keep the original Skipoffset value.
           * @method MAF.VAST.Tracker#setSkipDelay
           * @param {Number} duration The time in seconds until the skip button is displayed.
           * @return {Boolean} returns duration.
           */
        , setSkipDelay: function( duration ) {
            if ( typeOf( duration ) !== 'number' ) return;

            this.skipDelay = duration;

            return this.skipDelay;
          }

          /**
           * Report the impression URL. Can only be called once. Will report the following URL's:
           * All Impression URL's from the InLine and Wrapper tracking elements.
           * The creativeView URL from the Tracking events.
           * @method MAF.VAST.Tracker#load
           * @param {Boolean} paused Indicate if the video is paused or not.
           * @fires MAF.VAST.Tracker#onCreateView
           */
        , load: function() {
            if ( this.impressed ) return;

            this.impressed = true;

            this.trackURLs( this.ad.impressionURLTemplates );

            return this.track( 'creativeView' );
          }

          /**
           * Send a request to the URL provided by the VAST Error element. If an [ERRORCODE] macro is included, it will be substituted with code.
           * @method MAF.VAST.Tracker#errorWithCode
           * @param {String} errorCode Replaces [ERRORCODE] macro. [ERRORCODE] values are listed in the VAST specification.
           */
        , errorWithCode: function( errorCode ) {
            return this.trackURLs(
              this.ad.errorURLTemplates, { ERRORCODE: errorCode }
            );
          }

          /**
           * Must be called when the user watched the linear creative until its end. Call the complete tracking URLs.
           * @method MAF.VAST.Tracker#complete
           * @fires MAF.VAST.Tracker#onComplete
           */
        , complete: function() { return this.track( 'complete' ); }

          /**
           * Must be called when the player or the app is closed during the ad. Calls the closeLinear (in VAST 3.0) and close tracking URLs.
           * @method MAF.VAST.Tracker#close
           * @fires MAF.VAST.Tracker#onCloseLinear
           * @fires MAF.VAST.Tracker#onClose
           */
        , close: function() {
            return this.track( this.linear ? 'closeLinear' : 'close' );
          }

        , stop: emptyFn

          /**
           * Must be called when the skip button is clicked. Calls the skip tracking URLs.
           * @method MAF.VAST.Tracker#skip
           * @fires MAF.VAST.Tracker#onSkip
           */
        , skip: function() {
            this.track( 'skip' );

            this.trackingEvents = [];

            return this.trackingEvents;
          }

          /**
           * Must be called when the user clicks on the creative. Calls the tracking URLs.
           * @method MAF.VAST.Tracker#click
           * @fires MAF.VAST.Tracker#onClickthrough
           */
        , click: function() {
            var clickThroughURL, variables;

            if ( this.clickTrackingURLTemplates && this.clickTrackingURLTemplates.length )
              this.trackURLs( this.clickTrackingURLTemplates );

            if ( this.clickThroughURLTemplate ) {
              if ( this.linear )
                variables = { CONTENTPLAYHEAD: this.progressFormated() };

              clickThroughURL = resolveURLTemplates(
                [ this.clickThroughURLTemplate ]
              , variables
              )[ 0 ];

              return this.fire( 'onClickthrough', { clickThroughURL: clickThroughURL } );
            }
          }

        , track: function( eventName, once ) {
            if ( once === null ) once = false;

            if ( eventName === 'closeLinear' &&
              !this.trackingEvents[ eventName ] &&
              this.trackingEvents[ 'close' ]
            ) eventName = 'close';

            var trackingURLTemplates = this.trackingEvents[ eventName ];
            var idx                  = this.emitAlwaysEvents.indexOf( eventName );

            eventName = eventName.toString();

            var fireEvent            = 'on' + eventName.charAt( 0 ).toUpperCase() + eventName.slice( 1 );

            if ( trackingURLTemplates ) {
              this.fire( fireEvent, {} );
              this.trackURLs( trackingURLTemplates );
            } else if ( idx !== -1 ) this.fire( fireEvent, {} );

            if ( once === true ) {
              delete this.trackingEvents[ eventName ];

              if ( idx > -1 ) this.emitAlwaysEvents.splice( idx, 1 );
            }
          }

        , trackURLs: function( URLTemplates, variables ) {
            if ( !variables ) variables = {};

            if ( this.linear ) {
              if ( this.creative.mediaFiles[ 0 ] && this.creative.mediaFiles[ 0 ].fileURL )
                variables[ 'ASSETURI' ] = this.creative.mediaFiles[ 0 ].fileURL;

              variables[ 'CONTENTPLAYHEAD' ] = this.progressFormated();
            }

            return track( URLTemplates, variables );
          }

        , progressFormated: function() {
            var duration = moment.duration( this.progress, 's' );

            return moment()
              .hours( duration.hours() )
              .minutes( duration.minutes() )
              .seconds( duration.seconds() )
              .millisecond( duration.milliseconds() )
              .format( 'HH:mm:ss.SSS' )
            ;
          }
        }

      , initialize: function( ad, creative ) {
          this.ad               = ad;
          this.creative         = creative;
          this.muted            = false;
          this.impressed        = false;
          this.skipable         = false;
          this.skipDelayDefault = -1;
          this.trackingEvents   = {};
          this.emitAlwaysEvents = [
            'creativeView'
          , 'start'
          , 'firstQuartile'
          , 'midpoint'
          , 'thirdQuartile'
          , 'complete'
          , 'resume'
          , 'pause'
          , 'rewind'
          , 'skip'
          , 'closeLinear'
          , 'close'
          ];

          Object.forEach( this.creative.trackingEvents, function( key, val ) {
            this.trackingEvents[ key ] = val;
          }, this );

          if (
            this.creative.type &&
            this.creative.type === 'linear' &&
            Object.contains( this.creative, 'duration', true ) &&
            Object.contains( this.creative, 'skipDelay', true )
          ) {
            this.setDuration( this.creative.duration );

            this.skipDelay = this.creative.skipDelay;
            this.linear    = true;

            this.clickThroughURLTemplate   = this.creative.videoClickThroughURLTemplate;
            this.clickTrackingURLTemplates = this.creative.videoClickTrackingURLTemplates;
          } else {
            this.skipDelay = -1;
            this.linear    = false;
          }

          onStart.subscribeTo( this, 'onStart' );
        }

      , suicide: function() {
          this.ad               = null;
          this.creative         = null;
          this.trackingEvents   = null;
          this.emitAlwaysEvents = null;

          onStart.unsubscribeFrom( this, 'onStart' );
        }
      } )
    }

  , config: {
      timeout: 1000
    , withCredentials: false
    , wrapperLimit: 5
    // TODO: , cappingMinimumTimeInterval: 0
    }

  , lastSuccessfullAd: 0
  , totalCalls: 0
  , totalCallsTimeout: 0

  , initialize: function() { client = this; }
  , suicide: function() {
      client     = null;
      urlFilters = null;
    }
  } );
} );
