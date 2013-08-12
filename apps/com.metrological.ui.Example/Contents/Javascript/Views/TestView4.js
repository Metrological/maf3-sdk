var TestView4 = new MAF.Class({
	ClassName: 'TestView4',

	Extends: MAF.views.AboutBox,

	config: {
		pages: [
			{id: 'copyright', name: 'Copyright'}, 
			{id: 'tos', name: 'Terms of Service', srcString: 'TOS jhkjasjka sakjhkas hkjash kjahsk'}, 
			{id: 'privacy', name: 'Privacy'},
			new MAF.control.TextButton({label: 'Button(s) you can pass along',styles: {width: 588, vAlign: 'bottom'}})
		]
	}
});
