<?php
/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Stephan Evers
 **/

define('JUNAIO_KEY', '9b9f50f7e5dcbc322e3b68d23e0a90ff');

define('ROOT_PATH', dirname(dirname(dirname(__FILE__)))); // path to channels.junaio.com
define('CHANNEL_ROOT_PATH', dirname(__FILE__)); //path to specific channel
define('CHANNELS_PATH', dirname(dirname(dirname(dirname(dirname(dirname(__FILE__)))))));
define('WWW_ROOT', "http://".$_SERVER['HTTP_HOST'].dirname($_SERVER['SCRIPT_NAME'])); //path to online location

define('DEFAULT_DISTANCE', 5000);
define('MAX_DISTANCE', 500000);
define('DEFAULT_AMOUNT', 20);
define('DEBUG', false);

set_include_path(
	implode(
		PATH_SEPARATOR,
		array(
			realpath(ROOT_PATH . '/ext-lib/'),
			get_include_path(),
		)
	)
);