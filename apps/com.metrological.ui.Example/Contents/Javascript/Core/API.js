var getRestaurants = function () {
	var lat = '47.3686498';
	var lng = '8.539182499999999';
	var Cat = 'Restaurant';
	var Radius = '50000';
	var secret = 'A-x&Vq92';
	var url = 'http://tel.search.ch/api/?rubrik=' + Cat + '&preferbizlinks=0&center=' + lat.toString() + ',' + lng.toString() + '&radius=' + Radius.toString() + '&maxnum=200&pos=1&lang=de&key=c272f0474f5a002a2798fe83098ee1c7';
	var calcHmac = sha1.hex(secret, url);

	new Request({
		url: url,
		proxy: {
			json: true
		},
		data: {
			hmac: calcHmac
		},
		onSuccess: function (json) {
			log('Restaurant feed : ', { 'jsonFeed': json });
			MAF.messages.store('RestaurantData', json.feed.entry || []);
		},
		onFailure: function (response) {
			log('failure', response);
		},
		onError: function (response) {
			log('eror', response);
		}
	}).get();
};

var getPagingData = function (fetchParams, nonpaging) {
	/*log(Date.format(new Date()));
	log(Date.format(new Date(), DateFormat.RFC2822, 'nl-NL'));
	log(Date.parse('2006/01/06', 'yyyy/dd/MM'));
	log(Date.parse('di, 13 aug. 2013 00:00:00 +0200', DateFormat.RSS, 'nl-NL'));*/

	var totalItems = 38;
	if (nonpaging) {
		fetchParams = {
			page: 0,
			per_page: totalItems
		}
	}
	var startIndex = (fetchParams && fetchParams.page && fetchParams.per_page) ? ((fetchParams.page * fetchParams.per_page) + 1) : 1,
		items = [],
		i;

	for (i = startIndex; i < startIndex + fetchParams.per_page; i++) {
		if (i <= totalItems) {
			var types = ['demo', 'prod'];
			items.push({ type: types[Math.floor(Math.random() * 2)], text: 'cell ' + i});
		}
	}

	if (nonpaging) {
		MAF.messages.store('dataSet', items);
	} else {
		MAF.messages.store('dataSet', {
			totalItems: totalItems,
			items: items,
			fetchParams: fetchParams || false
		});
	}
};

var getPicasaPhotos = function (fetchParams, albumType, albumID, userID) {
	var startPage = (fetchParams && fetchParams.page && fetchParams.per_page) ? ((fetchParams.page * fetchParams.per_page) + 1) : 1,
		timestamp = Date.now(),
		url = 'http://picasaweb.google.com/data/feed/api/featured';

	var dataparams = {
		kind: 'photo',
		alt: 'json',
		access: 'public',
		hl: widget.locale.replace('-', '_'),
		'kind': 'photo',
		'imgmax': 'd',
		'thumbsize': '170u,150u,72c',
		'feat': 'tags',
		'start-index': startPage,
		'max-results': fetchParams.per_page || 15
	};

	new Request({
		url: url,
		proxy: true,
		data: dataparams,
		onSuccess: function (json) {
			var Photos = {
				total: json.feed['openSearch$totalResults']['$t'] || 0,
				Photos: [].concat(json.feed.entry),
				type: /*albumType ||*/ false,
				'fetchParams': fetchParams || false,
				startIndex: startPage,
				timestamp: timestamp
			};
			MAF.messages.store('pwPhotos', Photos);
//			MAF.utility.WaitIndicator.down();
		},
		onFailure: function (error) {
			log('failure', error);
//			//MAF.utility.WaitIndicator.down();
		},
		onError: function (error) {
			log('error', error);
//			MAF.utility.WaitIndicator.down();
		}
	}).get();
};

var getSuggestions = function(a_callback, userText) {
	new Request({
		url: 'http://where.yahooapis.com/v1/places.q(' + escape(userText) + ');start=0;count=5?appid=otQtXR_V34HCXKPNswUpb6hIIzOEXZ5_mZLEQrOONgPVhGAPfNciVOienGnBo1mE.E3no9dNQT4-&lang=' + (profile.languageCode || 'en'),
		proxy: {
			json: true
		},
		onSuccess: function (json) {
			var suggestions = [];
			if (json.places.place && !json.places.place.length) {
				suggestions.push({
					city: json.places.place.name,
					country: json.places.place.country['$t'],
					latitude: json.places.place.boundingBox.northEast.latitude,
					longitude: json.places.place.boundingBox.northEast.longitude
				});
				a_callback(suggestions || []);
			} else if (json.places.place && json.places.place.length > 0) {
				for (var x = 0; x < json.places.place.length; x++) {
					if (json.places.place[x].city === 'Nederland') {
						/* use position of de Bilt instead of Steenwijkerland in Overijssel*/
						suggestions.push({
							city: json.places.place[x].name,
							country: json.places.place[x].country['$t'],
							latitude: 52.144566,
							longitude: 5.162485
						});
					} else {
						suggestions.push({
							city: json.places.place[x].name,
							country: json.places.place[x].country['$t'],
							latitude: json.places.place[x].boundingBox.northEast.latitude,
							longitude: json.places.place[x].boundingBox.northEast.longitude
						});
					}
				}
				a_callback(suggestions);
			}
		}
	}).send();
};
