var AssetsLoader = (function() {

    var imagesLoaded = false;
    var publicLoader = {
        images:{
        },
        load: function( cb, a ){
            var keys = Object.keys(a),
                queue = keys.length;

            // clean up existing images
            publicLoader.clean();
            imagesLoaded = false;

            Object.keys(a).forEach(function(el) {
                var image = new Image();
                image.src = a[el];
                image.onload = function () {
                    publicLoader.images[el] = this;
                    queue--;

                    if (queue === 0){

                        if (!imagesLoaded) {
                            imagesLoaded = true;
                            publicLoader.onLoaded(cb);
                        }
                    }
                };
            });
        },
        onLoaded: function(cb){
            return cb(publicLoader.images);
        },
        clean: function(){
            var k = Object.keys(publicLoader.images),
                i = 0, j = k.length;

            for( ; i < j; i++){
                delete publicLoader.images[k[i]];
            }


            return !!Object.keys(publicLoader.images);
        }
    };
    return publicLoader;
}());