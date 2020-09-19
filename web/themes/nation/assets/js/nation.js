(function ($, Drupal, drupalSettings) {
  "use strict";
  Drupal.behaviors.nation_theme = {
    attach: function (context, settings) {
      /* Search Icon */
     $('.search-toggle').once('click').each(function () {
        $(this).click(function (e) {
          e.preventDefault();
          $('body').toggleClass('search-open');
          $('input.form-search').focus();
        });
      });

      /*========= Tooltip ========== */
      $('[data-toggle="tooltip"]').once('toop').tooltip({
          placement: 'bottom'
      });
      $('.search-toggle-icon').each(function(){
         $(this).click(function () {
          $('.region-search').toggleClass('open');
          $('.region-search').find('input[type=text]').focus();
          $(window).scrollTop(0);
          return false;
        });
      });

      $('.btn-addcart').click(function (e) {
        e.preventDefault();
        $(this).parents('.prod-buttons').find("input[type='submit']").click();
      });
      /*Product single*/
      $('.btn-default.wishlist').click(function (e) {
        e.preventDefault();
        $(this).parents('.product-buttons').find(".form-actions input.btn-default").click();
      });
      $('.btn-addtocart').click(function (e) {
        e.preventDefault();
        $(this).parents('.product-buttons').find(".form-actions input.btn-primary").click();
      });
      $('a.btn.zoom').click(function (e) {
        e.preventDefault();
        $(this).parents('.product-single').find(".images-product .colorbox.cboxElement").click();
      });
    }
  }
  $(document).ready(function () {
    //Examples of how to assign the ColorBox event to elements
    $(".colorbox-youtube").colorbox({ iframe: true, innerWidth: 480, innerHeight: 390 });
  });
})(jQuery, Drupal, drupalSettings);
