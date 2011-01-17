define(function() {

    return {

        cart: '__inject__',

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
});
