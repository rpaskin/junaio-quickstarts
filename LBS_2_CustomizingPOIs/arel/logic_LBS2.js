arel.sceneReady(function()
{
	//Just for Debuging purposes
	//arel.Debug.activate();
	//arel.Debug.deactivateArelLogStream();
	
	//get the metaio man model reference
	var customPoi = arel.Scene.getObject("4");
	//get the sound poi reference
	var soundPoi = arel.Scene.getObject("1");
	
	//set a listener on the metaio man
	arel.Events.setListener(customPoi, function(obj, type, params){handleCustomPoiEvent(obj, type, params);});
	//set a listener on the sound poi
	arel.Events.setListener(soundPoi, function(obj, type, params){handlePoiSoundEvent(obj, type, params);});
});

function handleCustomPoiEvent(obj, type, param)
{
	//check if there is tracking information available
	if(type && type === arel.Events.Object.ONTOUCHSTARTED)
	{
		$('#info .text').html(obj.getParameter("description"));
		$('#info .buttons').html("<div class=\"button\" onclick=\"arel.Media.openWebsite('" + obj.getParameter("url") + "')\">" + obj.getParameter("url") + "</div>");
		$('#info').show();
	}	
};

function handlePoiSoundEvent(obj, type, param)
{
	//check if there is tracking information available
	if(type && type === arel.Events.Object.ONTOUCHSTARTED)
	{
		arel.Debug.log("Play Sound!!!");
		arel.Media.startSound("http://dev.junaio.com/publisherDownload/tutorial/test.mp3");
	}
};