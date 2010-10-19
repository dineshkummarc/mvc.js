exports.additem = function(item) {
    var data = {
        name: $(item).html(),
        price: 12.99,
        quantity: 1
    };
    
    this.cart.add_item(data);
}