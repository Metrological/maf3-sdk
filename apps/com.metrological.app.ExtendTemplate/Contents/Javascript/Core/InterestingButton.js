var InterestingButton = new MAF.Class({
	//Extend custom button from MAF.control.TextButton
	Extends: MAF.control.TextButton,
	initialize: function(){
		//Set default styling which can be overwritten by key within the styles object from the view
		this.config.styles = Object.merge({
			width: 500,
			height: 100,
			borderRadius:50,
			backgroundColor: 'black',
			border: '3px solid white' 
		}, this.config.styles);
		
		//Set default textStyling which can be overwritten by key within the textStyles object from the view
		this.config.textStyles = Object.merge({
			anchorStyle: 'center'
		}, this.config.textStyles);
		
		//call MAF.control.TextButton's initialize
		this.parent();
	}
});