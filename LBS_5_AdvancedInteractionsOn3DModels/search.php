<?php

/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 **/

require_once '../ARELLibrary/arel_xmlhelper.class.php';
 
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
 
//start the xml output
ArelXMLHelper::start(NULL, WWW_ROOT."/arel/index.php");

//return the lego man 
$oLegoMan = ArelXMLHelper::createLocationBasedModel3D(
	"1", // id
	"lego man", //title
	WWW_ROOT . "/resources/walking_model3_7fps.md2", // mainresource
	WWW_ROOT . "/resources/walking_model.png", // resource
	$position, // location
	array(0.2, 0.2, 0.2), // scale
	new ArelRotation(ArelRotation::ROTATION_EULERRAD, array(1.57,0,1.57)) // rotation
);

//set a translation offset for the lego man, based on the current users position
$oLegoMan->setTranslation(array(0,1000,0));

//return the model and end the output
ArelXMLHelper::outputObject($oLegoMan);
ArelXMLHelper::end();