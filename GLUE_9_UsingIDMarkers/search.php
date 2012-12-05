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
 
//use the Arel Helper to start the output with arel

//start output
ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/index.php", WWW_ROOT  ."/resources/trackingXML1-3.xml");

//return the trooper and place him on ID Marker 2
$oObject = ArelXMLHelper::createGLUEModel3D(
											"lTrooper",	//ID 
											WWW_ROOT . "/resources/legoStormTrooper.md2", //model 
											WWW_ROOT . "/resources/legoStormTrooper.png", //texture
											array(0,0,0), //translation
											array(0.05,0.05,0.05), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)), //rotation
											2 //CoordinateSystemID
										);

ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();