define(function() {

    return {
        element: $('.fade.carousel .controls'),
        requires: ['items'],
        mediator: (function() {

            return {

                init: function() {
                    var that = this;

                    $(this.element).find('a').click(function() {
                        var action = $(this).attr('href').substr(1);
                        that.items[action]();
                    });
                }

            }

        })()
    }

});
