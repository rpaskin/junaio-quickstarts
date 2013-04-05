<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	Your own AR Shooter
 * 				 				
 * 				Learnings:
 * 				(Simple)
 * 					- use occlusion with location based channels
 *					- advanced animation control
 *					- use the getObjectFromScreenCoordinates to determine which 3D model was hit 
 * 				(Advanced) - look for the *ADVANCED* comments
 * 					- adding new models on the fly (more troopers to shoot)
 **/

require_once '../ARELLibrary/arel_xmlhelper.class.php';

if(!empty($_GET['l']))
    $position = explode(",", $_GET['l']);
else
    trigger_error("user position (l) missing. For testing, please provide a 'l' GET parameter with your request. e.g. pois/search/?l=23.34534,11.56734,0");
 
ArelXMLHelper::start(NULL, "/arel/index.html", ArelXMLHelper::TRACKING_GPS);

//a trooper
$legoMan = ArelXMLHelper::create360Object(
						"legoTrooper", //id
						"/resources/legoStormTrooper.zip", //model 
						"/resources/legoStormTrooper.png", //texture
						array(0,2000,-1500), //translation
						array(0.4, 0.4, 0.4), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90, 0, 90)) //rotation
				);

ArelXMLHelper::outputObject($legoMan);

//the weapon
$legoWeapon = ArelXMLHelper::createScreenFixedModel3D(
						"legoBlaster", //id
						"/resources/legoBlaster.zip", //model 
						"/resources/legoBlaster.png", //texture
						ArelAnchor::ANCHOR_BR, //screen Anchor
						array(1,1,1), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0, 90, 0)) //rotation
				);
				
ArelXMLHelper::outputObject($legoWeapon);

//occlusion model
$box = ArelXMLHelper::create360Object(
						"box", //id
						"/resources/occlusionBox.zip", //model
						NULL, 
						array(0,0,-6400), //translation
						array(50, 50, 50), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90, 0, 90)) //rotation
				);

$box->setOccluding(true);

ArelXMLHelper::outputObject($box);

ArelXMLHelper::end();

?>