define(function() {

    return {

        element: $('.cart'),
        requires: ['cart'], 
        mediator: (function() {
            var that,
                $product_list;
            
            return {
                init: function() {
                    that = this;
                    $product_list = $(that.element).find('ul');
                    $price = $(this.element).find('.total_cost .price');
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
            
        })()

    }

});
