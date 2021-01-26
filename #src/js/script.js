$(document).ready(function(){

    // ПОКАЗ МОДАЛКИ В СЛУЧАЕ УСПЕШНОЙ ОТПРАВКИ ФОРМЫ
    // if (document.cookie.split(';').indexOf('isFormSent=1')!=-1){
    //     alert('form');
    // }
    // $('.modal-success').magnificPopup('open');
    // console.dir(document.cookie.split('; '));

    // ЛИПКАЯ ШАПКА
    let sticky = new Sticky('.header');

    // ПЛАВНЫЙ СКРОЛЛ К ЯКОРЮ
    // $.scrollSpeed(500, 800, 'easeOutCubic');

    // ОТКРЫТИЕ МОДАЛОК
    $('a[href="#modal-callback"], a[href="#modal-request"]').magnificPopup({
        type:'inline',
        showCloseBtn:false,
        mainClass: 'mfp-fade'
      });

    // ЗАКРЫТИЕ ОТКРЫТОЙ МОДАЛКИ
    $('.modal__cross').on('click', function(){
        $.magnificPopup.close();
    });   

    // ВАЛИДАЦИЯ ФОРМ
    function isPhoneValid(phone){
        const pattern = "^\\+7 \\(\\d{3}\\) \\d{3}-\\d{2}-\\d{2}$";
        const regex = new RegExp(pattern, "g");
        return regex.test(phone);
    };

    function isEmailValid(email){
        const regex=/^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/;
        return regex.test(email);
    }

    $('.callback-form, .request-form').on('submit', function(event){
        let errorCount = 0;
        $(this).find('.required').each(function(){
            $this = $(this);
            if ($this.val()==''){
                $this.addClass('error').attr('placeholder', 'Поле не заполнено');
                errorCount++;
            }
            if ($this.hasClass('required-phone') && !isPhoneValid($this.val())){
                $this.addClass('error').attr('placeholder', 'Некорректный телефон').val('');
                errorCount++;
            }
                
            if ($this.hasClass('required-email') && !isEmailValid($this.val())){
                $this.addClass('error').attr('placeholder', 'Некорректный email').val('');
                errorCount++;
            }  
        });
        console.log(errorCount);
        if (errorCount>0)
            event.preventDefault()
        else
            document.cookie = 'isFormSent=1';
    });

    $('.callback-form input, .request-form input').on('blur', function(){
        const $this = $(this);
        if ($this.hasClass('required') && $this.val()==''){
            $this.addClass('error').attr('placeholder', 'Поле не заполнено');
            return;
        }
        else {
            $this.removeClass('error');
        }
        if ($this.hasClass('required-phone') && !isPhoneValid($this.val())){
            $this.addClass('error').attr('placeholder', 'Некорректный телефон').val('');
            return;
        }
        else {
            $this.removeClass('error');
        }
        if ($this.hasClass('required-email') && !isEmailValid($this.val())){
            $this.addClass('error').attr('placeholder', 'Некорректный email').val('');
            return;
        }
        else {
            $this.removeClass('error');
        }
    });

    $('.callback-form input, .request-form input').on('focus', function(){
        $this = $(this);
        if ($this.hasClass('error'))
            $this.removeClass('error');
        if ($this.attr('name')=='name')
            $this.attr('placeholder', 'Ваше имя');
        if ($this.attr('name')=='phone'){
            $this.attr('placeholder', 'Ваш телефон');
            try{
                if ($this.closest('form').attr('id')=='callback-form'){
                    const phoneCallbackCleave = new Cleave('#phone-callback', {
                        prefix: '+7',
                        delimiters: [" (", ")", " ", "-", "-"],
                        blocks: [2, 3, 0, 3, 2, 2],
                        uppercase: true
                    });
                }
                else if ($this.closest('form').attr('id')==('request-form')){
                    const phoneRequestCleave = new Cleave('#phone-request', {
                        prefix: '+7',
                        delimiters: [" (", ")", " ", "-", "-"],
                        blocks: [2, 3, 0, 3, 2, 2],
                        uppercase: true
                    }); 
                }
            } catch(e){};
        };
        if ($this.attr('name')=='email')
            $this.attr('placeholder', 'Ваш email');
    });

    // БУРГЕР-МЕНЮ
    function mobNavToggle(){
        $(this).toggleClass('mobile-toggle_open');
        $('.mobile-nav').toggleClass('nav_opened');
        $('body').toggleClass('body_blocked');
    }
    $('.mobile-toggle').on('click', function(){
        mobNavToggle();
    });

    $('.mobile-nav a').on('click', function(){
        mobNavToggle();
    });

    // ПОДСВЕТКА ПРОСМАТРИВАЕМОГО РАЗДЕЛА В НАВИГАЦИИ
    function isElementInViewport (el) {
        const wt = $(window).scrollTop();
        const wh = $(window).height();
        const et = $(el).offset().top;
        const eh = $(el).outerHeight();
        const dh = $(document).height();   
        if (wt + wh >= et || wh + wt == dh || eh + et < wh){
            return true;
        }
        return false;
    }

    function setNav(){
        $('.first-screen, .exp, .profit, .contacts-block').each(function(){
            if (isElementInViewport($(this))){
                const name = $(this).prev().attr('name');
                $(`nav .active`).removeClass('active');
                $(`nav a[href="#${name}"]`).parent().addClass('active');
            }
        });
        if ($(window).scrollTop()==0){
            $(`nav .active`).removeClass('active');
            $(`nav :first-child`).addClass('active');
        }
    }

    $(window).on('scroll', function(){
        setNav();
    });

    // ПРОКРУТКА ДО ЯКОРЯ
    $("body").on('click', 'nav a[href*="#"]', function(e){
        const name = $(this).attr('href').substr(1);
        const selector = `a[name="${name}"]`;
        const offsetTop =  $(selector).offset().top;
        const fixedOffset = 100;
        $('html,body').stop().animate({ scrollTop: offsetTop - fixedOffset }, 1000);
        e.preventDefault();
        setNav();
        return false;
    });

})
