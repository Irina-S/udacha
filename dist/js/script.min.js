$(document).ready(function(){
    // Открытие модалок
    $('a[href="#modal-callback"], a[href="#modal-request"]').on('click', function(){
        let id = $(this).attr('href');
        $('body').addClass('blocked');
        $('.overlay').fadeIn(500);
        $(id).fadeIn(500);
    });

    // Закрытие всех модалок
    $('.modal__cross, .overlay').on('click', function(){
        $('.modal').fadeOut(500);
        $('.overlay').fadeOut(500);
        $('body').removeClass('blocked');
    });

})
