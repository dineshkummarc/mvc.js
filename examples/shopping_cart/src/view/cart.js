exports.cart_view = (function() {
    
    var that;
    
    return {
        dependencies: ['cart'],
        
        init: function() {
            that = this;
        },
        
        item_added: function(item) {
			if(item.quantity === 1) {
				$(this.element).find('ul').append('<li><strong>' + item.artist + '</strong> ' + item.title + '</li>').end()
	                .find('.total_cost .price').html(this.cart.get_total_price());
			}
        }
    }
    
})();