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
 
//use the Arel Helper to start the output with arel

//start output
ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/index.php", "http://www.junaio.com/publisherDownload/tutorial/tracking_tutorial.zip");

//metaio man 3D Model
//Important: note how it is set to transparent 
$oObject = ArelXMLHelper::createGLUEModel3D(
											"mMan",	//ID 
											"http://dev.junaio.com/publisherDownload/tutorial/metaioman.md2", //model Path 
											"http://dev.junaio.com/publisherDownload/tutorial/metaioman.png", //texture Path
											array(-150,-100,0), //translation
											array(2,2,2), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,90)), //rotation
											1 //CoordinateSystemID
										);
//set the object transparent
$oObject->setTransparency(1);
//return the model
ArelXMLHelper::outputObject($oObject);

//2. a trooper model
//note the additional parameter that is used in AREL JS
$oObject = ArelXMLHelper::createGLUEModel3D(
											"lTrooper",	//ID 
											WWW_ROOT."/resources/legoStormTrooper.md2", //model 
											WWW_ROOT."/resources/legoStormTrooper.png", //texture
											array(150,-100,0), //translation
											array(0.1,0.1,0.1), //scale
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90,0,0)), //rotation
											1 //CoordinateSystemID
										);
										
//the sound will be needed in AREL JS once the anmation starts
$oObject->addParameter("appearSound", WWW_ROOT . "/resources/beam.mp3");
//return the model
ArelXMLHelper::outputObject($oObject);

//the occlusion box, making the trooper invisible for the time it has not appeared
$box = ArelXMLHelper::createGLUEModel3D(
						"box", //id
						WWW_ROOT."/resources/occlusionBox.md2", //model
						NULL, 
						array(0,-350,-350), //translation
						array(7, 7, 7), //scale
						new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)) //rotation
				);

//this model is set as a occlusion model
$box->setOccluding(true);

//output the object
ArelXMLHelper::outputObject($box);

//end the output
ArelXMLHelper::end();