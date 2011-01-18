shopping_cart.views = {

    cart: (function() {
        var that,
            $product_list;
        
        return {
            cart_view: '__inject__',
            cart: '__inject__',

            init: function() {
                that = this;
                $product_list = $(this.cart_view).find('ul');
                $price = $(this.cart_view).find('.total_cost .price');
            },

            item_added: function() {
                $product_list.empty();
                
                _.each(this.cart.get_current_items(), function(item) {
                    var quantity = item[2] > 1 ? ' x ' + item[2] : '';
                    
                    $product_list.append('<li><strong>' + item[0] + '</strong> ' + item[1] + quantity + '</li>');
                });
                
                $price.html(this.cart.get_total_price());
            }
        }
        
    })(),

    items: {
        items_view: '__inject__',

        init: function() {
            that = this;
            
            $(this.items_view).find('li').click(function() {
                that.dispatch('add_item', [this]);

                return false;
            });
        }
    }

}
