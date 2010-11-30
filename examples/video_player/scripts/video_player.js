var video_player = mvc({

    imports: {
        carousel: carousel
    },

    models: {

        state: {
            facade: {}
        }

    },

    views: {

        end_frame: {
            requires: ['carousel'],
            mediator: {
                init: function() {
                    this.carousel.on_select(function() {
                        console.log('new item was selected in the carousel');
                    });

                    this.carousel.next();
                }
            }
        }

    }

});


