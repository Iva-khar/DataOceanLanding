// import * as THREE from 'three';
// import DOTS from 'vanta/dist/vanta.dots.min';
import './scss/main.scss';
import $ from 'jquery';
import 'jquery-validation';
import {t, changeLang, onChangeLang} from './localization'
import SubscriptionsTable from './subscriptions-table'
import 'jquery.cookie';

onChangeLang(() => {
    $('#name')[0].placeholder = t('placeholderName');
    $('#surname')[0].placeholder = t('placeholderLastName');
    $('#question')[0].placeholder = t('placeholderQuestion');
    $('#username_pay')[0].placeholder = t('placeholderName');
    $('#surname_pay')[0].placeholder = t('placeholderLastName');
    $('#question_pay')[0].placeholder = t('placeholderPayNote');
    $('#password_login')[0].placeholder = t('password');
})

$(document).ready(() => {
    setInterval(() => {
        setTimeout(() => {
            $('#explore').addClass('transparency')
            setTimeout(() => {
                $('#explore').removeClass('transparency')
            }, 1500)
        }, 1000);

        setTimeout(() => {
            $('#build').addClass('transparency')
            setTimeout(() => {
                $('#build').removeClass('transparency')
            }, 1500)
        }, 2500);

        setTimeout(() => {
            $('#develop').addClass('transparency')
            setTimeout(() => {
                $('#develop').removeClass('transparency')
            }, 1500)
        }, 4000);
    }, 5500);
});


$(document).ready(() => {
  // const _sendMailBtn = document.querySelector(".sendmail-btn");
  // _sendMailBtn.onclick = (e) => {
  //   e.preventDefault();
  //   const _form = document.forms.sendmail;
  //   console.log("Do sendmail");
  //   return false;
  // };
});


$(document).ready(() => {
  // const _subscribeForms = document.querySelectorAll(".do-subscribe");
  // _subscribeForms.forEach((form) => {
  //   const _subscribeBtn = form.querySelector(".subscribe-btn");
  //   _subscribeBtn.onclick = (e) => {
  //     e.preventDefault();
  //     console.log("Do Subscribe");
  //   };
  // });
});

const getSchema = () => {
    return {
        errorClass: "input_error",
        rules: {
            username: {
                required: true,
                minlength: 2,
            },
            surname: {
                required: true,
                minlength: 2,
            },
            email: {
                required: true,
                email: true,
            },
            phone: {
                number: true,
                minlength: 10,
                maxlength: 15
            },
            question: {
                required: true,
            },
        },
        messages: {
            username: {
                required: t('usernameRequired'),
                minlength: t('minSymbols'),
            },
            surname: {
                required: t('surnameRequired'),
                minlength: t('minSymbols'),
            },
            email: {
                required: t('emailRequired'),
                email: t('emailCorrect'),
            },
            phone: {
                number: t('phoneNumber'),
                minlength: t('minSymbols'),
                maxlength: t('maxSymbols'),
            },
            question: {
                required: t('questionAsk'),
            }
        }
    }
};

$('#contact-form').submit(function(event){
    event.preventDefault();
    let form = $(this);
    form.validate(getSchema())
    if (!form.valid()) {
        return
    }

    let phoneNumber = '';
    if (this.phone.value) {
        phoneNumber = ' Мій контактний номер: '  + this.phone.value;
    }

    let data = {
        name: this.username.value + ' ' + this.surname.value,
        email: this.email.value,
        subject: this.username.value + ' ' + this.surname.value,
        message: this.question.value + phoneNumber,
    }

    $.ajax({
        url: process.env.DO_BACKEND_HOST + '/api/landing_mail/',
        type: "POST",
        dataType: "json",
        data: data,
        success: function(data, status, xhr) {
            if (xhr.status !== 200) {
                return
            }
            alert(t('messageSuccess'));
            form[0].reset();
        },
        error: function (jqXhr, textStatus, errorMessage) {
            if (jqXhr.status === 400 || jqXhr.status === 503) {
                alert(t('messageError'));
            }
            else {
                alert(t('messageErrorUnknown') + errorMessage);
            }
        }
    })
});

$('#change-lang').click(function(event) {
    event.preventDefault();
    let langUser = 'uk';
    if (localStorage.getItem('lang') === 'uk') {
        langUser = 'en';
    }
    changeLang(langUser);
});

$('.js-link-platform').on('click', function () {
    window.open(process.env.DO_FRONTEND_HOST + '/system/home/?lang=' + localStorage.getItem('lang'));
});

$('.link-cpk').on('click', function () {
    window.open('https://pep.org.ua/'+ localStorage.getItem('lang'));
});

$('#api-docs').on('click', function () {
    window.open(process.env.DO_BACKEND_HOST + '/schema/redoc/');
});

$('#api-button').on('click', function () {
    window.open(process.env.DO_FRONTEND_HOST + '/system/home/?lang=' + localStorage.getItem('lang'));
});

$('#menu-btn').on('click', function (event) {
    event.preventDefault();
    $('#navigation').fadeToggle();
});

const getPaySchema = () => {
    return {
        errorClass: "input_error",
        rules: {
            username_pay: {
                required: true,
                minlength: 2,
            },
            surname_pay: {
                required: true,
                minlength: 2,
            },
            email_pay: {
                required: true,
                email: true,
            }
        },
        messages: {
            username_pay: {
                required: t('usernameRequired'),
                minlength: t('minSymbols'),
            },
            surname_pay: {
                required: t('usernameRequired'),
                minlength: t('minSymbols'),
            },
            email_pay: {
                required: t('emailRequired'),
                email: t('emailCorrect'),
            }
        }
    }
};

$('#pay-form').on('submit', function(event){
    event.preventDefault();
    let payForm = $(this);
    payForm.validate(getPaySchema())
    if (!payForm.valid()) {
        return
    }
    let payData = {
        name: this.username_pay.value + ' ' + this.surname_pay.value,
        email: this.email_pay.value,
        subject: this.username_pay.value + ' ' + this.phone_pay.value, 
        message: this.question_pay.value ?  t('note') + ': ' + this.question_pay.value : t('nomark'),
    }
    $('.open-payform').fadeOut();
    $.ajax({
        url: process.env.DO_BACKEND_HOST + '/api/landing_mail/',
        type: "POST",
        dataType: "json",
        data: payData,
        success: function(data, status, xhr) {
            if (xhr.status !== 200) {
                return
            }
            alert(t('messageSuccess'));
            payForm[0].reset();
        },
        error: function (jqXhr, textStatus, errorMessage) {
            if (jqXhr.status === 400 || jqXhr.status === 503) {
                alert(t('messageError'));
            }
            else {
                alert(t('messageErrorUnknown') + errorMessage);
            }
        }
    })
});

$('#payform-close').on('click', function () {
    $('.open-payform').toggle();
});


$('#terms_and_conditions').on('click', function () {
    if (localStorage.getItem('lang') === 'uk') {
        location.assign(process.env.DO_FRONTEND_HOST + '/docs/TermsAndConditionsUk.html');
    } else {
        location.assign(process.env.DO_FRONTEND_HOST + '/docs/TermsAndConditionsEn.html');
    }
});

$('#privacy_policy').on('click', function () {
    if (localStorage.getItem('lang') === 'uk') {
        location.assign(process.env.DO_FRONTEND_HOST + '/docs/PrivacyPolicyUk.html');
    } else {
        location.assign(process.env.DO_FRONTEND_HOST + '/docs/PrivacyPolicyEn.html');
    }
});

new SubscriptionsTable('#subs-table').init()

$('#login').on('click', function () {
    $('.login-modal').toggle();
    $(document).on('click', function (e) {
        if ($(e.target).is('.login-modal')) {
            $('.login-modal').hide();
        }
    });
});

const getLoginSchema = () => {
    return {
        errorClass: "input_error",
        rules: {
            email: {
                required: true,
                email: true,
            },
            password: {
                minlength: 6,
                required: true,
            },
        },
        messages: {
            email: {
                required: t('emailRequired'),
                email: t('emailCorrect'),
            },
            password: {
                minlength: t('questionAsk'),
                required: t('questionAsk'),
            }
        }
    }
};

$('#loginform').on('submit', function(event){
    event.preventDefault();
    let loginForm = $(this);
    loginForm.validate(getLoginSchema());
    if (!loginForm.valid()) {
        return
    }
    $('#error_login').html('');

    $.ajax({
        url: process.env.DO_BACKEND_HOST + '/api/rest-auth/login/',
        type: 'POST',
        data: {
            email: this.email_login.value,
            password: this.password_login.value,
        },
        headers: {
            ['Accept-Language']: localStorage.getItem('lang'),
        },
        success: function(data, status, xhr) {
            if (xhr.status !== 200) {
                return
            }
            $.cookie('token', data.key, { maxAge: 604800 });
            $.cookie('firstname', data.user.first_name, { maxAge: 604800 });
            $.cookie('lastname', data.user.last_name, { maxAge: 604800 });
            $.cookie('email', data.user.email, { maxAge: 604800 });
            document.location = process.env.DO_FRONTEND_HOST + '/system/home/?lang=' + localStorage.getItem('lang');
        },
        error: function (jqXHR, textStatus, errorMessage) {
            var errMessage = JSON.parse(jqXHR.responseText)[Object.keys(JSON.parse(jqXHR.responseText))[0]][0];
            $('#error_login').html(errMessage);
        }
    })
})

$('#forgot_password').on('click', function () {
    document.location = process.env.DO_FRONTEND_HOST + '/auth/restore-pass/?lang=' + localStorage.getItem('lang');
});

// $('#signup').on('click', function () {
//     $('.signup-modal').toggle();
//     $(document).on('click', function (e) {
//         if ($(e.target).is('.signup-modal')) {
//             $('.signup-modal').hide();
//         }
//     });
// });

$(document).ready(() => {
    if (!($.cookie('firstname')) && !($.cookie('lastname')) ) {
        return
    } else {
        $('#login').replaceWith(/*html*/`
        <span class="user_profile">
            <ion-icon class="profile_icon" name="person-circle-outline"></ion-icon>
            <a class="link link_start">
                ${$.cookie('firstname')} ${$.cookie('lastname')}
            </a>
            <ion-icon class="arrow_icon" name="chevron-down-outline"></ion-icon>
        </span>
        <ul class="submenu">
            <li id="user-profile" class="submenu_item">
                <a class="link link_start">
                    <span lang="uk">Мій кабінет</span>
                    <span lang="en">My profile</span>
                </a>
            </li>
            <li id="logout" class="submenu_item">
                <a class="link link_start ">
                    <span lang="uk">Вийти</span>
                    <span lang="en">Log out</span>
                </a>
            </li>
        </ul>
        `)
        $('#signup').hide();
    }
    
    $('#user-profile').on('click', function () {
        document.location = process.env.DO_FRONTEND_HOST + '/system/profile/projects/?lang=' + localStorage.getItem('lang');
    });

    $('#logout').on('click', function() {
        $.removeCookie('token');
        $.removeCookie('firstname');
        $.removeCookie('lastname');
        $.removeCookie('email');
        document.location.reload();
    })
});

