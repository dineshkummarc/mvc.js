var video_player = mvc({

    plugins: {
        urls: url_mapper.js,
        states: state_machine
    },

    imports: {
        carousel: carousel
    },

    values: {
        week_days: ['Mon', 'Tue', 'Wed'...],
        shipping: 5.50,
        currency: '£'
    },
    
    urls: {
        '/': 'start_up',
        '/play': 'play',
        '/pause': 'pasue',
        '/stop': 'stop',
    },

    states: {
        'play': ['pause', 'stop'],
        'pause': ['play'],
        'stop': ['play']
    },

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
