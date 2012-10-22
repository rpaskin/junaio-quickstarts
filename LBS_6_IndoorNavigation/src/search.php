<?php

/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 **/

require_once '../library/arel_xmlhelper.class.php';
 
/**
 * When the channel is being viewed, a poi request will be sent
 * $_GET['l']...(optional) Position of the user when requesting poi search information
 * $_GET['o']...(optional) Orientation of the user when requesting poi search information
 * $_GET['p']...(optional) perimeter of the data requested in meters.
 * $_GET['uid']... Unique user identifier
 * $_GET['m']... (optional) limit of to be returned values
 * $_GET['page']...page number of result. e.g. m = 10: page 1: 1-10; page 2: 11-20, e.g.
 **/

if(!empty($_GET['l']))
    $position = explode(",", $_GET['l']);
else
    trigger_error("user position (l) missing. For testing, please provide a 'l' GET parameter with your request. e.g. pois/search/?l=23.34534,11.56734,0");
 
//make sure to provide the lla marker tracking configuration
ArelXMLHelper::start(NULL, WWW_ROOT."/arel/index.php", ArelXMLHelper::TRACKING_LLA_MARKER);

//first arrow
$arrowObject = ArelXMLHelper::createLocationBasedModel3D(
						"arrow1", //id
						"Arrow", //name
						WWW_ROOT."/resources/arrow.md2", //model 
						WWW_ROOT."/resources/arrow.png", //texture
						array(37.783248, -122.403244, 0), //location
						array(600, 600, 600), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERRAD, array(1.57, 0, 2.37)) //rotation
				);

//set the poi invisible in liveview, mapview/listview and radar
$arrowObject->setVisibility(false, false, false);
//move the arrow a little down
$arrowObject->setTranslation(array(0,0,-1500));
ArelXMLHelper::outputObject($arrowObject);				

//second arrow
$arrowObject = ArelXMLHelper::createLocationBasedModel3D(
						"arrow2", //id
						"Arrow", //name
						WWW_ROOT."/resources/arrow.md2", //model 
						WWW_ROOT."/resources/arrow.png", //texture
						array(37.783212, -122.403192, 0), //location
						array(600, 600, 600), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERRAD, array(1.57, 0, 2.37)) //rotation
				);

//set the poi invisible in liveview, mapview/listview and radar
$arrowObject->setVisibility(false, false, false);
//move the arrow a little down
$arrowObject->setTranslation(array(0,0,-1500));
ArelXMLHelper::outputObject($arrowObject);	

//1. Sound POI
$oObject = ArelXMLHelper::createLocationBasedPOI(
		"conf1", //id
		"Conference Room 1", //title
		array(37.783294, -122.403299, 0), //location
		WWW_ROOT."/resources/1.png", //thumb
		WWW_ROOT."/resources/1.png", //icon
		"This is Conference Room 1 with many interesting sessions going on today.", //description
		array() //buttons
	);

//set the poi invisible in liveview, mapview/listview and radar
$oObject->setVisibility(false, false, false);
ArelXMLHelper::outputObject($oObject);	

ArelXMLHelper::end();