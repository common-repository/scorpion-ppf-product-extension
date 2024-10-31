<?php
defined( 'ABSPATH' ) or die( 'Go Away' );

/**
 * Plugin Name: Scorpion PPF Product Extension
 * Plugin URI: https://buyscorpion.com/
 * Description: Scorpion PPF Product for WooCommerce
 * Version: 0.5
 * Author: C2IT Consulting, Inc.
 * Author URI: https://www.c2itconsulting.net
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html 
 */



//create an instance to get this going
$scorpion_ppf = new scorpion_ppf;


class scorpion_ppf{

	//properties
	private $scorpion_ppf_api = "";


	//constructor
	public function __construct(){

	    //add_action('init', array($this,'set_location_trading_hour_days')); //sets the default trading hour days (used by the content type)
	    //add_action('init', array($this,'register_location_content_type')); //register location content type
	    //add_action('add_meta_boxes', array($this,'add_location_meta_boxes')); //add meta boxes
	    //add_action('save_post_wp_locations', array($this,'save_location')); //save location
	    add_action('admin_enqueue_scripts', array($this,'enqueue_admin_scripts_and_styles')); //admin scripts and styles
	    add_action('wp_enqueue_scripts', array($this,'enqueue_public_scripts_and_styles')); //public scripts and styles

	    register_activation_hook(__FILE__, array($this,'plugin_activate')); //activate hook
	    register_deactivation_hook(__FILE__, array($this,'plugin_deactivate')); //deactivate hook

		// Link to settings page from plugins screen
		add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'add_action_links' );


	}


	function plugin_activate() {

	}

	function plugin_deactivate() {

	}

	//enqueus scripts and stles on the back end
	public function enqueue_admin_scripts_and_styles(){
		wp_enqueue_style('scorpion_ppf_admin_styles', plugin_dir_url(__FILE__) . '/css/scorpion_ppf_admin_styles.css');
	}

	//enqueues scripts and styled on the front end
	public function enqueue_public_scripts_and_styles(){
		wp_enqueue_style('scorpion_ppf_public_styles', plugin_dir_url(__FILE__). '/css/scorpion_ppf_public_styles.css');

	}

}

//common functions
include(plugin_dir_path(__FILE__) . 'inc/scorpion_ppf_common.php');

//include shortcodes
include(plugin_dir_path(__FILE__) . 'inc/scorpion_ppf_shortcodes.php');

//include product / posts
include(plugin_dir_path(__FILE__) . 'inc/scorpion_ppf_product.php');

//include admin
include(plugin_dir_path(__FILE__) . 'inc/scorpion_ppf_admin.php');

//include widget 
include(plugin_dir_path(__FILE__) . 'inc/scorpion_ppf_widget.php');
