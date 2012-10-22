<?php

/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 **/

require_once '../library/arel_xmlhelper.class.php';

$trackingXML = WWW_ROOT . "/resources/trackingMusic.zip";

//stat the AREL output
//make sure to pass the information, on how many cards are in the game to the AREL JS side
ArelXMLHelper::start(NULL, WWW_ROOT . "/arel/index.php?amntCards=" . AMOUNT_OF_CARDS, $trackingXML);

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
	$memoryCard = ArelXMLHelper::createGLUEModel3D($cardIDs[$i], WWW_ROOT . "/resources/memory.md2", WWW_ROOT . "/resources/texture_$j.png", array($x, $y, 0), array(3,3,3), new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(0,0,0)), 1);
	
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
	$foundModel = ArelXMLHelper::createGLUEModel3D($model, WWW_ROOT . "/resources/models/$model.zip", NULL, array(0,0,0), array(0.01, 0.01, 0.01), new ArelRotation(ArelRotation::ROTATION_EULERDEG, array(90, 0, 90)), 1);
	
	//currently, we have to make sure the sound is being downloaded -> add it to the parameter
	//if only referenced in AREL JS, it will not be downloaded
	//this sound will be played when the model is found
	$foundModel->addParameter("soundFound", WWW_ROOT . "/resources/sound/$model.mp3");
	
	//output
	ArelXMLHelper::outputObject($foundModel);
}

ArelXMLHelper::end();	