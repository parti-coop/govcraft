//= require jquery
//= require govcraft_ujs
//= require jquery_ujs
//= require bootstrap
//= require unobtrusive_flash
//= require unobtrusive_flash_bootstrap
//= require imagesloaded.pkgd
//= require masonry.pkgd
//= require redactor2_rails/config
//= require redactor
//= require redactor2_rails/langs/ko
//= require fontcolor
//= require jssocials
//= require chartkick
//= require select2
//= require jquery.slick
//= require kakao
//= require mobile-detect
//= require magnific-popup
//= require jquery.validate
//= require jquery.validate.messages_ko
//= require jquery.webui-popover
//= require cocoon
//= require trianglify
//= require moment
//= require bootstrap-datetimepicker


UnobtrusiveFlash.flashOptions['timeout'] = 300000;

$(document).imagesLoaded( { }, function() {

  // trianglify
  $('.pattern-trianglify').each(function(i, elm) {
    $elm = $(elm);

    var pattern = Trianglify({
      width: 1200,
      height: 600,
      seed: $(elm).data('trianglify-seed')
    });

    $elm.css("background-image", "url('" + pattern.png() + "')");
  });


  if ( $(window).width() > 739 ) {
    //masonry
    var options = {}
      $('.masonry-container').masonry();
    }

    // Initialize Redactor
    $('.redactor').redactor({
      buttons: ['format', 'bold', 'italic', 'deleted', 'lists', 'image', 'file', 'link', 'horizontalrule'],
      callbacks: {
        imageUploadError: function(json, xhr) {
          UnobtrusiveFlash.showFlashMessage(json.error.data[0], {type: 'notice'})
        }
      },
      toolbarFixed: true,
      plugins: ['fontcolor']
    });
    $('.redactor .redactor-editor').prop('contenteditable', true);
    $('select.dropdown').dropdown();
  }
);

// Kakao Key
Kakao.init('6a30dead1bff1ef43b7e537f49d2f655');

$(function(){
  $(".slick").slick();

  $("#js-published_at").datetimepicker({
    format: 'YYYY-MM-DD'
  });


  $('.share-box').each(function(i, elm) {
    var $elm = $(elm);
    $elm.jsSocials({
      // 윈도우 resize 할때 다시 로딩을 방지합니다.
      showLabel: false,
      showCount: false,

      shares: [{
          renderer: function() {
            var $result = $("<div>");

            var script = document.createElement("script");
            script.text = "(function(d, s, id) {var js, fjs = d.getElementsByTagName(s)[0]; if (d.getElementById(id)) return; js = d.createElement(s); js.id = id; js.src = \"//connect.facebook.net/ko_KR/sdk.js#xfbml=1&version=v2.3\"; fjs.parentNode.insertBefore(js, fjs); }(document, 'script', 'facebook-jssdk'));";
            $result.append(script);

            $("<div>").addClass("fb-share-button")
                .attr("data-layout", "button_count")
                .appendTo($result);

            return $result;
          }
        }, {
          renderer: function() {
            var $result = $("<div>");

            var script = document.createElement("script");
            script.text = "window.twttr=(function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],t=window.twttr||{};if(d.getElementById(id))return t;js=d.createElement(s);js.id=id;js.src=\"https://platform.twitter.com/widgets.js\";fjs.parentNode.insertBefore(js,fjs);t._e=[];t.ready=function(f){t._e.push(f);};return t;}(document,\"script\",\"twitter-wjs\"));";
            $result.append(script);

            $("<a>").addClass("twitter-share-button")
                .text("Tweet")
                .attr("href", "https://twitter.com/share")
                .appendTo($result);

            return $result;
          }
        }, {
          image_url: $elm.data('shareImage'),
          renderer: function(options) {
            var md = new MobileDetect(window.navigator.userAgent);
            if(!md.mobile()) {
              return;
            }
            if(!this.image_url) {
              return;
            }
            var $result = $("<div class='kakao-share-button'><span class='kakao-share-button--label'>카카오톡</span></div>");

            var url = this.url;
            var text = this.text;
            var image_url = this.image_url;
            var image_width = '300';
            var image_height = '155';

            Kakao.Link.createTalkLinkButton({
              container: $result[0],
              label: text,
              image: {
                src: image_url,
                width: image_width,
                height: image_height
              },
              webLink: {
                text: '우주당에서 보기',
                url: url
              }
            });

            return $result;
          }
        }
      ]
    });
  });

  $('.js-top-menu i').click(function(){
    $('#header-container').toggleClass('drop-main-menu');
  })

  $('.js-achv-folding-category').click(function(){
    $(this).next('.menu').toggle();
    $(this).find('.fa').toggle();
  })

  $('#communities .js-tab-toggle').click(function(){
    var flag = $(this).hasClass('active');
    if(!flag){
      $('.toggle-body').toggle();
      $('.tab-title div').toggleClass("active");
    }
  })

  $('.post-block__body iframe').addClass('embed-responsive-item');
  $('.post-block__body iframe').parent().addClass('embed-responsive embed-responsive-16by9');
  $('[data-toggle="tooltip"]').tooltip();
  AOS.init();

  $('.gov-action-link').on('click', function(e) {
    var href = $(e.target).closest('a').attr('href');
    if (href && href != "#") {
      return true;
    }
    var url = $(e.currentTarget).data('url');
    window.open(url, '_blank');
  });

  $('.js-select2').select2();
  $('.gov-action-people-select').select2({
    ajax: {
      url: "/people/search.json",
      dataType: 'json',
      delay: 250,
      data: function (params) {
        return {
          q: params.term
        };
      },
      processResults: function (data, params) {
        return { results: data };
      },
      cache: true
    },
    escapeMarkup: function (markup) { return markup; }, // let our custom formatter work
    minimumInputLength: 1,
    templateResult: function (person) {
      if (person.loading) return person.text;
      return "<img src='" + person.image_url + "' style='max-height: 2em'/>" + person.text;
    },
    templateSelection: function (person) {
      if (person.loading) return person.text;
      return "<img src='" + person.image_url + "' style='max-height: 2em'/>" + person.text;
    },
  });

  $('.popup-youtube').magnificPopup({
    disableOn: 700,
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });

  // 폼 검증
  $.validator.addMethod("recaptcha", function(value, element) {
    if(typeof grecaptcha != 'undefined') {
      var recaptcha_id = $(element).data('recaptcha-id');
      return grecaptcha.getResponse(recaptcha_id).length > 0;
    }

    return true;
  }, '');

  $('.gov-action-form-validation').each(function(i, elm) {
    var $form = $(elm);

    $form.validate({
      ignore: ':hidden:not(.validate)',
      rules: {
        "hiddenRecaptcha": {
          recaptcha: true
        }
      },
      messages: {
        "hiddenRecaptcha": {
          recaptcha: "로봇이 아닌지 확인해 주세요."
        }
      },
      errorPlacement: function(error, $element) {
        if($element.attr('name') == 'hiddenRecaptcha') {
          error.insertAfter($element.closest('form').find('.gov-action-recaptcha'));
        } else {
          error.insertAfter($element);
        }
        $('.masonry-container').masonry();
      }
    });
  });

  $('.gov-action-sidbar').on('click', function(e) {
    $('#site-sidebar').sidebar('toggle');
  });

  $('.gov-action-popover').each(function(i, elm) {
    var $elm = $(elm);

    var options = {}
    var style = $elm.data('style');
    if(style) {
      options['style'] = style;
    }

    $elm.webuiPopover(options);
  });


  // agenda theme bootstrap tab & location hash
  $('a.js-agenda-theme-tab[data-toggle="tab"]').on('shown.bs.tab', function (e) {
    $('.tab-pane.active .js-loading').show();
    $('.tab-pane.active .js-tab-content').hide();

    window.location.hash = e.target.hash.substr(1) ;
    $('html, body').animate({scrollTop: ($('.tab-content').first().offset().top - 40)});

    var agenda_id = $(this).data("agenda-id");
    var href = $(this).attr("href");
    $.ajax({
      type: "GET",
      url: href,
      data: { agenda_id: agenda_id },
      dataType: "script",
      complete: function() {
        $('html, body').animate({scrollTop: ($('.tab-content').first().offset().top - 40)});
      }
    });
  });

  if (location.hash !== '' && location.hash.startsWith('#agenda_tab_')) {
    $('.tab-pane.active .js-tab-content').hide();
    var agenda_id = location.hash.replace('#agenda_tab_','');
    $('a.js-agenda-theme-tab[data-toggle="tab"][data-agenda-id="' + agenda_id + '"]').tab('show');
  }

  $('.js-close-modal').click(function(){
    $($(this).closest('.modal')).modal('hide');
  })
});

$(document).ajaxError(function (e, xhr, settings) {
  if(xhr.status == 500) {
    UnobtrusiveFlash.showFlashMessage('뭔가 잘못되었습니다. 곧 고치겠습니다.', {type: 'error'})
  } else if(xhr.status == 404) {
    UnobtrusiveFlash.showFlashMessage('어머나! 누가 지웠네요. 페이지를 새로 고쳐보세요.', {type: 'notice'})
  } else if(xhr.status == 401) {
    UnobtrusiveFlash.showFlashMessage('먼저 로그인해 주세요.', {type: 'notice'})
  }
});
