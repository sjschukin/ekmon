(function ($, Drupal, drupalSettings) {
  "use strict";
  Drupal.variants = {
    '100': 'Thin',
    '200': 'Extra-Light',
    '300': 'Light',
    '400': 'Regular',
    '500': 'Medium',
    '600': 'Semi-Bold',
    '700': 'Bold',
    '800': 'Extra-Bold',
    '900': 'Black'
  };
  
  var Font = function (font, variant, selector, font_size, line_height) {
    if(typeof font === 'undefined'){
      this.font = null;
    }else if (typeof font === 'string') {
      this.font = $.grep(drupalSettings.google_fonts, function (e) {
        return e.family === font;
      })[0] || null;
    } else {
      this.font = font;
    }

    if (this.font !== null){
      this.family = this.font.family;
      this.selector = selector || null;
      this.font_size = font_size || null;
      this.line_height = line_height || null;

      variant = variant || 'regular';
      this.variant = variant === '' ? 'regular' : variant;
      var weight = variant.toString().replace(/[a-z]/g, '');
      var style = variant.toString().replace(/[0-9]/g, '');
      this.weight = isNaN(parseInt(weight)) ? 400 : parseInt(weight);
      this.style = style.toString() === 'italic' ? 'italic' : 'normal';
    }
  };

  Font.prototype.load = function () {
    if( typeof this.font.subsets == 'undefined'){
      return true;
    }
    var apiUrl = [];
    apiUrl.push('//fonts.googleapis.com/css?family=');
    apiUrl.push(this.font.family.replace(/ /g, '+'));
    apiUrl.push(':');
    apiUrl.push(this.variant);
    if (this.font.subsets.indexOf('greek') !== -1) {
      apiUrl.push('&subset=');
      apiUrl.push('greek');
    }
    var url = apiUrl.join('');
    $('head').append('<style media="all">@import url("' + url + '");</style>')
  };

  Font.prototype.getVariantStr = function () {
    return Drupal.variants[this.weight] + ' ' + this.weight + ' ' + this.style;
  };

  Font.prototype.apply = function (element) {
    this.load();
    $(element).css({
      fontFamily: '"' + this.font.family + '"',
      fontStyle: this.style,
      fontWeight: this.weight
    });
    if (this.size !== '') {
      $(element).css('fontSize', this.font_size);
    }
    if (this.lineheight !== '') {
      $(element).css('lineHeight', this.line_height);
    }
  };
  
  Font.prototype.getCss = function(){
    var css = '';
    css += '  font-family: "'+ this.font.family + '";\n';
    if(this.font_size != null){
      css += '  font-size: ' + this.font_size +';\n';
    }
    css += '  font-weight: ' + this.weight + ';\n';
    css += '  font-style: ' + this.style + ';\n';
    if(this.line_height != null){
      css += '  line-height: ' + this.line_height +';\n';
    }
    if(this.selector != null){
      return this.selector + '{\n' + css + '}';
    }else{
      return '{\n' + css + '}';
    }
  };

  Font.prototype.preview = function (parent) {
    if(this.font == null) return false;
    var $font = $('<div>').addClass('font-item');
    var $preview = $('<p>');
    var title = [];
    if (this.selector != null && this.selector != '') {
      title.push('<strong>' + this.selector + '</strong>: ');
    }
    title.push('<strong>' + this.font.family + '</strong>');
    title.push('<span>' + this.getVariantStr() + '</span>');
    title.push('<a href="#" style="color:#ff0000"><small>Remove</small></a>');
    $font.append(title.join(' '));
    $font.find('a').click(function (e) {
      e.preventDefault();
      $font.fadeOut(500, function () {
        $font.remove();
      });
    });
    $font.data('font', this);
    $preview.text('ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz 0123456789');
    $font.append('<pre style="border: 1px solid #ddd; padding: 5px 10px; background: #fff">' + this.getCss() + '</pre>');
    this.apply($preview);
    $font.append($preview);
    $font.css({
      border: '1px solid #ddd',
      padding: '10px',
      marginBottom: '10px'
    });
    $(parent).append($font);
  };

  var global_fonts = $.grep(drupalSettings.drupalexp_fonts, function (font) {
    return font.selector === null;
  });

  var element_fonts = $.grep(drupalSettings.drupalexp_fonts, function (font) {
    return font.selector !== null;
  });
  Drupal.behaviors.druaplexp_global_font = {
    attach: function (context, settings) {
      $('.global-fonts-list').once('load').each(function () {
        $(global_fonts).each(function () {
          var font = new Font(this.family, this.variant, null, null, null);
          font.preview('.global-fonts-list');
        });
      });

      $('.element-fonts-list').once('load').each(function () {
        $(element_fonts).each(function () {
          var font = new Font(this.family, this.variant, this.selector, this.font_size, this.line_height);
          font.preview('.element-fonts-list');
        });
      });

      $('input[name=global_fonts_family]').once('autocomplete').each(function () {
        $(this).autocomplete({
          autoFocus: true,
          source: function (request, response) {
            var result = $.grep(drupalSettings.google_fonts, function (e) {
              e.value = e.family;
              if(typeof e.subsets == 'undefined'){
                return false;
              }
              return e.family.toLowerCase().indexOf(request.term.toLowerCase()) !== -1;
            });
            response(result);
          },
          minLength: 1,
          select: function (event, ui) {
            var font_styles = [];
            $('#global-fonts-styles').html('');
            if(typeof ui.item.variants == 'undefined'){
              ui.item.variants = ['400', '600'];
            }
            $(ui.item.variants).each(function () {
              var thenum = this.replace(/[a-z]/g, '');
              var alphabet = this.replace(/[0-9]/g, '');
              var thenum = isNaN(parseInt(thenum)) ? 400 : parseInt(thenum);
              var str = Drupal.variants[thenum.toString()] + " " + thenum.toString();
              str += alphabet == 'italic' ? ' Italic' : '';
              $('#global-fonts-styles').append('<input type="checkbox" value="' + this.toString() + '" class="form-checkbox"/> <label class="option" style="margin-right:15px">' + str + '</label>');
              font_styles.push({label: str, value: this.toString()});
            });
            $('input[name=global_fonts_style]').autocomplete({
              source: font_styles,
              minLength: 1
            });
          }
        });
      });
      $('#edit-global-fonts input[type=submit]').once('click').each(function () {
        $(this).click(function (e) {
          e.preventDefault();
          $('#global-fonts-styles input[type=checkbox]:checked').each(function () {
            var font = new Font($('input[name=global_fonts_family]').val(), $(this).val());
            font.preview('.global-fonts-list');
          });
          $('input[name=global_fonts_family]').val('');
          $('#global-fonts-styles').html('');
        });
      });

      $('input[name=element_fonts_family]').once('autocomplete').each(function () {
        $(this).autocomplete({
          autoFocus: true,
          source: function (request, response) {
            var result = $.grep(drupalSettings.google_fonts, function (e) {
              e.value = e.family;
              return e.family.toLowerCase().indexOf(request.term.toLowerCase()) !== -1;
            });
            response(result);
          },
          minLength: 1,
          select: function (event, ui) {
            var font_styles = [];
            $('#edit-element-fonts-variant option').remove();
            if(typeof ui.item.variants == 'undefined'){
              ui.item.variants = ['400', '600'];
            }
            $(ui.item.variants).each(function () {
              var thenum = this.replace(/[a-z]/g, '');
              var alphabet = this.replace(/[0-9]/g, '');
              var thenum = isNaN(parseInt(thenum)) ? 400 : parseInt(thenum);
              var str = Drupal.variants[thenum.toString()] + " " + thenum.toString();
              str += alphabet == 'italic' ? ' Italic' : '';
              $('#edit-element-fonts-variant').append(new Option(str, this));
            });
            $('input[name=global_fonts_style]').autocomplete({
              source: font_styles,
              minLength: 1
            });
          }
        });
      });

      $('#edit-element-fonts input[type=submit]').once('click').each(function () {
        $(this).click(function (e) {
          e.preventDefault();
          var selector = $('select[name=element_fonts_selector]').val();
          if (selector.toString() === 'custom') {
            selector = $('input[name=element_fonts_custom_selector]').val();
          }
          if (selector.toString() === '') {
            alert('Please add element selector');
            $('[name=element_fonts_custom_selector]').focus();
            return false;
          }
          var fontsize = $('input[name=element_fonts_size]').val();
          var lineheight = $('input[name=element_fonts_line_height]').val();
          var font = new Font($('input[name=element_fonts_family]').val(), $('select[name=element_fonts_variant]').val(), selector, fontsize, lineheight);
          font.preview('.element-fonts-list');
          $('input[name=element_fonts_family]').val('');
          $('select[name=element_fonts_variant] option').remove();
          $('input[name=element_fonts_line_height]').val('');
          $('input[name=element_fonts_size]').val('');
          $('input[name=element_fonts_selector]').val('');
          $('select[name=element_fonts_custom_selector]').val('');
          $('#global-fonts-styles').html('');
        });
      });
      $('form#system-theme-settings').once('drupalexp-fonts-submit').submit(function () {
        var fonts = [];
        $('.font-item').each(function () {
          fonts.push($(this).data('font'));
        });
        $('input[name=drupalexp_fonts]').val(JSON.stringify(fonts));
      });
    }
  };
})(jQuery, Drupal, drupalSettings);