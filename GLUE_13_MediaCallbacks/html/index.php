<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 */

error_reporting(E_ALL);
ini_set('display_errors', '1');


require_once '../config/config.php';
require_once '../library/junaio.class.php';

//WWW_ROOT will hold the path to the html folder -> makes resource referencing easier later on
define('WWW_ROOT', "http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME'])); //path to online location
//define('CHANNELS_PATH', dirname(dirname(dirname(__FILE__)))); // path to channels
define('CHANNELS_PATH', dirname(dirname(dirname(dirname(dirname(dirname(__FILE__))))))); // path to channels

// Check junaio authentication header
// Settings for the authentication can be found in config.php
/*if (!Junaio::checkAuthentication()) {
	header('HTTP/1.0 401 Unauthorized');
	exit;
}*/

//if issues occur with htaccess, also the path variable can be used
//
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

// Include xml generation file, depending on the request
// pois/search -> search.php
// pois/event -> event.php
// pois/visualsearch

if(in_array('pois', $aUrl))
{
	if(in_array_substr('search', $aUrl))
	{
		//the search return needs to be provided
		include '../src/search.php';
		exit;
	}	
}	

// Wrong url
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
