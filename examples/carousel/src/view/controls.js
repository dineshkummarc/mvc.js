exports.controls_view = (function() {
	
	var that;

	return {

		dependencies: ['items'],

		init: function() {
			that = this;
	
			$(this.element).find('a').click(function() {
				var action = $(this).attr('href').substr(1);
				that.items[action]();
			});
		}

	}

})();
