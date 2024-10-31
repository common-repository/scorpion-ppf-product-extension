var $j = jQuery.noConflict();

/* Useful css classes

.api-year select = year selection input
.api-make select  = make selection input
.api-model select = model selection input
.api-trim select = trim level selection input
.api-selected-patterns input = selected patterns input
.api-selected-patterns-list = html block for showing selected patterns list
.api-selected-patterns-images = html block for showing selected patterns image previews
.api-price input = selected patterns total price
.api-patterns = html container for displaying pattern data
.single_add_to_cart_button = add to cart button

#selectedPatterns - div to contain list of selected patterns
#btnSelectPatterns - button to select patterns
#btnSubmitPatterns - button to submit pattern selection

#patternSelector - div that contains the popup for selecting patterns
#patternSelectorContainer - div that contains the actual patterns for selecting
*/
var customProduct = false;

if ($j('.gfield.api-year').length>0) 
{ 
	customProduct = true;
} else {
	customProduct=false;
}

if (customProduct) //Don't need this if we're not on the right product
{

/* 
	Lightbox options
	https://easywebdesigntutorials.com/adding-a-lightbox-to-wordpress-without-using-a-plugin/
	*/

/* 
    API Information 
    Documentation: https://services.filmvinyldesigns.com/api/patterns/v2/Help
    Reference: https://services.filmvinyldesigns.com/api/patterns/v2/
    */
    

    /* Set up the API */
    window.addEventListener('popstate', function (event) { StartAuthRequest(); }, false);
    var apiUrl =  ppf_vars.apiUrl; //retrieved from WP settings
    var apiToken = ppf_vars.apiToken; //retrieved from WP settings

    var checkedItems = []
    var saveColorboxChanges = false;
    $j.support.cors = true;

    /* Prep some fields */
    UpdateFormControls(false);

    function UpdateFormControls(show) {
    	if (show == true)
    	{
            //Enable add to cart
            $j(".single_add_to_cart_button").removeAttr("disabled");
        } else 
        {
            //Lock the selected paterns field
            $j(".api-selected-patterns").attr("readonly","true");
            //Lock the pricing field
            $j(".api-price input").attr("readonly","true");
            //Disable add to cart
            $j(".single_add_to_cart_button").prop("disabled","disabled");
        }
    }


    function SetSelect(selectId, restData) {

    	if (restData == null) {
    		return;
    	}

    	if (restData.length == 0) {
    		return;
    	}

    	var ddown = $j(selectId);

    	ddown.append($j("<option></option>")
    		.attr("value", 0)
    		.text("Select One"));

    	$j.each(restData, function (id, val) {

    		var option = $j('<option/>', {
    			text: val.Value,
    			value: val.Value
    		});
    		option.data('code', val.ID);

    		option.appendTo(ddown);

/*
                ddown.append($j("<option></option>")
                    .attr("value", val.ID)
                    .text(val.Value)
                    .data({code:val.ID}));
                    */
                })

    	ddown.removeAttr("disabled")

    }

    function ShowError(msg) {
            //window.alert('Communication Error: An error has occured while communicating with the pattern database. Pleast try again later: \n\n' + msg);
            $j(".api-error").append($j("<p>").text(msg));
            $j(".api-error").fadeIn();
        }

        function SubmitPatternSelection() {
        	/* Save selected patterns - update pricing and associated HTML content */
        	var patternText  = '';
        	var patternHtml = '';
        	var price = 0;
        	var $imgContainer = $j('.api-selected-patterns-images');
        	$imgContainer.empty();

        	/* Loop through each checkbox */
        	$j(".pattern-container input[type=checkbox]").each(function() {
        		if (this.checked) {
        			var $chk = $j(this);
                    //Get the part #, title, and image needed
                    //find the container
                    var $cont = $chk.closest('.pattern-container');
                    var part = $cont.find('.id').text();
                    var title = $cont.find('.pattern-title').text();
                    var image = $cont.find('img')[0].src;
                    var itemPrice = Number($cont.find('.price').text().replace(/[^0-9.-]+/g,""));
                    patternHtml += '<div>' + part + ' - ' + title + '</div>';
                    patternText +=  part + ' - ' + title + '\n';
                    price = price + itemPrice;
                    //Add the image preview
                    var $c = $j('<div>',{class: 'item'});
                    $c.append($j('<img>',{src:image,alt: title, class: 'pattern-thumb'}));
                    $c.append($j('<div>',{class: 'pattern-name'}).html(title));
                    $imgContainer.append($c);

                }
            });

            //Set selected pattern input text (for adding to cart)
            $j('.api-selected-patterns textarea').val(patternText);
            $j('#selectedPatternsContainer').html(patternHtml);
            $j(".api-price input").val(new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price));

            //Update form controls
            if (price >0)
            {
                UpdateFormControls(true); //Show price/cart functionality
            } else {
                UpdateFormControls(false); //Disable price/cart functionality
            }

            //Close the color box
            saveColorboxChanges=true;
            $j.colorbox.close();
        }


        function SelectPatterns() {
        	/* Show the pattern selector along with all selected patterns */

            //Store currently selected item indexes for later use
            checkedItems=[]; //Need to load currently checked items here
            var x = -1
            $j('#patternSelector input[type=checkbox]').each(function () {
            	x++;
            	if (this.checked) {
            		checkedItems.push(x);
            	}
            });



            saveColorboxChanges=false;

            $j.colorbox({
            	inline:true, 
            	href:"#patternSelector",
            	opacity: .8, 
            	transition: "none",
            	title: "Select Your Patterns",
            	scrolling: true,
            	width:"80%",
            	height:"60%",
            	onOpen: function(){
                    //Do nothing
                    $j('body').css({ overflow: 'hidden' });
                },
                onClosed: function(){
                    //Do nothing
                    $j('body').css({ overflow: '' });
                    if (saveColorboxChanges == false) 
                    {
                        //reset the colorbox to how it was
                        //Reset the checkboxes on the colorbox to what it was before being displayed
                        var x = -1
                        $j('#patternSelector input[type=checkbox]').each(function () {
                        	x++;
                        	if (checkedItems.includes(x))
                        	{
                        		$j(this).prop( "checked", true );
                        	} else {
                        		$j(this).prop( "checked", false );
                        	}
                        });

                    }
                }
            });
        }

 // wait until the documnt is loaded
 $j(document).ready(function () {
 // disable all drop downs
 $j("select").attr("disabled", "disabled")
            //wire up color box events
            $j("#btnSelectPatterns").click(function () {SelectPatterns();});
            $j("#btnSubmitPatterns").click(function () {SubmitPatternSelection();})


            
            // setup drop downs events
            $j(".api-year select").change(function () {

                UpdateFormControls(false); //Hide price/cart functionality
                
                $j(".api-make select").empty();
                $j(".api-model select").empty();
                $j(".api-trim select").empty();

                $j(".api-make select").attr("disabled", "disabled");
                $j(".api-model select").attr("disabled", "disabled");
                $j(".api-trim select").attr("disabled", "disabled");

                $j.ajax({
                	type: "GET",
                	dataType: "json",
                	contentType: "application/json",
                	url: apiUrl + "makes/" + $j(this).children('option:selected').data('code'),
                	data: null,
                	success:
                	function (restMakes) {
                		SetSelect(".api-make select", restMakes.Data);
                	}

                });

            });

            $j(".api-make select").change(function () {

                UpdateFormControls(false); //Hide price/cart functionality

                $j(".api-model select").empty();
                $j(".api-trim select").empty();

                $j(".api-model select").attr("disabled", "disabled");
                $j(".api-trim select").attr("disabled", "disabled");

                $j.ajax({
                	type: "GET",
                	dataType: "json",
                	contentType: "application/json",
                	url: apiUrl + "models/" + $j(this).children('option:selected').data('code') + "/" + $j(".api-year select option:selected").data('code'),
                	data: null,
                	success:
                	function (restModels) {

                		SetSelect(".api-model select", restModels.Data);
                	}

                });

            });


            $j(".api-model select").change(function () {

                UpdateFormControls(false); //Hide price/cart functionality

                $j(".api-trim select").empty();
                $j(".api-trim select").attr("disabled", "disabled");

                $j.ajax({
                	type: "GET",
                	dataType: "json",
                	contentType: "application/json",
                	url: apiUrl + "trims/" + $j(".api-model select option:selected").data('code') + "/" + $j(".api-year select option:selected").data('code'),
                	data: null,
                	success:
                	function (restTrims) {

                		SetSelect(".api-trim select", restTrims.Data);

                	}

                });

            });


            $j(".api-trim select").change(function () {

                UpdateFormControls(false); //Hide price/cart functionality

                $j.ajax({
                	type: "GET",
                	dataType: "json",
                	contentType: "application/json",
                	url: apiUrl + "patterns/" + $j(".api-model select option:selected").data('code') + "/" + $j(".api-trim select option:selected").data('code') + "/" + $j(".api-year select option:selected").data('code'),
                	data: null,
                	success:
                	function (restPatterns) {

                		if (restPatterns.Success) {

                			/* Prep the pattern selector */
                			var $container = $j("#patternSelectorContainer");
                			$container.empty();

                			/* Loop through patterns */

                			for (i = 0; i < restPatterns.Data.length; i++) {


                                    // render patterns list
                                    var $patternBlock = $j("<div>", { class: "pattern-container" });
                                    var $preview = $j("<div>", { class: "pattern-preview" });
                                    var $title = $j("<div>", {class: "pattern-title"});
                                    var $details = $j("<div>", { class: "pattern-details" });

                                    // preview image
                                    var imgSrc = apiUrl + "patterns/preview/" + restPatterns.Data[i].PatternID + "/360/260"
                                    $preview.append($j('<img>', {src:imgSrc, class:''}));
                                    $preview.append ($j('<input>', {class:"pattern-selected" ,type: "checkbox", value: "false"}));

                                    //Append pattern name
                                    $title.append(restPatterns.Data[i].Description + '&nbsp;');
                                    //$details.append("<div class=""title"">" + restPatterns.Data[i].Description + "</div>");

                                    
                                    //Show all of the pattern matches
                                    for (j = 0; j < restPatterns.Data[i].Vehicles.length; j++) {
                                    	var vehicle = restPatterns.Data[i].Vehicles[j];
                                    	var selectedYear = $j(".api-year select option:selected").data('code');
                                    	var selectedMake = $j(".api-make select option:selected").data('code');
                                    	var selectedModel = $j(".api-model select option:selected").data('code');
                                    	var selectedTrim = $j(".api-trim select option:selected").data('code');
                                    	if (vehicle.YearFrom <= selectedYear && vehicle.YearTo >= selectedYear && vehicle.Make.ID == selectedMake && vehicle.Model.ID == selectedModel && vehicle.Trim.ID == selectedTrim)
                                    	{
                                    		$details.append('<div class="part-row"><span class="id">' + restPatterns.Data[i].Vehicles[j].ID + '</span>&nbsp;<span class="description">' + restPatterns.Data[i].Vehicles[j].YearFrom + "-" + restPatterns.Data[i].Vehicles[j].YearTo + "&nbsp;" + restPatterns.Data[i].Vehicles[j].Make.Value + "&nbsp;" + restPatterns.Data[i].Vehicles[j].Model.Value + "&nbsp;" + restPatterns.Data[i].Vehicles[j].Trim.Value  + '</span></div>');
                                    	}
                                    }
                                    

                                    //Add details
                                    //$details.append('<div class="details-container">sqft:<span class="sqft">' + new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(restPatterns.Data[i].Sqft) + '</span>;&nbsp;Difficulty:<span class="difficulty">' + new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(restPatterns.Data[i].Difficulty) + '</span></p>');
                                    $details.append('<div class="details-container">Difficulty:<span class="difficulty">' + new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(restPatterns.Data[i].Difficulty) + '</span></p>');
                                    $details.append('<div class="price">' + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(restPatterns.Data[i].Price) + '</div>');

                                    //Append the pattern to the container
                                    $patternBlock.append($preview);
                                    $patternBlock.append($title);
                                    $patternBlock.append($details);
                                    $container.append($patternBlock);

                                }

                                /* Show the pattern selector */
                                SelectPatterns();


                                /* Old behavior - show all the patterns */
                                $j(".api-patterns").fadeOut(function () {

                                	$j(".api-patterns").empty();

                                	var price = 0;

                                	for (i = 0; i < restPatterns.Data.length; i++) {

                                    // calculate price (total)
                                    price += restPatterns.Data[i].Price;

                                    // render patterns list
                                    var $patternBlock = $j("<div>", { class: "row pattern-container" });
                                    var $preview = $j("<div>", { class: "col-xs-4" });
                                    var $details = $j("<div>", { class: "col-xs-8" });


                                    var imgSrc = apiUrl + "patterns/preview/" + restPatterns.Data[i].PatternID + "/360/260"
                                    var $lnk = $j('<a>', {href:imgSrc, target: "_blank"}).append($j('<img>', {src:imgSrc, class:'et_pb_lightbox_image'}));
                                    $preview.append($lnk);

                                    $details.append("<h3>" + restPatterns.Data[i].Description + "</h3>");

                                    for (j = 0; j < restPatterns.Data[i].Vehicles.length; j++) {
                                    	$details.append("<code>" + restPatterns.Data[i].Vehicles[j].ID + "</code>&nbsp;" + restPatterns.Data[i].Vehicles[j].Make.Value + "&nbsp;" + restPatterns.Data[i].Vehicles[j].Model.Value + "&nbsp;" + restPatterns.Data[i].Vehicles[j].Trim.Value + "&nbsp;" + restPatterns.Data[i].Vehicles[j].YearFrom + "-" + restPatterns.Data[i].Vehicles[j].YearTo + "<br />");
                                    }


                                    $details.append("<p><small>" + "sqft:" + new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(restPatterns.Data[i].Sqft) + ";&nbsp;Difficulty:" + new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(restPatterns.Data[i].Difficulty) + "</small></p>");
                                    $details.append("<p><big><strong>" + new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(restPatterns.Data[i].Price) + "</strong></big></p>");

                                    $patternBlock.append($preview);
                                    $patternBlock.append($details);


                                    $j(".api-patterns").append($patternBlock);


                                }

                            });
                                $j(".api-patterns").fadeTo("slow", 1);
                                $j(".api-patterns").fadeIn();
                            }
                            else {

                            	ShowError(restPatterns.Errors);
                            }
                        }


                    });

});


            // sending authentication request
            $j.ajax({
            	type: "POST",
            	dataType: "json",
            	contentType: "application/json",
            	url: apiUrl + "auth",
            	data: JSON.stringify({ ID: "token", Value: apiToken }),                
            	success:
            	function (restData) {
            		if (restData.Success == true) {
                        // in case when we got 0 (Success), continue with data request

                        // API supports two modes: 1) makes first; 2) years first. The difference is when you are using Years first, you will filter
                        // further makes, models, trims and finally patterns with the year you selected first.
                        // Here we use Year first, therefore we are sending the data request for years.

                        $j.ajax({
                        	type: "GET",
                        	dataType: "json",
                        	contentType: "application/json",
                        	url: apiUrl + "years/0/0",
                        	data: null,
                        	success:
                        	function (restYears) {

                        		if (restYears.Success) {
                        			$j(".api-year select").empty();
                        			SetSelect(".api-year select", restYears.Data);
                        		} else {
                        			ShowError(restYears.Errors);
                        		}
                        	},
                        	error: function (xhr, textStatus, error) {


                        		ShowError(['Ajax error:', xhr.statusText + "; " + textStatus + "; " + error])
                        	}

                        });

                    }
                    else {


                    	ShowError(restData.Errors);

                    }
                }

            });
        });


}
