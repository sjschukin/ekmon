<?php

namespace Drupal\drupalexp;

use Drupal\drupalexp\DrupalExp;

class Preset extends \stdClass{
  
  /**
   * 
   * @param type $form
   */
  public static function alterForm(&$form) {
    $theme = DrupalExp::get();
    $preset_options = [];
    foreach($theme->getPresets() as $preset_key => $preset){
      $preset_options[$preset_key] = $preset_key;
    }
    $form['preset_settings'] = [
        '#type' => 'details',
        '#title' => t('Preset settings'),
        '#collapsible' => TRUE,
        '#collapsed' => TRUE,
        '#group' => 'drupalexp_theme_settings',
        '#weight' => -1,
    ];
    $form['preset_settings']['drupalexp_default_preset'] = [
        '#type' => 'select',
        '#title' => t('Default Preset'),
        '#options' => $preset_options,
        '#default_value' => $theme->getSetting('drupalexp_default_preset'),
    ];
    
    $form['preset_settings']['edit_presets'] = [
        '#type' => 'details',
        '#title' => 'Preset color settings',
    ];
    
    $form['preset_settings']['edit_presets']['drupalexp_preset'] = [
        '#type' => 'select',
        '#title' => t('Preset'),
        '#options' => $preset_options,
        '#default_value' => $theme->getSetting('drupalexp_default_preset'),
    ];
    foreach($theme->getPresets() as $preset_key => $preset){
      foreach($preset as $key => $color){
        $setting_key = str_replace(' ', '_', $preset_key).'_'.$key;
        $form['preset_settings']['edit_presets'][$setting_key] = [
          '#type' => 'color',
          '#title' => $color['title'],
          '#default_value' => $color['value'],
          '#states' => [
            'visible' => [
                ':input[name=drupalexp_preset]' => ['value' => $preset_key],
            ]
          ],
          '#field_suffix' => '<input type="text"/>',
          '#description' => t('Less variable').': @'.$key,  
        ];
      }
    }
    
    $form['#validate'][] = 'Drupal\drupalexp\Preset::formValidate';
    $form['#submit'][] = 'Drupal\drupalexp\Preset::formSubmit';
  }
  
  /**
   * 
   * @param type $form
   * @param type $form_state
   */
  public static function formValidate(&$form, &$form_state) {
    
  }
  
  /**
   * 
   * @param type $form
   * @param type $form_state
   */
  public static function formSubmit(&$form, &$form_state){
    $css_dir = drupal_realpath('public://drupalexp');
    foreach (glob($css_dir.'/*/css/*.css') as $filename) {
      file_unmanaged_delete($filename);
    }
  }
}