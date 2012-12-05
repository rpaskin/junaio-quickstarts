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
ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/index.php", WWW_ROOT . "/resources/tracking_glue5.zip");

//video
$oObject = ArelXMLHelper::createGLUEModel3DFromMovie(
											"movie",
											WWW_ROOT . "/resources/coral.3g2", 
											array(0,0,0), //translation 
											array(2.5,2.5,2.5), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)), //rotation
											1 //CoordinateSystemID)
										);
//output the object
ArelXMLHelper::outputObject($oObject);

//image
$oObject = ArelXMLHelper::createGLUEModel3DFromImage(
											"image",
											WWW_ROOT . "/resources/image.png", 
											array(0,-70,0), //translation 
											array(5,5,5), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)), //rotation
											2 //CoordinateSystemID)
										);
										
//output the object
ArelXMLHelper::outputObject($oObject);

//transparent video
$oObject = ArelXMLHelper::createGLUEModel3DFromMovie(
											"movieTransparent",
											WWW_ROOT . "/resources/sampleMovie.alpha.3g2", 
											array(0,-50,0), //translation 
											array(2.5,2.5,2.5), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,-90)), //rotation
											3 //CoordinateSystemID)
										);
//output the object
ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();