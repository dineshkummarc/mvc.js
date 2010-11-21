var shopping_cart = mvc({
   
    models: {
        cart: {
            proxy: (function() {
    
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
                        else{ 
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
    },

    views: {
        cart: {
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
        },

        items: {
            element: $('.items'),
            mediator: (function() {
    
                var that;
                
                return {
                    init: function() {
                        that = this;
                        
                        $(this.element).find('li').click(function() {
                            that.dispatch('add_item', [this]);
                        });
                    }
                }
                
            })()
        }
    },

    controllers: {
        add_item: {
            requires: ['cart'],
            command: function(item) {
                var album_info = $(item).find('img').attr('alt').split(' - ');
                
                var album = {
                    title: album_info[1],
                    artist: album_info[0],
                    price: 9.99,
                    quantity: 1
                }
                
                this.cart.add_item(album);
            }
        }
    }
 
});
