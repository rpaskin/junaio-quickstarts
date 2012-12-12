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

require_once '../ARELLibrary/arel_xmlhelper.class.php';

//Define the card game size
define('AMOUNT_OF_CARDS', 16); //if changed, make sure it is an even number ;)
define('CARDS_PER_ROW', 4);

$trackingXML = "resources/trackingMusic.zip";

//stat the AREL output
//make sure to pass the information, on how many cards are in the game to the AREL JS side
ArelXMLHelper::start(NULL, "arel/index.php?amntCards=" . AMOUNT_OF_CARDS, $trackingXML);

//randomize the order of the cards
$cardIDs = range(1, AMOUNT_OF_CARDS);
shuffle($cardIDs);
	
//return the cards with different textures
for($i = 0; $i < AMOUNT_OF_CARDS; $i++)
{
	//position the cards
	$y = 150 * floor($i / CARDS_PER_ROW) - 200;
	$x = 150 * ($i % CARDS_PER_ROW) - 250;
	
	//get the texture -> texture name is one for the odd ones (so 1 and 2 have the same texture, texture is only 1)
	//you can check the resources folder: e.g. texture_1.png, texture_3.png, etc...
	
	$j = $cardIDs[$i];
	if($cardIDs[$i] % 2 == 0)
		$j = $cardIDs[$i] - 1;
	
	
	//create the memory card
	$memoryCard = ArelXMLHelper::createGLUEModel3D($cardIDs[$i], "resources/memory.zip", "resources/texture_$j.png", array($x, $y, 0), array(3,3,3), new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)), 1);
	
	//add a parameter to the memory Card to which model shall be opened once the matching pair is found
	//see further down ($foundModel)
	$memoryCard->addParameter("foundModelID", "model_$j");
	
	//output the memory card one by one
	ArelXMLHelper::outputObject($memoryCard);
}
 
//the models if a match was found
$aModelIDs = array("model_1", "model_3", "model_5", "model_7", "model_9", "model_11", "model_13", "model_15");

//return all the models to be opened
foreach($aModelIDs as $model)
{
	//return the model to be found -> scale them really tiny, so they are not seen
	$foundModel = ArelXMLHelper::createGLUEModel3D($model, "resources/models/$model.zip", NULL, array(0,0,0), array(0.01, 0.01, 0.01), new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90, 0, 90)), 1);
	
	//currently, we have to make sure the sound is being downloaded -> add it to the parameter
	//if only referenced in AREL JS, it will not be downloaded
	//this sound will be played when the model is found
	$foundModel->addParameter("soundFound", "resources/sound/$model.mp3");
	
	//output
	ArelXMLHelper::outputObject($foundModel);
}

ArelXMLHelper::end();	

?>