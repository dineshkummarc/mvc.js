exports.panels_view = (function() {
	
	var panels,
	    that;

	return {
		
		dependencies: ['items'],

		init: function() {
			that = this;

			panels = $(this.element).children();
			
			panels.each(function() {
				$(this).hide();
				that.items.add_item(this);
			});

			this.items.select(0);
		},

		item_selected: function(index) {
			panels.each(function() {
				$(this).hide();
			});

			$(panels[index]).show();
		}	

	}

})();
