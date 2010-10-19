var shopping_cart = mvc.create(function() {
    
    // Map models
    this.map.singleton('cart', require('model/cart').cart_model);
    
    // Map views
    this.map.view($('.items'), require('view/items').items_view);
    this.map.view($('.cart'), require('view/cart').cart_view);
    
    // Map controllers
    this.map.event('add_item', require('controller/additem').add_item, ['cart']);
    
});