var video_player = mvc({

    imports: {
        carousel: carousel
    },

    /*

    values: {
        weekDays: ['Mon', 'Tue', 'Wed'...],
        shipping: 5.50,
        currency: '£'
    },

    urls: {
        '/': 'start_up',
        '/new': 'add_new_item',
        '#some_item': ['select', 'some_item']
    },

    plugins: {
        urls: '../plugins/url_mapper.js',
        state_machine: '../plugins/state_machine.js'
    },

    */

    models: {

        state: {
            facade: {
                select: function(state) {
                    console.log(state);
                }
            }
        }

    },

    views: {

        end_frame: {
            requires: ['carousel', 'state'],
            mediator: {
                init: function() {
                    var that = this;

                    this.carousel.on_select(function() {
                        console.log('new item was selected in the carousel');
                        that.state.select('carousel');
                    });

                    this.carousel.next();
                }
            }
        }

    }

});


