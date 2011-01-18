carousel.controllers = {

    select_next: {
        items: '__inject__',
        command: function() {
            var index = this.items.get_selected_index() + 1;
            this.items.select(index);
        }
    },

    select_prev: {
        items: '__inject__',
        command: function() {
            var index = this.items.get_selected_index() - 1;
            this.items.select(index);
        }
    }

}
