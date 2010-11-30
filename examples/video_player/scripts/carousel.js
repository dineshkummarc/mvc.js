var carousel = {
    
    models: {
        items: {
            facade: (function() {

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
        }
    },
    
    views: {
        panels: {
            element: $('.simple.carousel .panels'),
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
                        
                        $(panels[index]).show();
                    }   

                }
            })()
        },

        controls: {
            element: $('.simple.carousel .controls'),
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
    },

    controllers: {
        select_next: {
            requires: ['items'],
            command: function() {
                var index = this.items.get_selected_index() + 1;
                this.items.select(index);
            }
        },

        select_prev: {
            requires: ['items'],
            command: function() {
                var index = this.items.get_selected_index() - 1;
                this.items.select(index);
            }
        }
    },
    
    exports: {
        next: function() {
            console.log('carousel.next called');
        }
    }

};
