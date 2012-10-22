<?php

/**
 * @copyright  Copyright 2010 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 **/

require_once '../library/arel_xmlhelper.class.php';

/**
 * When the channel is being viewed, a poi request will be sent
 * $_GET['l']...Position of the user when requesting poi search information
 * $_GET['o']...Orientation of the user when requesting poi search information
 * $_GET['uid']... Unique user identifier
 **/

if(!empty($_GET['l']))
	$position = explode(",", $_GET['l']);
else
	trigger_error("user position (l) missing. For testing, please provide a 'l' GET parameter with your request. e.g. pois/search/?l=23.34534,11.56734,0");

//create the xml start
ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/index.php", NULL);

//start by defining some positions of geo referenced POIs and give those names and thumbnails
$treasureLocations = array(
	array("37.772547,-122.418437,0", "San Francisco", "NorthAmerica"),
	array("48.160747,11.551219,0", "Munich", "Europe"),
	array("48.857261,2.3493,0", "Paris", "Europe"),
	array("40.73269,-73.995094,0", "New York", "NorthAmerica"),
	array("-33.92399,18.463669,0", "Cape Town", "Africa"),
	array("30.062557,31.246433,0", "Cairo", "Africa"),
	array("-37.813107,144.96304,0", "Melbourne", "Australia"),
	array("3.139145,101.689396,0", "Kuala Lumpur", "Asia"),
	array("35.685187,139.692306,0", "Tokio", "Asia"),
	array("19.019279,72.849541,0", "Mumbai", "Asia"),
	array("-12.042007,-77.040482,0", "Lima", "SouthAmerica"),
	array("51.493355,-0.127945,0", "London", "Europe")
);

//display the POIs as defined in the Constructor
foreach($treasureLocations as $i => $findPOI)
{	
	//title of the POI
	$title = "Treasure " . $findPOI[1];
	
	//create the POI
	$poi = ArelXMLHelper::createLocationBasedPOI($i, $title, explode(",", $findPOI[0]), WWW_ROOT . "/resources/thumb.png", WWW_ROOT . "/resources/icon.png", "A beautiful city", NULL);
	
	//20000km -> 20'000'000m -> see them all over the world
	$poi->setMaxDistance(20000000);	
	
	ArelXMLHelper::outputObject($poi);
}				

ArelXMLHelper::end();
exit;