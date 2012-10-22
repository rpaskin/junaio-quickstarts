<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 *  
 * @abstract	This tutorial provides an advanced understanding of how interactions with 3D Models work in junaio and how they can be controlled.
 * 				You will create a memory game for 2 players. Once a matching set of memory cards was found, the shown 3D model will be started with some sound. 
 * 				
 * 				Learnings:
 * 					- overlay multiple 3D models on an image
 * 					- advanced interactions with the 3D models
 * 					- use scaling to hide the models that are not needed to a given time
 * 					- provide additional parameter in the AREL XML output to be used by AREL JS
 * 					- show html information on which image to track
 * 					- hide and display the "what to track" information based on tracking events
 * 					- show a new model in certain circumstances 
 *  			
 **/



require_once '../config/config.php';

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