<?php

namespace Drupal\drupalexp;

use Drupal\drupalexp\DrupalExp;

class LessCss {

  protected $less = null;
  protected $input = '';
  protected $import = [];

  function __construct($fname = null) {
    $options = array(
      'sourceMap' => true,
      'compress' => true,
      'relativeUrls' => false,
    );
    $this->less = new \Drupal\drupalexp\Less\Less_Parser($options);
    $this->less->SetImportDirs([getcwd() => '/']);
  }

  public function setVariable($key, $value) {
    $variable = [$key => $value];
    $this->less->ModifyVars($variable);
  }

  /**
   *
   * @param type $string
   */
  public function add($css) {
    if(is_array($css)){
      $this->input .= $css['css'];
      $this->import[] = $css['import'];
    }else{
      $this->input .= $string;
    }
  }

  /**
   * import file
   * @param type $file
   */
  public function import($file) {
    if(is_array($file)){
      $this->import = array_merge($this->import, $file);
    }else{
      $this->import[] = $file;
    }
  }

  /**
   *
   * @return type
   */
  protected function getLessStr(){
    $lessStr = '';
    foreach($this->import as $file){
      if(strpos($file, 'url') === 0){
        $lessStr .= "@import {$file};\n";
      }elseif(!empty($file)){
        $lessStr .= "@import \"{$file}\";\n";
      }
    }
    return $lessStr . "\n" . $this->input;
  }

  /**
   *
   * @param type $string
   * @param type $out
   * @return boolean
   */
  public function compile($string = null, $out = null){
    if ($string === null){
      $string = $this->getLessStr();
      if($this->checkedCompile(null, $out) == false){
        return false;
      }
    }
    $theme = DrupalExp::get();
    if(is_dir($theme->getTheme()->getPath() . '/assets/images')){
      $this->copyImages($theme->getTheme()->getPath() . '/assets/images', 'public://drupalexp/' . $theme->getTheme()->getName() . '/images');
    }
    try{
      $this->less->parse($string);
      $css = $this->less->getCss();
      file_unmanaged_save_data($css, $out, FILE_EXISTS_REPLACE);
      return true;
    }catch(\Exception $e){
      \Drupal::logger('Less Css')->notice($string);
      drupal_set_message($e->getMessage(), 'error');
    }
    return false;
  }

  // compile only if changed input has changed or output doesn't exist
  public function checkedCompile($in, $out) {
    if (!is_file($out)){
      return true;
    }else{
      $mtimeout = filemtime($out);
      foreach ($this->import as $file){
        if(is_file($file) && (filemtime($file) > $mtimeout)){
          return true;
        }
      }
    }
    return false;
  }

  public function copyImages($src, $dst) {
    $update = false;
    if (!is_dir($dst)) {
      file_prepare_directory($dst, FILE_CREATE_DIRECTORY);
      file_prepare_directory($dst, FILE_MODIFY_PERMISSIONS);
      $update = true;
    }
    if (filemtime($src) > filemtime($dst)) {
      $update = true;
    }
    if ($update) {
      if ($handle = @opendir($src)) {
        while (false !== ( $file = readdir($handle))) {
          if (( $file != '.' ) && ( $file != '..' )) {
            if (is_dir($src . '/' . $file)) {
              $this->copyImages($src . '/' . $file, $dst . '/' . $file);
            }
            else {
              file_unmanaged_copy($src . '/' . $file, $dst, FILE_EXISTS_REPLACE);
            }
          }
        }
        closedir($handle);
      }
      else {
        \Drupal::logger('file')->error('@dir can not be opened', array('@dir' => $src));
      }
    }
  }

  /**
   *
   * @param type $page
   * @return LessCss
   */
  public static function get(&$page = null) {
    $LessCss = &drupal_static(__CLASS__ . __FUNCTION__);
    if (!isset($LessCss)) {
      $LessCss = new LessCss();
    }
    return $LessCss;
  }

}
