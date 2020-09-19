<?php

namespace Drupal\drupalexp;

use Drupal\drupalexp\DrupalExp;

class Font extends \stdClass {

  public static function alterForm(&$form) {
    $theme = DrupalExp::get();
    $drupalexp_fonts = $theme->getFonts();
    ////json_decode($theme->getSetting('drupalexp_fonts')) == null ? [] : json_decode($theme->getSetting('drupalexp_fonts'));
    //$drupalexp_element_fonts = json_decode($theme->getSetting('drupalexp_element_fonts')) == null ? [] : json_decode($theme->getSetting('drupalexp_element_fonts'));
    $form['font_settings'] = [
      '#type' => 'details',
      '#title' => t('Font settings'),
      '#description' => '',
      '#collapsible' => TRUE,
      '#collapsed' => TRUE,
      '#group' => 'drupalexp_theme_settings',
      '#weight' => -1,
    ];
    $form['font_settings']['drupalexp_fonts'] = [
      '#type' => 'hidden',
      '#default_value' => $theme->getSetting('drupalexp_fonts'),
    ];
    $form['font_settings']['global_fonts'] = [
      '#type' => 'details',
      '#title' => t('Global Fonts'),
    ];
    $form['font_settings']['global_fonts']['global_fonts_list'] = [
      '#markup' => '<div class="global-fonts-list"></div>',
    ];
    $form['font_settings']['global_fonts']['global_fonts_family'] = [
      '#type' => 'textfield',
      '#title' => t('Font Family'),
    ];
    $form['font_settings']['global_fonts']['global_fonts_style'] = [
      '#markup' => '<div id="global-fonts-styles" class="js-form-item form-item js-form-type-checkboxes"></div>',
      '#title' => t('Font Style'),
    ];
    $form['font_settings']['global_fonts']['submit'] = [
      '#type' => 'button',
      '#value' => t('Add'),
      '#button_type' => 'primary',
    ];

    $form['font_settings']['drupalexp_element_fonts'] = [
      '#type' => 'hidden',
      '#default_value' => $theme->getSetting('drupalexp_element_fonts'),
    ];
    $form['font_settings']['element_fonts'] = [
      '#type' => 'details',
      '#title' => t('Element Fonts'),
    ];
    $form['font_settings']['element_fonts']['element_fonts_list'] = [
      '#markup' => '<div class="element-fonts-list"></div>',
    ];
    $form['font_settings']['element_fonts']['element_fonts_family'] = [
      '#type' => 'textfield',
      '#title' => t('Font Family'),
    ];
    $form['font_settings']['element_fonts']['element_fonts_variant'] = [
      '#type' => 'select',
      '#title' => t('Font Style'),
      /*
      '#states' => [
        'invisible' => [':input[name=element_fonts_family]' => ['value' => '']],
      ]*/
    ];
    $form['font_settings']['element_fonts']['element_fonts_size'] = [
      '#type' => 'textfield',
      '#title' => t('Font Size'),
    ];
    $form['font_settings']['element_fonts']['element_fonts_line_height'] = [
      '#type' => 'textfield',
      '#title' => t('Line Height'),
    ];
    $form['font_settings']['element_fonts']['element_fonts_selector'] = [
      '#type' => 'select',
      '#title' => t('Element Selector'),
      '#options' => ['body, html' => 'body, html', 'h1' => 'H1', 'h2' => 'H2', 'h3' => 'H3', 'h4' => 'H4', 'h5' => 'H5', 'h6' => 'H6', 'custom' => t('Custom')],
    ];
    $form['font_settings']['element_fonts']['element_fonts_custom_selector'] = [
      '#type' => 'textfield',
      '#title' => t('Selector'),
      '#description' => t('CSS selector such as: h2.block-title'),
      '#states' => [
        'visible' => [':input[name=element_fonts_selector]' => ['value' => 'custom']],
      ]
    ];
    $form['font_settings']['element_fonts']['submit2'] = [
      '#type' => 'button',
      '#value' => t('Add'),
      '#button_type' => 'primary',
    ];
    
    $google_fonts_json = file_get_contents(drupal_get_path('theme', 'drupalexp') . '/vendor/google-fonts-api/google-fonts-api.json');
    $google_fonts = json_decode($google_fonts_json);
    $form['#attached']['drupalSettings']['google_fonts'] = $google_fonts->items;
    $form['#attached']['drupalSettings']['drupalexp_fonts'] = $drupalexp_fonts;
  }

  public static function getFonts() {
    $theme = DrupalExp::get();
    $fonts = $theme->getSetting('drupalexp_fonts');
    $fonts = json_decode($fonts);
    return $fonts == null?[]: $fonts;
  }
  
  public static function getCss(){
    $return = array(
      'import' => '',
      'css' => '',
    );
    $fonts = self::getFonts();
    $apiUrl = [];
    $apiUrl2 = [];
    $css = [];
    foreach($fonts as $font){
      if(isset($font->font->subsets)){
        $apiUrl[$font->font->family][] = $font->variant;
      }
      if($font->selector){
        $element_css = [];
        $element_css[] = "font-family: '{$font->font->family}'";
        if($font->font_size){
          $element_css[] = "font-size: {$font->font_size}";
        }
        if($font->weight){
          $element_css[] = "font-weight: {$font->weight}";
        }
        if($font->style){
          $element_css[] = "font-style: {$font->style}";
        }
        if($font->line_height){
          $element_css[] = "line-height: {$font->line_height}";
        }
        $css[] = $font->selector . '{'. implode(';',$element_css).'}';
      }
    }
    
    if(!empty($apiUrl)){
      $fonts_set = [];
      foreach($apiUrl as $family => $variants){
        $variants = array_unique($variants);
        $fonts_set[] = str_replace(' ', '+', $family) . ':' . implode(',', $variants);
      }
      $apiUrl = '//fonts.googleapis.com/css?family='. implode('|', $fonts_set);
      $return['import'] = 'url(\'' . $apiUrl . '\')';
    }
    $return['css'] = implode('',$css);
    return $return;
  }

}