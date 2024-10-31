<?php
defined( 'ABSPATH' ) or die( 'Go Away' );
//echo '<H1 style="padding-top:100px;">Hello world!</h1>';



//wire up scripts (will check for correct product before doing anything)
add_action( 'wp_enqueue_scripts', 'scorpion_ppf_enqueue_scripts' );

/* Enqueue Script, CSS, and Filters for PPF Product Page */
function scorpion_ppf_enqueue_scripts() {
	global $post; //the post in question
	if ( scorpion_ppf_is_ppf_product($post)  ) {
		$plugin_dir = plugin_dir_url(__FILE__) . '../';
		
    	//scripts (if ready)
		if (is_scorpion_ppf_plugin_ready())
		{
			//scorpion javascript file
			wp_enqueue_script( 'scorpion-product-js', $plugin_dir . 'js/scorpion_ppf_product.js?' . time(), array( 'jquery' ), null, true );
			//localized with settings from the admin section
			$ppfVarData = array(
				'apiUrl' => get_option('scorpion_ppf_api_address',''),
				'apiToken' => get_option('scorpion_ppf_token','')
			);
			wp_localize_script( 'scorpion-product-js', 'ppf_vars', $ppfVarData );


	        //colorbox
			wp_enqueue_style( 'colorbox-css', $plugin_dir . '/colorbox/colorbox.css' );
			wp_enqueue_script( 'colorbox',$plugin_dir . '/colorbox/jquery.colorbox-min.js', array( 'jquery' ), '', true );
			wp_enqueue_script( 'colorbox-init', $plugin_dir .  '/colorbox/colorbox-init.js', array( 'colorbox' ), '', true ); 

			 //content editing
			add_filter('the_content', 'scorpion_ppf_post_content'); 

			/* WooCommerce Hooks */
			add_action( 'woocommerce_product_thumbnails' , 'add_content_below_product_gallery', 5 );
		} else {
    		//display error message that it's not ready.
			add_filter('the_content', 'scorpion_ppf_post_content_error'); 

		}

		

	}
}


//Alter Post Content for the PPF product
function scorpion_ppf_post_content($content) { 

	//DOES NOTHING RIGHT NOW

    //collect variables
	global $post;
	global $product;

	$html = $content;

	//return content
	return $html;  


}

//Alter Post Content for the PPF product if something isn't ready
function scorpion_ppf_post_content_error($content) { 

    //build content
	$html = '<div class="api-error" style="display:block!important">';
	$html .= '<p>*** WARNING ***<br/>This product is designated as the Scorpion PPF product but has not been properly configured. Please correct the issues noted below:</p>';
	$html .= check_scorpion_ppf_plugin_ready();
	$html .= '</div>';

	//return content
	return $html;  


}

function add_content_below_product_gallery() {
	//add a placeholder for selected pattern images
	echo '<div class="api-selected-patterns-images"></div>';
	echo '<div class="api-error" style="display:none;"></div>';

}
