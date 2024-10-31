<?php
defined( 'ABSPATH' ) or die( 'Go Away' );


/*
This is the admin page for the Scorpion PPF plugin

From here the plugin checks for other needed plugins and lets the user configure things.

//Plugin Settings Reference: https://codex.wordpress.org/Creating_Options_Pages

*/

add_action('admin_menu','scorpion_ppf_admin_menu');

function scorpion_ppf_admin_menu() {
	//add menu
	add_submenu_page('options-general.php','Configure the Scorpion PPF Plugin','Scorpion PPF','manage_options','scorpion_ppf_admin','scorpion_ppf_admin_page',999);

	//register settings
	add_action('admin_init','scorpion_ppf_register_settings');
}

function add_action_links ( $links ) {
$mylinks = array(
    '<a href="' . admin_url( 'options-general.php?page=scorpion_ppf_admin' ) . '">Settings</a>',
);
return array_merge( $links, $mylinks );
}

function scorpion_ppf_register_settings() {
	//register our settings
	register_setting('scorpion-ppf-settings-group','scorpion_ppf_product_sku'); //sku of the PPF product on this site.
	register_setting('scorpion-ppf-settings-group','scorpion_ppf_api_address'); //https address of the API to use.
	register_setting('scorpion-ppf-settings-group','scorpion_ppf_token'); //token to use for the plugin

}

function scorpion_ppf_admin_page(){
	?>
	<div class="wrap">
		<h1>Scorpion PPF Plugin Settings</h1>
		<p>Welcome to the Scorpion PPF Plugin. This plugin is used to add functionality to your Scorpion PPF products and allow customers to pick the proper kit for
		their vehicle.</p>
		<p>This plugin is dependent upon several other plugins being installed and will not function properly until they are all installed. Additional configuration of 
		these plugins may be needed as well.</p>
		<p>For technical assistance, please contact C2IT Consulting, Inc. via email at <a href="mailto:appsupport@c2itconsulting.net">appsupport@c2itconsulting.net</a>.</p>
		
		<?php
			//show any alerts
		$isReady = is_scorpion_ppf_plugin_ready();
		if ($isReady)
		{
		} else {
				// plugin isn't ready to go!
			echo '<div style="background-color:#ff9999;padding:10px"><h2>Issues Found</h2>';
			echo check_scorpion_ppf_plugin_ready();
			echo '</div>';
		}
		?>

		<h2>Plugin Settings</h2>
		<form method="post" action="options.php">
			<?php settings_fields( 'scorpion-ppf-settings-group' ); ?>
			<?php do_settings_sections( 'scorpion-ppf-settings-group' ); ?>

			<table class="form-table">
				<tr valign="top">
					<th scope="row">API URL</th>
					<td><input type="text" name="scorpion_ppf_api_address" size="50" value="<?php echo esc_attr( get_option('scorpion_ppf_api_address') ); ?>" /></td>
					<td>Enter the API address to use for the plugin. This will be provided to you by Scorpion upon getting your site whitelisted.</td>
				</tr>
				<tr valign="top">
					<th scope="row">API Token</th>
					<td ><input type="text" name="scorpion_ppf_token" size="50" value="<?php echo esc_attr( get_option('scorpion_ppf_token') ); ?>" /></td>
					<td>Enter the Token to use for the plugin. This will be provided to you by Scorpion upon getting your site whitelisted.</td>
				</tr>
				<tr valign="top">
					<th scope="row">Product SKU</th>
					<td><input type="text" name="scorpion_ppf_product_sku" value="<?php echo esc_attr( get_option('scorpion_ppf_product_sku') ); ?>" /></td>
					<td>Enter the product SKU to associate with Scorpion PPF kit. This product SKU must match a valid product with a properly configured gravity form to function properly.</td>
				</tr>
			</table>
			
			<?php submit_button(); ?>

		</form>

		<?php
			//show the installation guide
		include(plugin_dir_path(__FILE__) . '../html/scorpion_ppf_setup_guide.html');
		?>

		
	</div>
	<?php

}