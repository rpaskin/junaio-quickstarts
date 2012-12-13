<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Nicolas King
 * 
 * @abstract	This tutorial gives you a basic understanding of image recogination with junaio and working with animated md2 models. 
 * 				You will need the metaio man image.
 * 				
 * 				Learnings:
 * 					- overlay a 3D model on an image
 * 					- show html information on which image to track
 * 					- hide and display the "what to track" information based on tracking events
 * 					- start an animation based on touchstart (click) event of the object
 * 					- start an animation based on animation ended event of the object 
 **/

error_reporting(E_ALL);
ini_set('display_errors', '1');

require_once '../ARELLibrary/arel_xmlhelper.class.php';
 
//use the Arel Helper to start the output with arel
//start output
ArelXMLHelper::start(NULL, "arel.html", NULL);

	//Create the blaster
	$id = "blaster";
	$model = "legoBlaster.zip"; 
	$texture = "legoBlaster.png";
	$screenAnchor = ArelAnchor::ANCHOR_BR; 
	$scale = array(0.75,0.75,0.75); 
	$rotation = array(0,90,0);
	
	$oObject = ArelXMLHelper::createScreenFixedModel3D(	$id, 
														$model, 
														$texture, 
														$screenAnchor, 
														$scale, 
														new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation));
														
	ArelXMLHelper::outputObject($oObject);													

	//Create the Crosshair
	$id = "fadenkreuz";
	$model = ""; 
	$texture = "fadenkreuz.png";
	$screenAnchor = ArelAnchor::ANCHOR_CC; 
	$scale = array(1,1,1); 
	$rotation = array(0,0,0);
	
	$oObject = ArelXMLHelper::createScreenFixedModel3D(	$id, 
														$model, 
														$texture, 
														$screenAnchor, 
														$scale, 
														new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation));
														
	ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();