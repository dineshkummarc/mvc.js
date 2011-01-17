define(function() {

    var that;

    return {

        items_view: '__inject__',

        init: function() {
            that = this;
            
            this.items_view.find('li').click(function() {
                that.dispatch('add_item', [this]);
            });
        }

    }

});
