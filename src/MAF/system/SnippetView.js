define('MAF.system.SnippetView', function () {
	return new MAF.Class({
		ClassName: 'SnippetView',
		Extends: MAF.system.BaseView,
		viewType: 'SNIPPET'
	});
}, {
	SnippetView: {
		styles: {
			width: '470px',
			height: '166px'
		}
	}
});
