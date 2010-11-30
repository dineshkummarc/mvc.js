var video_player = mvc({

    imports: {
        carousel: carousel
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


