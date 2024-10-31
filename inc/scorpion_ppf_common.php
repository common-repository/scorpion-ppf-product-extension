<?php
defined( 'ABSPATH' ) or die( 'Go Away' );

function is_scorpion_ppf_plugin_ready() {
	//this function determines if the plugin is ready to go to work.

	if (check_scorpion_ppf_plugin_ready()=="")
		{
			return true;
		} else {
			return false;
		}
}


function check_scorpion_ppf_plugin_ready() {
	/*
	this function does all the checks for the plugin being ready and returns a string of html if it is not.
	if all is in order, a blank string "" will be returned
	*/

	//check for key plugins

	$result='';

	//wordpress
	if ( ! class_exists( 'WooCommerce' ) ) {
	  	$result .= '<p><strong>WooCommerce</strong> has not been installed and must be installed before this plugin can operate.</p>';
	}

	//gravity forms
	if ( ! class_exists( 'GFCommon' ) ) {
	    $result .= '<p><strong>Gravity Forms</strong> has not been installed and must be installed before this plugin can operate.</p>';
	}

	//WooCommerce Gravity Forms Product Add-Ons
	if (! class_exists('WC_GFPA_Structured_Data'))
	{
		$result .= '<p><strong>WooCommerce Gravity Forms Product Add-ons</strong> has not been installed and must be installed before this plugin can operate.</p>';
	}

	//api address set
	if (get_option('scorpion_ppf_api_address','') == '')
	{
		$result .= '<p>The <strong>API Address</strong> for the PPF plugin has not been set yet. You can set this on the plugin settings page.</p>';
	}

	//product sku set
	if (get_option('scorpion_ppf_token','') == '')
		{
			$result .= '<p>The <strong>API Token</strong> for the PPF kit has not been set yet. You can set this on the plugin settings page.</p>';
		}

	//product sku set
	if (get_option('scorpion_ppf_product_sku','') == '')
	{
		$result .= '<p>The <strong>Product SKU</strong> for the PPF kit has not been set yet. You can set this on the plugin settings page.</p>';
	}

	
	return $result;

}

function scorpion_ppf_is_ppf_product($post) {
	//returns if this is the right product to work with or not.
    if ( is_product()  ) { //check for a product
		$_product = wc_get_product( $post ); //get the product
        $sku = $_product->get_sku(); //get the product sku
        $ppf_sku = esc_attr( get_option('scorpion_ppf_product_sku')); //get settings sku
        if ($sku == $ppf_sku && $sku != null && $ppf_sku != null) { //check for a match
        	return true;
        } else {
        	return false;
        }
    } else {
    	return false;
    }
}
