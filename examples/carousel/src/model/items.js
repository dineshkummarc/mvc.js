exports.items_model = (function() {

	var items,
	    selected;

	return {

		init: function() {
			items = [];
			selected = 0;
		},

		add_item: function(item) {
			items.push(item);
		},

		select: function(index) {
			if(index > items.length - 1) {
				index = 0;
			}
			else if(index < 0) {
				index = items.length - 1;
			}
			
			selected = index;
			this.dispatch('item_selected', [selected]);
		},

		next: function() {
			this.select(selected + 1);
		},

		prev: function() {
			this.select(selected - 1);
		}
	}

})();
