var API = {
	getArticle: function( id, callback, scope ) {

    // Normally you would have your API call here returning your data
		var tempData = {
			title: 'Lorem Ipsum',
			desc: '12/03/2017',
			body: 'Quisque pulvinar maximus interdum. Curabitur sed orci nec ex tincidunt sollicitudin. Aliquam eget sodales quam. Nunc turpis nulla, viverra in magna ut, molestie pellentesque diam. Morbi maximus ligula vitae consequat vulputate. Praesent vel sem nisi. Quisque eleifend, tortor sed aliquam rhoncus, diam ipsum rhoncus leo, vitae consectetur nunc sem sed tellus. Curabitur a convallis urna. Phasellus dictum odio at pharetra semper. Etiam efficitur ac turpis ut dapibus. Ut mattis sagittis enim, vel efficitur dui vulputate sit amet. In tristique nibh et odio semper, sed elementum metus accumsan. Aenean non nunc justo.'
		};

		callback.call( scope, tempData );
	}
};
