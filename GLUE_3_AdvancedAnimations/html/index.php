<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	This tutorial provides an advanced understanding of how animation work in junaio and how they can be controlled. Also, an occlusion model is included 
 * 				in this tutorial.
 * 				
 * 				Learnings:
 * 					- overlay multiple 3D models on an image
 * 					- use occlusion and transparency on models
 * 					- provide additional parameter in the AREL XML output to be used by AREL JS
 * 					- show html information on which image to track
 * 					- advanced way of hiding and displaying the "what to track" information based on tracking events
 * 					- start an animation based on tracking events
 * 					- using an arel plugin to allow fade in and fade out
 * 					- playing sounds in junaio
 * 
 *  			Animation Flow in the tutorial:
 *  			trooper "appear" -> metaio man fade in (no animation) -> metaio man "idle" {1s after metaio man is done fading in} trooper "fire" -> 
 *  			metaio man "shock_up" -> metaio man "idle" once -> metaio man "close_down" -> metaio man "close_up" AND trooper "die" -> metaio man "idle" 
 *  
 *  			{2s after trooper died}
 *  			start over! 
 **/

//if issues occur with htaccess, also the path variable can be used
//htaccess rewrite enabled:
//Callback URL: http://www.callbackURL.com
//
//htacces disabled:
//Callback URL: http://www.callbackURL.com/?path=

if(isset($_GET['path']))
	$path = $_GET['path'];
else
	$path = $_SERVER['REQUEST_URI'];
	
$aUrl = explode('/', $path);

//if the request if correct, return the information
if(in_array_substr('search', $aUrl))
{
	define('WWW_ROOT', "http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME'])); //path to online location
	
	//the search return needs to be provided
	include '../src/search.php';
	exit;
}	


// Wrong request -> return not found
header('HTTP/1.0 404 Not found');

function in_array_substr($needle, $haystack)
{
	foreach($haystack as $value)
	{
		if(strpos($value, $needle) !== false)
			return true;
	}
	
	return false;	
}