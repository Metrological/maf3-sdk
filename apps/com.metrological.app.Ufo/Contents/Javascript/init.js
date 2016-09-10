include("Javascript/core/PointerManager.js");
include("Javascript/views/Pointer.js");

Theme.Fonts.add('Munro', 'Client/font/munrosmall-webfont');

MAF.application.init({
	views: [
		{ id: 'Pointer', viewClass: Pointer}
	],
	defaultViewId: 'Pointer'
});
