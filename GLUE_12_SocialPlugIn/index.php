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

require_once '../ARELLibrary/arel_xmlhelper.class.php';
 
//use the Arel Helper to start the output with arel
//start output
ArelXMLHelper::start(NULL, "arel/index.html", "http://www.junaio.com/publisherDownload/tutorial/tracking_tutorial.zip");

//end the output
ArelXMLHelper::end();