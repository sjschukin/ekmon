(function ($, Drupal) {
  "use strict";
  Drupal.behaviors.drupalexp_sticky = {
    attach: function (context) {
      $('.dexp-sticky', context).once('sticky').each(function () {
        var $this = $(this);
        var $stick_wrapper = $('<div>').addClass('sticky-wrapper');
        $this.wrap($stick_wrapper);
        $this.affix({
          offset: {
            top: function () {
              var $return = $this.parent().offset().top -
                parseInt($('body').css('paddingTop')) + 1;
              $('.dexp-sticky.affix').not($this).each(function () {
                if (($(this).hasClass('unsticky-mobile') &&
                  $(window).width() < 992) === false) {
                  $return = $return - $(this).parent().height();
                }
              });
              return $return;
            }
          }
        });
        $this.parent().height($this.height());
        $this.on('affixed.bs.affix', function () {
          $this.parent().height($this.height());
          $this.css({
            maxWidth: function () {
              return $(this).parent().width()
            },
            top: function () {
              var $return = parseInt($('body').css(
                'paddingTop'));
              $('.dexp-sticky.affix').not($this).each(
                function () {
                  if (($(this).hasClass('unsticky-mobile') &&
                    $(window).width() < 992) === false) {
                    $return = $return + $(this).parent().height();
                  }
                });
              return $return;
            }
          });
        }).on('affix-top.bs.affix', function () {
          $(this).parent().height('auto');
        });
        setTimeout(function () {
          if ($this.hasClass('affix')) {
            $this.trigger('affixed.bs.affix');
          }
        }, 1000);
      });
      $(window).once('dexp-resize').each(function(){
        $(window).on('resize', function(){
          $('.dexp-sticky').each(function(){
            $(this).css({
              maxWidth: $(this).parent().width()
            });
          });
        });
      });
    }
  };
})(jQuery, Drupal);
