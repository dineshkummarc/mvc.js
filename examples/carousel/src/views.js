carousel.views = {

    panels: {
        items: '__inject__',
        speed: '__inject__',
        $panels: '__inject__',
        
        init: function() {
            var that = this;
            
            this.$panels.each(function() {
                $(this).hide();
                that.items.add_item(this);
            });

            this.items.select(0);
        },

        item_selected: function(index) {
            this.$panels.each(function() {
                $(this).removeClass('selected');
                $(this).hide();
            });
            
            $(this.$panels[index]).fadeIn(this.speed, function() {
                $(this).addClass('selected');
            });
        }   
    },

    controls: {
        $controls: '__inject__',
        items: '__inject__',

        init: function() {
            var that = this;

            $(this.$controls).find('a').click(function() {
                var action = $(this).attr('href').substr(1);
                that.items[action]();

                return false;
            });
        }
    }

}
