define('MAF.media.Asset', function () {
	return function (id, title, poster, description, genre, date, size, duration, ageRating) {
		this.id = id;
		this.title = title;
		this.poster = poster;
		this.description = description;
		this.genre = genre;
		this.date = date;
		this.size = size;
		this.duration = duration;
		this.ageRating = ageRating;
	};
});
