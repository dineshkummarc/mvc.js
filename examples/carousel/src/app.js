var carousel = {

    config: {
        speed: 2000,
        $panels: $('.simple.carousel .panels').children(),
        $controls: $('.simple.carousel .controls'),
    },
    
    exports: {

        next: function() {
            this.dispatch('select_next');
        },

        prev: function() {
            this.dispatch('select_prev');
        }

    }

}
