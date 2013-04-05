<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	Using junaio to create a 360 degree experience
 * 				 				
 * 				Learnings:
 * 					- use create360Object in the Arel XML Helper
 **/

require_once '../ARELLibrary/arel_xmlhelper.class.php';
 
if(!empty($_GET['l']))
    $position = explode(",", $_GET['l']);
else
    trigger_error("user position (l) missing. For testing, please provide a 'l' GET parameter with your request. e.g. pois/search/?l=23.34534,11.56734,0");
 
ArelXMLHelper::start(NULL,NULL,"Orientation");

//first arrow
$object360 = ArelXMLHelper::create360Object(
						"360", //id
						"/resources/360_new.zip", //model 
						"/resources/photo.JPG", //texture
						array(0,0,-1500), //translation
						array(40000, 40000, 40000), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90, 0, 0)) //rotation
				);

//make sure the object is always rendered first. small number == draw first
//not necessary here, but might be important if you have other 360objects with transparency in the scene
$object360->setRenderOrderPosition(-1000);
				
ArelXMLHelper::outputObject($object360);				

ArelXMLHelper::end();

?>