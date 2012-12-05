<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 * 
 * @abstract	The tutorial shows how to use the google analytics plugin in combination with your channel. Please make sure to include
 * 				your profile ID in the config.php. More information can be found on junai in the arel plugin section.
 * 				Please make sure to follow the Google Analytics Terms of service.
 * 				 				
 * 				Learnings:
 * 					- using Google Analytics with junaio
 * 					- calling javascript methods from a popup button
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
	//define the public path
	//this will be used for refreencing information in the search.php
	define('WWW_ROOT', "http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME'])); //path to online location

	//the search return needs to be provided
	include 'search.php';
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