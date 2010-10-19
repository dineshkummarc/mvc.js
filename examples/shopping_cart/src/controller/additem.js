exports.add_item = function(item) {
    
    this.product.name = $(item).html();
    this.product.price = 12.99;
    this.product.quantity = 1;
    
    this.cart.add_item(this.product);
}