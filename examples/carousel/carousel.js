var carousel = mvc({

    values: {
        speed: 2000,
        $panels: $('.simple.carousel .panels').children(),
        $controls: $('.simple.carousel .controls'),
    },
    
    models: {

        items: (function() {

            var items,
                selected;

            return {

                init: function() {
                    items = [];
                },

                add_item: function(item) {
                    items.push(item);
                },

                select: function(index) {
                    if(index > items.length - 1) {
                        index = 0;
                    }
                    else if(index < 0) {
                        index = items.length - 1;
                    }
                    
                    selected = index;
                    this.dispatch('item_selected', [selected]);
                },

                get_selected_index: function() {
                    return selected;
                },

                next: function() {
                    this.select(selected + 1);
                },

                prev: function() {
                    this.select(selected - 1);
                }
            }

        })()
    },
    
    views: {

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
                });
            }
        }

    },

    controllers: {

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

    },

    exports: {

        next: function() {
            this.dispatch('select_next');
        },

        prev: function() {
            this.dispatch('select_prev');
        }

    }

});
