exports.cart_view = (function() {
    
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
    
})();