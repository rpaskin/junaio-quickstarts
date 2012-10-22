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
 
ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/index.php");

//a trooper
$legoMan = ArelXMLHelper::create360Object(
						"legoTrooper", //id
						WWW_ROOT."/resources/legoStormTrooper.md2", //model 
						WWW_ROOT."/resources/legoStormTrooper.png", //texture
						array(0,2000,-1500), //translation
						array(0.4, 0.4, 0.4), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90, 0, 90)) //rotation
				);

ArelXMLHelper::outputObject($legoMan);

//the weapon
$legoWeapon = ArelXMLHelper::createScreenFixedModel3D(
						"legoBlaster", //id
						WWW_ROOT."/resources/legoBlaster.md2", //model 
						WWW_ROOT."/resources/legoBlaster.png", //texture
						array(0, 0), //screen coordinates
						array(1, 1, 1), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0, 90, 0)) //rotation
				);

ArelXMLHelper::outputObject($legoWeapon);

//occlusion model
$box = ArelXMLHelper::create360Object(
						"box", //id
						WWW_ROOT."/resources/occlusionBox.md2", //model
						NULL, 
						array(0,0,-6400), //translation
						array(50, 50, 50), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90, 0, 90)) //rotation
				);

$box->setOccluding(true);

ArelXMLHelper::outputObject($box);

ArelXMLHelper::end();