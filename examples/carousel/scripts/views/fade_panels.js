define(function() {

    return {
        element: $('.fade.carousel .panels'),
        requires: ['items'],
        mediator: (function() {

            return {

                init: function() {
                    var that = this,
                        panels = $(this.element).children();
                    
                    panels.each(function() {
                        $(this).hide();
                        that.items.add_item(this);
                    });

                    this.items.select(0);
                },

                item_selected: function(index) {
                    var panels = $(this.element).children();

                    panels.each(function() {
                        $(this).hide();
                    });
                    
                    $(panels[index]).fadeIn();
                }   

            }
        })()
    }

});
