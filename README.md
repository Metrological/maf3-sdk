MAF SDK
=======

The Metrological Application Framework SDK enables you to develop TV Apps

Getting Started
---------------

The getting started, design guidelines and API docs can be found at [here](http://sdk.metrological.com)

Create an App
-------------

Create a folder in the "apps" folder using an unique identifier

	mkdir -p apps/com.company.app.AppName

Create the initial structure

	cd apps/com.company.app.AppName
	mkdir -p Contents/Images
	mkdir -p Contents/Javascript
	mkdir -p Contents/Localization
	touch Contents/Localization/en-EU.strings
	touch Contents/Javascript/init.js
	touch Contents/metadata.json

Example Contents/metadata.json

	{
		"identifier": "com.company.app.AppName",
		"name": "My App",
		"version": "1.0.0",
		"author": "My Name",
		"company": "My Company",
		"copyright": "Copyright Company",
		"description": "A description of the App",
		"keywords": "video funny kids music",
		"categories": [
			"video",
			"music",
			"kids"
		],
		"scripts": "Javascript/init.js",
		"images": {
			"header": {
				"normal": "Images/header.png",
				"focused": "Images/header-focused.png"
			},
			"about": "Images/about.png",
			"icon": {
				"192x192": "Images/icon.png"
			}
		}
	}


Example Contents/Javascript/init.js which is the first script loaded from the metadata.json (scripts)

	include("Javascript/Views/MainView.js");
	include("Javascript/Views/AboutView.js");
	
	MAF.application.init({
		views: [
			{ id: 'view-MainView', viewClass: MainView },
			{ id: 'view-AboutView', viewClass: AboutView }
		],
		defaultViewId: 'view-MainView',
		settingsViewId: 'view-AboutView'
	});

An empty template has been added into the SDK [here](apps/com.metrological.app.EmptyTemplate/Contents)

Adding the App
--------------

In the "index.html" add your App identifier to the "apps" array in the MAE object

	apps: [
		"com.company.app.AppName"
	]

Starting the server
-------------------

The SDK contains already a HTTP server using [Node.js](http://nodejs.org), please run the following commands from the command line:

	npm install
	NODE_PORT=8080 node sdk.js

The SDK can then be launched in Safari, Chrome or Firefox pointing it to http://localhost:8080

License
-------

Please read and agree the the [LICENSE](LICENSE) before using the SDK.

Contribute
----------

**Would you like to join our team?** Drop your details at recruitment@metrological.com 

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', '', 'auto');
  ga('send', 'pageview');

</script>

[![Analytics](https://ga-beacon.appspot.com/UA-97701940-1/maf3-sdk/readme?pixel)](https://git.io/maf3-sdk)
