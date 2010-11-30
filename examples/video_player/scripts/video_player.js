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
                    this.carousel.next();
                }
            }
        }

    }

});


