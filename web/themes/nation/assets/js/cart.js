(function ($, Drupal, drupalSettings) {
  "use strict";
  Drupal.behaviors.dexp_cart = {
    attach: function (context, settings) {
      $(document).once('click').click(function (e) {
        var cart_content = $('.block-commerce-cart .cart-block--contents');
        var cart_link = $('.block-commerce-cart .cart-block--link__expand');
        if (cart_content.is(':visible') && !cart_content.is(e.target) && cart_content.has(e.target).length === 0 && !cart_link.is(e.target) && cart_link.has(e.target).length === 0) {
          cart_content.removeClass('cart-block--contents__expanded');
          cart_content.slideToggle();
        }
      });
    }
  }
})(jQuery, Drupal, drupalSettings);
