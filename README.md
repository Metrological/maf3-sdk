Metrological App SDK
====================

The Metrological Application Framework is developed to build Apps for TV devices with a webbrowser enabled on the device.

Create an App
-------------

Create a folder in the "apps" folder using an unique identifier

	mkdir -p apps/com.CompanyName.app.AppName

Create the initial structure

	cd apps/com.CompanyName.app.AppName
	mkdir -p Contents/Images
	mkdir -p Contents/Javascript
	mkdir -p Contents/Localization
	touch Contents/Localization/en-EU.strings
	touch Contents/Javascript/init.js
	touch Contents/metadata.json

Example Contents/metadata.json

	{
  		"identifier": "com.CompanyName.app.AppName",
  		"name": "My App",
  		"version": "1.0.0",
  		"author": "My Name",
  		"company": "My Company",
  		"copyright": "Copyright Company",
  		"description": "A description of the App",
  		"scripts": "Javascript/init.js",
  		"images": {
  			"header": {
	  			"normal": "Images/header.png",
  				"focused": "Images/header-focused.png"
	  		},
  			"about": "Images/about.png",
	  		"icon": {
  				"200x200": "Images/icon.png",
  				"280x166": "Images/snippet.png"
  			}
  		}
  	}


Example Contents/Javascript/init.js which is the first script loaded from the metadata.json (scripts)

	include("Javascript/Views/MainView.js");
	include("Javascript/Views/AboutView.js");
	include("Javascript/Views/IconView.js");

	MAF.application.init({
		views: [
			{ id: 'view-MainView', viewClass: MainView },
			{ id: 'view-AboutView', viewClass: AboutView },
			{ id: 'view-IconView', viewClass: IconView }
		],
		defaultViewId: 'view-MainView',
		settingsViewId: 'view-AboutView'
	});

Adding the App
--------------

In the "index.html" add your App identifier to the "apps" array of the profile in the MAE object

	apps: [
		"com.CompanyName.app.AppName",
		"com.metrological.widget.Example"
	]

Contribute
----------

**Would you like to join our team?** Drop your details at recruitment@metrological.com 
