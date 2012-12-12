/**
 * @copyright  Copyright 2012 metaio GmbH. All rights reserved.
 * @link       http://www.metaio.com
 * @author     Frank Angermann
 */
arel.sceneReady(function()
{
	//Just for Debuging purposes
	//arel.Debug.activate();
	//arel.Debug.deactivateArelLogStream();
	
	oMemory = new memory();
	
	$('.info').show();
});

function restart(button)
{
	button.style.backgroundColor='#fff';
	//restart the channel
	arel.Scene.switchChannel(oMemory.channelID);
}

function memory()
{
	//result in the first draw
	this.firstDraw = undefined;
	//result in the second draw
	this.secondDraw = undefined;
	
	//a time
	this.timerID = undefined;
	
	//how often is the animation of the modelFound repeated
	this.animationCounter = 0;
	this.animationMaxCount = 3;
	//which cards have been found
	this.found = [];
	//play score and turn
	this.playerScore = {1: 0, 2: 0};
	this.playerTurns = {1: 0, 2: 0};
	
	//which player's turn is it?
	this.currentPlayer = 1;
	
	//just store the channel ID for a restart
	this.channelID = undefined;
			
	this.init = function()
	{
		var that = this;
		
		try
		{
			//init the scene
			this.channelID = arel.Scene.getID();
			
			//get all Objects
			var aAllObjects = arel.Scene.getObjects();
			
			//set event listeners for all objects (unless they have been found already)
			for(var i in aAllObjects)
			{
				if(typeof(aAllObjects[i]) !== "function" && $.inArray(aAllObjects[i].getID(), this.found) === -1)
				{
					arel.Events.setListener(aAllObjects[i], function(obj, type, params){that.handleObjectEvent(obj, type, params);});
				}
			};
			
			//show the message
			arel.Events.setListener(arel.Scene, function(type, param){that.trackingHandler(type, param);});		
		}
		
		catch(e)
		{
			arel.Debug.error("init: " + e);
		}
	};	
	
	this.trackingHandler = function(type, param)
	{
		//check if there is tracking information available
		if(param[0] !== undefined)
		{
			//if the pattern is found, hide the information to hold your phone over the pattern
			if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_TRACKING)
			{
				$('.info').hide();
			}
			//if the pattern is lost tracking, show the information to hold your phone over the pattern
			else if(type && type == arel.Events.Scene.ONTRACKING && param[0].getState() == arel.Tracking.STATE_NOTTRACKING)
			{
				$('.info').show();
			}
		}
	};
	
	this.handleObjectEvent = function(obj, type, params)
	{
		var that = this;
		try
		{
			//handling of the memory cards
			if(type && type === arel.Events.Object.ONTOUCHSTARTED && !isNaN(obj.getID()))
			{
				if(this.firstDraw)
				{
					obj.startAnimation("up");
					this.secondDraw = obj.getID();
					
					//detemine whether they match or not, match are: 1,2 - 3,4 - 5,6 - ...
					var matchFound = false;
					
					if(this.firstDraw % 2 === 0)
					{
						if(this.firstDraw - 1 == this.secondDraw)
							matchFound = true;
					}
					else if(this.secondDraw % 2 === 0)
					{
						if(this.secondDraw - 1 == this.firstDraw)
							matchFound = true;
					}
					
					if(!matchFound)
					{
						//set a timer to change the turned cards back
						this.timerID = setTimeout(function(){that.turnCardsBack();}, 3000);
						
						//trigger a vibration if no match was found
						arel.Media.triggerVibration();							
					}
					else
					{
						//add the cards to the found stack
						this.found.push(this.firstDraw);
						this.found.push(this.secondDraw);
						
						//reset the found cards
						this.firstDraw = undefined;
						this.secondDraw = undefined;
						
						//update player score
						this.playerScore[this.currentPlayer]++;
						$('.scorePlayer' + this.currentPlayer).html("Score: " + this.playerScore[this.currentPlayer]);
						
						//check if the game is over
						//if all cards have been found, the game is over
						if(this.found.length == amountOfCards)
						{
							var winner = "Player 2";
							if(this.playerScore[1] > this.playerScore[2])
								winner = "Player 1";	
							
							//hide everything and show the winner
							if(this.currentPlayer == 1)
								$('.infoPlayer1').hide();
							else							
								$('.infoPlayer2').hide();
							
							$('.player1').hide();
							$('.player2').hide();
							
							$('.result').html("<b>The winner is:<br />" + winner + "</b>");
							$('.result').show();
							
							$('.restart').show();	
							
							//disable the tracking fadein
							arel.Events.removeListener(arel.Scene);
						}
						
						//show the according match model -> in the parameter: foundModelID we have the id of the Model
						arel.Scene.getObject(obj.getParameter("foundModelID")).setScale(new arel.Vector3D(2,2,2));
						arel.Scene.getObject(obj.getParameter("foundModelID")).startAnimation("click");						
					}
					
					//meanwhile, make sure no other card can be turned -> remove the listeners
					var aAllObjects = arel.Scene.getObjects();
					
					for(var i in aAllObjects)
					{
						if(typeof(aAllObjects[i]) !== "function")
						{
							if(aAllObjects[i].getID() !== this.firstDraw && aAllObjects[i].getID() !== this.secondDraw && !isNaN(aAllObjects[i].getID()))
								arel.Events.removeListener(aAllObjects[i]);
						}
					};
					
				}
				else
				{
					obj.startAnimation("up");
					this.firstDraw = obj.getID();
									
					//remove the event from this card, so you can not turn it back
					arel.Events.removeListener(obj);
				}
				
				
			}
			//the models one you found a match -> the click animation scales it up
			else if(type && type === arel.Events.Object.ONANIMATIONENDED && params.animationname == "click")
			{
				obj.startAnimation("idle");
				
				//play some music -> this is currently kept in the resources (no the final solution ;) )
				arel.Media.startSound(obj.getParameter("soundFound"), false);
			}
			//play the idle animation this.animationMaxCount times and then scale it back to 0
			else if(type && type === arel.Events.Object.ONANIMATIONENDED && params.animationname == "idle")
			{
				this.animationCounter++;
				
				if(this.animationCounter >= this.animationMaxCount)
				{
					obj.setScale(new arel.Vector3D(0.0001,0.0001,0.0001));
					this.animationCounter = 0;
					
					//reset object handler
					this.init();
				}
				else
					obj.startAnimation("idle");
			}
		}
		catch(e)
		{
			arel.Debug.error("handleObject: " + e);
		}
	};
	
	//if no match was found, turn the cards all back again
	this.turnCardsBack = function()
	{
		try
		{
			//turn back the two cards that were turned
			arel.Scene.getObject(this.firstDraw).startAnimation("down");
			arel.Scene.getObject(this.secondDraw).startAnimation("down");
			
			this.firstDraw = undefined;
			this.secondDraw = undefined;
						
			//reset all event listeners
			this.nextPlayer();
			this.init();
		}
		catch(e)
		{
			arel.Debug.error("turnback: " + e);
		}
	};
	
	//next players turn
	this.nextPlayer = function()
	{
		//count the turns
		this.playerTurns[this.currentPlayer]++;
		$('.turnsPlayer' + this.currentPlayer).html("Turns : " + this.playerTurns[this.currentPlayer]);
		
		if(this.currentPlayer == 1)
		{
			$('.infoPlayer1').hide();
			$('.infoPlayer2').show();
			this.currentPlayer = 2;
		}
		else
		{
			$('.infoPlayer2').hide();
			$('.infoPlayer1').show();
			this.currentPlayer = 1;
		}
	};
	
	this.init();
}