<?php
defined( 'ABSPATH' ) or die( 'Go Away' );

//defines the functionality for a shortcode
class scorpion_ppf_shortcode{


	//on initialize
	public function __construct(){
	    add_action('init', array($this,'register_scorpion_ppf_shortcodes')); //shortcodes
	}

	//register shortcodes
	public function register_scorpion_ppf_shortcodes(){
    	add_shortcode('scorpion_ppf_selected_patterns',array($this,'scorpion_ppf_selected_patterns_output')); //selected patterns output in the Gravity form
	}

	//display scorpion ppf selected patterns shortcode output
	//loads html from external file and displays in place of the shortcode
	public function scorpion_ppf_selected_patterns_output($atts, $content = '', $tag){
		$file =  plugin_dir_path(__FILE__) . '../html/scorpion_ppf_selected_patterns.html';
		$html = file_get_contents($file);
		return $html;
	}
}

//create an instance to fire everything up
$scorpion_ppf_shortcode = new scorpion_ppf_shortcode;