exports.items_view = (function() {
    
    var that;
    
    return {
        init: function() {
            that = this;
            
            $(this.element).find('li').click(function() {
                that.events.dispatch('add_item', [this]);
            });
        }
    }
    
})();