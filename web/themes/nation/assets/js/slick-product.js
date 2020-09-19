(function ($, Drupal, drupalSettings) {
  "use strict";
  Drupal.behaviors.dexp_nation_product_slick = {
    attach: function (context, settings) {
      $('.product-single .images-product').find('.field--name-field-product-image').not('.slick-initialized').slick({
        autoplay: false,
        dots: false,
        infinite: true,
        arrows: false,
        draggable: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        asNavFor: '.product-images-slider .field--name-field-product-image',
      });
      $('.product-single .product-images-slider').find('.field--name-field-product-image').not('.slick-initialized').slick({
        asNavFor: '.images-product .field--name-field-product-image',
        infinite: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        focusOnSelect: true,
        arrows: true,
        centerMode: true,
      });
      $('.product-single .images-product ').each(function () {
        var hasClass = $(this).find('a').hasClass('colorbox');
        if (hasClass) {
          $(this).find('a').addClass('cboxElement');
        }
      });
      $('.product-single .product-images-slider ').each(function () {
        $(this).find('a').removeClass('cboxElement');
        $(this).find('a').removeClass('colorbox');
        $(this).find('a').click(function (event) {
          event.preventDefault();
        });
      });
      setTimeout(function () {
        $('.path-product .product-single .slick-slider').each(function () {
          var $this = $(this);
          var hsi = $this.find('.slick-slide').outerHeight();
          $this.find('.slick-list').css('min-height', hsi + 1);
        });
      }, 300);
    }
  }
})(jQuery, Drupal, drupalSettings);
