exports.cart_model = (function() {
    
    var items;
    
    return {
        init: function() {
            items = {}
        },
        
        add_item: function(item) {
            if(items[item.name]) {
                items[item.name].quantity++;
            }
            else {
                items[item.name] = item;
            }
            
            this.dispatch('item_added', [item]);
        },
        
        get_total_price: function() {
            var price = 0;
            
            _.each(items, function(item) {
                price += (item.price * item.quantity);
            });
            
            return '£' + price.toString();
        }
    }
    
})();