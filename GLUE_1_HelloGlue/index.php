<?php
/**
 * @copyright	Copyright 2012 metaio GmbH. All rights reserved.
 * @link		http://www.metaio.com
 * @author		Frank Angermann
 * 
 * @abstract	This is a very simple overlay of a 3D Model onto a glue man pattern. 
 * 				
 * 				Learnings: 
 * 						- basic understanding of the XML structure
 *						- usage of unencrypted md2 models 	
 **/

//if issues occur with htaccess, also the path variable can be used
//htaccess rewrite enabled:
//Callback URL: http://www.callbackURL.com
//
//htacces disabled:
//Callback URL: http://www.callbackURL.com/?path=

echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>
		<results trackingurl=\"http://dev.junaio.com/publisherDownload/tutorial/tracking_tutorial.zip\">
			<object id=\"1\">
				<popup>
					<description><![CDATA[This is our metaio man.]]></description>
					<buttons>
						<button id=\"url\" name=\"junaio dev page\"><![CDATA[http://dev.junaio.com]]></button>
					</buttons>
				</popup>
				<assets3d>
					<model><![CDATA[http://dev.junaio.com/publisherDownload/tutorial/metaioman.md2]]></model>
					<texture><![CDATA[http://dev.junaio.com/publisherDownload/tutorial/metaioman.png]]></texture>
					<transform>
						<translation>
							<x>0</x>
							<y>-100</y>
							<z>0</z>
						</translation>
						<rotation type=\"eulerdeg\">
							<x>-90</x>
							<y>0</y>
							<z>0</z>
						</rotation>
						<scale>
							<x>3</x>
							<y>3</y>
							<z>3</z>
						</scale>
					</transform>
					<properties>
						<coordinatesystemid>1</coordinatesystemid>
					</properties>					
				</assets3d>
			</object>
		</results>";
exit;