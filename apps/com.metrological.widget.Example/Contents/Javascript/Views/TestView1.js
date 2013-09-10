var TestView1 = new MAF.Class({
	ClassName: 'TestView1',

	Extends: MAF.system.SidebarView,

	initialize: function () {
		this.parent();
	},

	createView: function () {
		this.elements.button1 = new MAF.control.TextButton({
			label: 'Close App',
			events: {
				onSelect: function () {
					this.owner.dialog();
				}
			}
		}).appendTo(this);
	},

	focusView: function () {
		// Facebook.api(path, method, params, callback);
		Facebook.api('me', function (result) {
			log(result);
			var userId = Facebook.userId || 'me()';
			var query = JSON.stringify({
				"User": "SELECT uid, name, first_name, last_name, birthday, sex, hometown_location, work, pic_cover, pic, pic_square, pic_small, pic_big, friend_count, mutual_friend_count, likes_count, current_location, is_app_user, verified FROM user WHERE uid="+ userId,
				"Albums": "SELECT aid, owner, cover_object_id, cover_pid, name, object_id, size FROM album WHERE owner="+ userId
			});
			Facebook.api('/fql?q=' + escape(query), function (result) {
				log(result);
			});
		});
	},

	dialog: function () {
		new MAF.dialogs.Alert({
			title: 'Alert Dialog',
			message: 'Do you want to close the app?',
			focusOnCompletion: this.elements.button1,
			buttons: [
				{ label: 'Ok', callback: this.dialogCallback },
				{ label: 'Cancel', callback: this.dialogCallback }
			]
		}).show();
	},

	dialogCallback: function (event) {
		switch (event.selected.label) {
			case 'Ok':
				MAF.application.exit();
				break;
		}
	}
});
