var timer;
var timer_is_on=0;

arel.sceneReady(function()
	{
       move();
	});






function move()
{
	var object = arel.Scene.getObject("imgmid");

    var anchors = Array(
        arel.Constants.ANCHOR_TL,
        arel.Constants.ANCHOR_TC,
        arel.Constants.ANCHOR_TR,
        arel.Constants.ANCHOR_CL,
        arel.Constants.ANCHOR_CC,
        arel.Constants.ANCHOR_CR,
        arel.Constants.ANCHOR_BL,
        arel.Constants.ANCHOR_BC,
        arel.Constants.ANCHOR_BR
    );

    // let the object jump around
    object.setScreenAnchor(anchors[Math.floor(Math.random()*anchors.length)]);
}