shopping_cart.views = {

    items: {

        init: function() {
            var that = this;

            $(this.view).find('a').click(function() {
                var product = $(this).find('.product').html();
                var price_pattern = /(?:\£)(.+)/
                var price = price_pattern.exec($(this).find('.price').html());

                that.cart.add(product, price[1]);
            });      
        }

    }

}
