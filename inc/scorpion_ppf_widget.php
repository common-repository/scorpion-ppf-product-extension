<?php

defined( 'ABSPATH' ) or die( 'Nope, not accessing this' );

//main widget used for displaying stuff
class scorpion_ppf_widget extends WP_widget{

	//initialize
	public function __construct() {
		//set base values
		parent::__construct(
			'scorpion_ppf_widget',
			'Scorpion PPF Widget',
			array('descripion' => 'A widget for the Scorpion PPF product plugin'));

		add_action('widgets_init',array($this,'register_scorpion_ppf_widgets'));

	}	

   	//handles the back-end admin of the widget
    //$instance - saved values for the form
	public function form($instance){
		//collect variables

		?>
		<p>Scorpion PPF Widget Admin</p>
		<p>This is a widget for the scorpion PPF product. It has not been built out yet but could be for later use.</p>
		<?php 
	}

	//handles updating the widget 
	//$new_instance - new values, $old_instance - old saved values
	public function update($new_instance, $old_instance){

		return $old_instance;

	}

	public function widget($args, $instance)
	{
			//public display of the widget
			//$args - arguments set by the widget area
			//$instance - saved values

		global $scorpion_ppf;

			//get the output
		$html = '<h4 class="widgettitle">Scorpion PPF Kits</h4>';
		$html .= '<p>This site has Scorpion PPF Kits pre-cut for your make and model! This is a widget telling you about it, and that is about it. We could do more with that but do not need to right now.</p>';

		echo $html;
	}


}

//registers our widget for use
add_action( 'widgets_init', 'register_scorpion_ppf_widgets' );

function register_scorpion_ppf_widgets(){
	register_widget('scorpion_ppf_widget');
}
