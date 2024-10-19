//***************************************************************************************//
//
//	Main Javascript file for connecting every javascript functions
//	Created By Giryong Jong. 1/3/2015
//
//***************************************************************************************//

jQuery(document).ready(function(){
								
	var initObj		= new initEnv();
	
	initObj.init();
});

var initEnv			= function()
{ 
	var main		= this;

	main.objNode 	= null;
	main.objAction 	= null;
	main.objOverlay = null;

	this.init		= function()
	{
		main.objNode 	= new classNode();
		main.objNode.init();

		main.objAction 	= new classAction();
		main.objAction.init(main);

		main.objOverlay = new classOverlay();
		main.objOverlay.init(main);
	};

	this.initCSS	= function()
	{
		
	};

	this.initEvent 	= function()
	{
		
	}
}

function rgbToHex(color)
{
    if (color.substr(0, 1) === "#") {
        return color;
    }

    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
        r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);
    return "#"+ (
        (r.length == 1 ? "0"+ r : r) +
        (g.length == 1 ? "0"+ g : g) +
        (b.length == 1 ? "0"+ b : b)
    );
}