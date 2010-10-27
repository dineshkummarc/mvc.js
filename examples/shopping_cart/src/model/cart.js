exports.cart_model = (function() {
    
    var items;
    
    return {
        dependencies: ['shipping'],
        
        init: function() {
            items = {};
        },
        
        add_item: function(item) {
			if(!items[item.title]) {
				items[item.title] = item;
			}
			else{ 
				items[item.title].quantity += 1;
			}
            
            this.dispatch('item_added', [item]);
        },
        
        get_total_price: function() {
            var price = 0;

            _.each(items, function(item) {
				console.log(item.quantity);
                price += (item.price * item.quantity);
            });
            
            price += this.shipping;
            
            return price.toFixed(2).toString();
        }
    }
    
})();