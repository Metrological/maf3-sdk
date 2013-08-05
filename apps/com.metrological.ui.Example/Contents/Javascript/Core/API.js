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
			log('Restaurant feed : ', {
				'jsonFeed': json.feed.entry
			});
		},
		onFailure: function (response) {
			log('response : ', response);
		},
		onError: function () {
			log('response : ', response);
		}
	}).send();
};

var getPagingData = function (fetchParams, nonpaging) {
	var totalItems = 38;
	if (nonpaging) {
		fetchParams = {
			page: 0,
			per_page: totalItems
		}
	}
	var startIndex = (fetchParams && fetchParams.page && fetchParams.per_page) ? ((fetchParams.page*fetchParams.per_page) + 1) : 1,
		items = [],
		i;

	for (i = startIndex; i < startIndex + fetchParams.per_page; i++) {
		if (i <= totalItems) {
			var types = ['demo', 'prod'];
			items.push({ type: types[Math.floor(Math.random()*2)], text: 'cell '+ i});
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
