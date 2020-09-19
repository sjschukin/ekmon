(function($, Drupal){
  Drupal.behaviors.drupalexp_admin_preset = {
    attach: function(){
      $('input[type=color]').once('drupalexp').each(function(){
        var $this = $(this);
        var textbox = $('<input type="text" style="width: 75px; position:relative;height:23px;top:4px;margin-left:5px;line-height:12px;" class="form-text"/>');
        textbox.val($(this).val());
        textbox.on('change', function(){
          var isOk  = /^#[0-9A-F]{6}$/i.test($(this).val());
          if(isOk){
            $this.val($(this).val());
          }else{
            alert('Wrong color code');
            $(this).val($this.val());
          }
        });
        $this.on('change', function(){
          textbox.val($(this).val());
        });
        $(this).after(textbox);
      });
    }
  };
})(jQuery, Drupal);