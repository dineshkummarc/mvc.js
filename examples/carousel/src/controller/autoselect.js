exports.auto_select = function(interval) {
	
	var that = this;

	setTimeout(function() {
		that.items.next();
		that.dispatch('auto_select', [interval]);
	}, interval);	

}
