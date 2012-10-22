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
 
ArelXMLHelper::start(NULL);

//first arrow
$object360 = ArelXMLHelper::create360Object(
						"360", //id
						WWW_ROOT."/resources/360_new.md2", //model 
						WWW_ROOT."/resources/photo.JPG", //texture
						array(0,0,-1500), //translation
						array(40000, 40000, 40000), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90, 0, 0)) //rotation
				);

//make sure the object is always rendered first. small number == draw first
//not necessary here, but might be important if you have other 360objects with transparency in the scene
$object360->setRenderOrderPosition(-1000);
				
ArelXMLHelper::outputObject($object360);				

ArelXMLHelper::end();