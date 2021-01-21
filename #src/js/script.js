$(document).ready(function(){
    $('a[href="#modal-request"]').fancybox({
        'overlayShow'   :   true
    });

    $('.modal-cross').on('click', function(e){
        e.preventDefault();
        $.fancybox.close();
    });
})
