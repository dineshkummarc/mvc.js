define(function() {

    return {
        requires: ['items'],
        command: function() {
            var index = this.items.get_selected_index() + 1;
            this.items.select(index);
        }
    }

});
