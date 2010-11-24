define(function() {

    return {

        element: $('.items'),
        mediator: (function() {

            var that;
            
            return {
                init: function() {
                    that = this;
                    
                    $(this.element).find('li').click(function() {
                        that.dispatch('add_item', [this]);
                    });
                }

            }
            
        })()

    }

});
