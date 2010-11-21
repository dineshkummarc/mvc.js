var shopping_cart = mvc.create(function() {
    
    // Map values
    this.map.singleton('shipping', 5);
    
    // Map models
    this.map.model('cart', require('model/cart').cart_model);
    
    // Map views
    this.map.controller('map_views', require('controller/startup').map_views);
    
    // Map controllers
    this.map.controller('add_item', require('controller/additem').add_item, ['cart']);
    
    this.dispatch('map_views');
    
});
