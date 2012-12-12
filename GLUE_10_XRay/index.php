<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Nicolas King
 **/

error_reporting(E_ALL);			//for displaying errors
ini_set("display_errors", 1);

require_once '../ARELLibrary/arel_xmlhelper.class.php';

$trackingXML = "http://dev.junaio.com/publisherDownload/tutorial/tracking_tutorial.zip";
$arelPath = "";
		
ArelXMLHelper::start(NULL,$arelPath,$trackingXML);


//Relative to Screen Overlay

$id = "overlay";
$model = "/resources/overlay.zip";
$texture = "";
$screenCoordinates = ArelAnchor::ANCHOR_CC;
$scale = array(20,20,20);
$rotation = array(0,0,0);

$oObject = ArelXMLHelper::createScreenFixedModel3D(	$id,
													$model,
													$texture,
													$screenCoordinates,
													$scale,
													new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation)
												);	
			
$oObject->setOccluding(true);

ArelXMLHelper::outputObject($oObject);


//Relative to Screen Frame

$id = "frame";
$model = "/resources/frame.zip";
$texture = "";
$screenCoordinates = ArelAnchor::ANCHOR_CC;
//$scale = array(3.5,3.5,3.5);
$rotation = array(0,0,0);

$oObject = ArelXMLHelper::createScreenFixedModel3D(	$id,
													$model,
													$texture,
													$screenCoordinates,
													$scale,
													new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation)
												);	

$oObject->setScreenAnchorFlag(0);
												
ArelXMLHelper::outputObject($oObject);

// metaio man

$id = "metaioman"; 
$model = "/resources/metaioman_xray.zip";  
$texture = "";  
$translation = array(0,0,0);  
$scale = array(50,50,50);
$rotation = array(0,0,0); 
$coordinateSystemID = 1;

$oObject = ArelXMLHelper::createGLUEModel3D(	$id,
											$model,
											$texture,
											$translation,
											$scale,
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation),
											$coordinateSystemID 
										);
									
ArelXMLHelper::outputObject($oObject);

// plain

$id = "plain"; 
$model = "/resources/plain.zip";  
$texture = "";  
$translation = array(0.5,0.5,-10000);  
$scale = array(10000,10000,10000);  
$rotation = array(0,0,0); 
$coordinateSystemID = 1;

$oObject = ArelXMLHelper::createGLUEModel3D(	$id,
											$model,
											$texture,
											$translation,
											$scale,
											new ArelRotation(ArelRotation::ROTATION_EULERDEG, $rotation),
											$coordinateSystemID 
										);
		
ArelXMLHelper::outputObject($oObject);

ArelXMLHelper::end();

?>