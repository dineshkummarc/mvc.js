shopping_cart.models =  {

    cart: (function() {

        var items,
            shipping = 0;
        
        return {

            init: function() {
                items = {};
                shipping = 5;
            },
            
            add_item: function(item) {
                if(!items[item.title]) {
                    items[item.title] = item;
                }
                else { 
                    items[item.title].quantity += 1;
                }
                
                this.dispatch('item_added', [item]);
            },
            
            get_current_items: function() {
                var titles = _.map(items, function(item) {
                    return [item.artist, item.title, item.quantity];
                });
                
                return titles;
            },
            
            get_total_price: function() {
                var price = 0;

                _.each(items, function(item) {
                    price += (item.price * item.quantity);
                });
                
                price += shipping;
                
                return price.toFixed(2).toString();
            }

        }
        
    })()

}