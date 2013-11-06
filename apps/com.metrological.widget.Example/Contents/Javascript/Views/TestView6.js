var TestView6 = new MAF.Class({
	ClassName: 'TestView6',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		var back = new MAF.control.BackButton({
			label: 'Profile'
		}).appendTo(this);

		var button1 = new MAF.control.TextButton({
			label: 'Id: ' + profile.id,
			disabled: true,
			styles: {
				vOffset: back.outerHeight + 1
			}
		}).appendTo(this);

		var button2 = new MAF.control.TextButton({
			label: 'Name: ' + profile.name,
			disabled: true,
			styles: {
				vOffset: button1.outerHeight + 1
			}
		}).appendTo(this);

		var button3 = new MAF.control.TextButton({
			label: 'Age Rating: ' + profile.ageRating,
			disabled: true,
			styles: {
				vOffset: button2.outerHeight + 1
			}
		}).appendTo(this);

		var button4 = new MAF.control.TextButton({
			label: 'Household Id: ' + profile.household,
			disabled: true,
			styles: {
				vOffset: button3.outerHeight + 1
			}
		}).appendTo(this);

		var button5 = new MAF.control.TextButton({
			label: 'Operator Id: ' + profile.operator,
			disabled: true,
			styles: {
				vOffset: button4.outerHeight + 1
			}
		}).appendTo(this);

		var button6 = new MAF.control.TextButton({
			label: 'Packages: ' + JSON.stringify(profile.packages),
			disabled: true,
			styles: {
				vOffset: button5.outerHeight + 1
			}
		}).appendTo(this);

		var button7 = new MAF.control.TextButton({
			label: 'Country: ' + profile.country + ' (' + profile.countryCode + ')',
			disabled: true,
			styles: {
				vOffset: button6.outerHeight + 1
			}
		}).appendTo(this);

		var button8 = new MAF.control.TextButton({
			label: 'City: ' + profile.city,
			disabled: true,
			styles: {
				vOffset: button7.outerHeight + 1
			}
		}).appendTo(this);

		var button9 = new MAF.control.TextButton({
			label: 'Language: ' + profile.language + ' (' + profile.languageCode + ')',
			disabled: true,
			styles: {
				vOffset: button8.outerHeight + 1
			}
		}).appendTo(this);

		var button10 = new MAF.control.TextButton({
			label: 'Has Pin (Locked): ' + String(profile.hasPIN()) + ' (' + String(profile.locked) + ')',
			disabled: true,
			styles: {
				vOffset: button9.outerHeight + 1
			}
		}).appendTo(this);

		var button11 = new MAF.control.TextButton({
			label: 'IP / MAC: ' + profile.ip + ' / ' + profile.mac,
			disabled: true,
			styles: {
				vOffset: button10.outerHeight + 1
			}
		}).appendTo(this);

		var button12 = new MAF.control.TextButton({
			label: 'Locale: ' + profile.locale,
			disabled: true,
			styles: {
				vOffset: button11.outerHeight + 1
			}
		}).appendTo(this);
	}
});
