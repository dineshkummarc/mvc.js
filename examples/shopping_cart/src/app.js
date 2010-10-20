var shopping_cart = mvc.create(function() {
    
    // Map values
    this.map.value('shipping', 5);
    this.map.value('highlight_colour', '#ff0000');
    
    // Map instances
    this.map.instance('product', require('model/vo/product').product);
    
    // Map models
    this.map.singleton('cart', require('model/cart').cart_model);
    
    // Map views
    this.map.event('map_views', require('controller/startup').map_views);
    
    // Map controllers
    this.map.event('add_item', require('controller/additem').add_item, ['cart', 'product']);
    
    this.dispatch('map_views');
    
});