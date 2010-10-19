var shopping_cart = mvc.create(function() {
    
    this.map.singleton('cart', (function() {
        
        var items;
        
        return {
            init: function() {
                items = {}
            },
            
            add_item: function(item) {
                items[item.name] = item;
                
                this.dispatch('item_added', [item]);
            },
            
            get_total_price: function() {
                var price = 0;
                
                _.each(items, function(item) {
                    price += item.price;
                });
                
                return '£' + price.toString();
            }
        }
        
    })());
    
    this.map.view($('.items'), (function() {
        
        var that;
        
        return {
            init: function() {
                that = this;
                
                $(this.element).find('li').click(function() {
                    that.events.dispatch('add_item', [this]);
                });
            }
        }
        
    })());
    
    this.map.view($('.cart'), (function() {
        
        var that;
        
        return {
            dependencies: ['cart'],
            
            init: function() {
                that = this;
            },
            
            item_added: function(item) {
                $(this.element).find('ul').append('<li>' + item.name + '</li>').end()
                    .find('.total_cost').html(this.cart.get_total_price());
            }
        }
        
    })());
    
    this.map.event('add_item', function(item) {
        var data = {
            name: $(item).html(),
            price: 12.99,
            quantity: 1
        };
        
        this.cart.add_item(data);
    }, ['cart']);
    
})