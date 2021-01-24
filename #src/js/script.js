$(document).ready(function(){

    // ЛИПКАЯ ШАПКА
    let sticky = new Sticky('.header');

    // ОТКРЫТИЕ МОДАЛОК
    $('a[href="#modal-callback"], a[href="#modal-request"]').magnificPopup({
        type:'inline',
        showCloseBtn:false
      });

    // ЗАКРЫТИЕ ТЕКУЩЕЙ МОДАЛКИ
    $('.modal__cross').on('click', function(){
        $.magnificPopup.close();
    });   

    //   $('.modal-success').magnificPopup('open');

    // function validateAll(){
    //     $(this)find
    // }

    function validatePhone(){
        const pattern = "^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$";
        const regex = new RegExp(pattern, "g");
    };

    function validateEmail(){}

    $('.request-form').on('submit', function(){
        console.log('ggg');
    });

    $('.request-form input').on('blur', function(){
        console.log('ggg');
    });

    try{
        let phoneCallbackCleave = new Cleave('#phone-callback', {
          prefix: '+7',
          delimiters: [" (", ")", " ", "-", "-"],
          blocks: [2, 3, 0, 3, 2, 2],
          uppercase: true
        });
        let phoneRequestCleave = new Cleave('#phone-request', {
            prefix: '+7',
            delimiters: [" (", ")", " ", "-", "-"],
            blocks: [2, 3, 0, 3, 2, 2],
            uppercase: true
          });
      } catch(e){}

})
