exports.map_views = function() {
    this.map.view($('.items'), require('view/items').items_view);
    this.map.view($('.cart'), require('view/cart').cart_view);
}