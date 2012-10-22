<?php

/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 **/

require_once '../library/arel_xmlhelper.class.php';
require_once 'config.php';
 
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
ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/index.php?analyticsuser=" . ANALYTICS_USER);

//1. Sound POI
$oObject = ArelXMLHelper::createLocationBasedPOI(
		"1", //id
		"Hello Sound POI", //title
		array(48.12310, 11.218648, 0), //location
		WWW_ROOT . "/resources/thumb_sound.png", //thumb
		WWW_ROOT . "/resources/icon_sound.png", //icon
		"This is our Sound POI", //description
		array(array("Start Audio", "soundButton", "javascript: startSound(\"http://www.junaio.com/publisherDownload/tutorial/test.mp3\")")) //buttons
	);

//output the object
ArelXMLHelper::outputObject($oObject);

//2. Image POI
$oObject = ArelXMLHelper::createLocationBasedPOI(
		"2", //id
		"Hello Image POI", //title
		array(48.12325, 11.218691, 0), //location
		WWW_ROOT . "/resources/thumb_image.png", //thumb
		WWW_ROOT . "/resources/icon_image.png", //icon
		"This is our Image POI\n\nThe image source is: http://www.flickr.com/photos/ediamjunaio/5206110815/", //description
		array(array("Show Image", "imageButton", "javascript: openImage(\"http://farm5.static.flickr.com/4104/5206110815_7ea891be0b.jpg\")")) //buttons
	);

//output the object
ArelXMLHelper::outputObject($oObject);

//3. Video POI
$oObject = ArelXMLHelper::createLocationBasedPOI(
		"3", //id
		"Hello Video POI", //title
		array(48.12307, 11.218636, 0), //location
		WWW_ROOT . "/resources/thumb_video.png", //thumb
		WWW_ROOT . "/resources/icon_video.png", //icon
		"This is our Video POI", //description
		array(array("Start Movie", "movieButton", "javascript: startVideo(\"http://www.junaio.com/publisherDownload/tutorial/movie.mp4\")")) //buttons
	);

//output the object
ArelXMLHelper::outputObject($oObject);

//4. Custom POPup POI
$oObject = ArelXMLHelper::createLocationBasedPOI(
		"4", //id
		"Custom PopUp", //title
		array(48.12317,11.218670,0), //location
		WWW_ROOT . "/resources/thumb_custom.png", //thumb
		WWW_ROOT . "/resources/icon_custom.png" //icon		
	);

//add some parameters we will need with AREL
$oObject->addParameter("description", "This is my special POI. It will do just what I want.");
$oObject->addParameter("url", "http://www.junaio.com");
	
//output the object
ArelXMLHelper::outputObject($oObject);

//end the output
ArelXMLHelper::end();