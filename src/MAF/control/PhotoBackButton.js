/**
 * Metrological Application Framework 3.0 - SDK
 * Copyright (c) 2013  Metrological
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
define('MAF.control.PhotoBackButton', function () {
	var fitPhoto = function () {
		this.aspectSizeMax(Math.min(this.width, this.height));
	};

	return new MAF.Class({
		ClassName: 'ControlPhotoBackButton',

		Extends: MAF.control.BackButton,

		createContent: function () {
			this.parent();
			this.photo = new MAF.element.Image({
				ClassName: (this.config.ClassName || this.ClassName) + 'Image'
			}).appendTo(this);

			fitPhoto.subscribeTo(this.photo, 'onLoaded', this.photo);

			this.photo.setSources(this.config);
		},

		setSource: function (source) {
			return this.photo.setSource(source);
		},

		setSources: function (sources) {
			return this.photo.setSources(sources);
		}
	});
}, {
	ControlPhotoBackButton: 'ControlButton',
	ControlPhotoBackButtonImage: {
		styles: {
			vAlign: 'center',
			hOffset: 100,
			width: 40,
			height: 40
		}
	}
});
