//***************************************************************************************//
//
//	Node relation javascript functions
//	Created By Giryong Jong. 12/21/2014
//
//***************************************************************************************//

var classNode		= function()
{ 
	var main		= this;

	main.parent 	= null;
	
	main.control 	= null;
	main.dragobj 	= null;
	main.curvobj 	= null;
	main.pareNode 	= null; 

	main.canvas 	= null;
	main.titleTop 	= 0;
	main.section 	= 0;
	main.nDirect 	= 1; 		// 1 : left, 2 : right
	main.isDrag 	= 0;
	
	main.drawColor 	= "";
	main.fontColor 	= "";
	main.drawSize 	= 10;
	main.bWidth 	= 100;

	main.histArr 	= [];
	main.histInd 	= 0;

	main.scale 		= 1;
	main.pscale 	= 1;

	main.init 			= function(parent)
	{
		main.initCtrl();
		main.initCurve();
	}

	main.initCtrl 		= function()
	{
		main.control 	= new classControl();
		main.control.init(main);
	}

	main.initCurve 		= function()
	{
		main.curvobj 	= new classCurve();
		main.curvobj.init(main);
	}

	main.beforeCreate 	= function(evt)
	{
		main.drawColor 	= main.curvobj.color = main.curvobj.getRandomColor();
	}

	main.createNode = function(parent, pos, saveHist)
	{
		var newCanvas 	= null;
		var addedObj 	= null;

		var dragleft 	= 0;
		var branchleft 	= 0;

		var elemNode 	= '<div class="node-item creating"></div>';
		var parePos 	= {x : 0, y : 0};
		var direction 	= 1;

		if(!parent.children(".node-child-list").length)
		{
			parent.append('<div class="node-child-list"></div>');
		}

		if(parent.attr("id") == "center_point")
		{
			parePos 	= {x : $("#center_title").width() / 2, y : $("#center_title").height() / 2};
		}

		if(pos.x <= 0)
			direction = 2;

		parent.children(".node-child-list").append(elemNode);
		addedObj = parent.children(".node-child-list").children(".node-item:last-child");

		$(".title-sel").attr("contenteditable", false);
		$(".title-sel").removeClass("title-sel");

		addedObj.append('<div class="node-title title-sel">New Idea</div>');
		addedObj.append('<canvas></canvas>');
		addedObj.attr("direction", direction);
		addedObj.attr("class", "node-item");
		addedObj.css({"border-bottom" : main.drawSize + "px solid " + main.drawColor});
		addedObj.css({left : pos.x, top : pos.y});
		addedObj.children(".node-title").attr("contenteditable", true).focus();

		main.setScaleNewObj(addedObj);

		addedObj.draggable(
		{
			handle 	: ".node-title",
			start 	: function(event)
			{
				main.canvas 	= $(this).find(".child-canvas")[0];
				main.pareNode 	= $(this);
				main.dragobj 	= $(this);
				main.isDrag 	= 1;
			},
			drag 	: function(evt, ui)
			{
				var pPos 	= parent.position();
				var pObj 	= parent.parent().parent();

				main.updateNode(addedObj, 1);
			},
			stop 	: function()
			{
				main.isDrag 	= 0;

				if(saveHist)
					main.savehist();
			}
		});

		$("#ctrl-pointer").appendTo(addedObj);
		$("#ctrl-pointer").css({left : "0px", top : "0px"});

		if(direction == 1)
		{
			if(parent.attr("id") != "center_point")
				parePos = {x : main.bWidth, y : 0};

			$("#ctrl-pointer").css({left : "88px", top : "-2px"});
		}
		else if(direction == 2)
		{
			dragleft 	= addedObj.position().left;
			branchleft 	= addedObj.children("canvas").position().left + main.bWidth;

			addedObj.css({left : dragleft - main.bWidth});
			addedObj.children("canvas").css({left : branchleft});

			$("#ctrl-pointer").css({left : "-10px", top : "-2px"});
		}

		if(parent.attr("id") != "center_point")
		{
			if(!parent.children(".btn-collapse").length)
				parent.append("<div class='btn-collapse'></div>");
		}

		newCanvas = $(addedObj).children("canvas")[0];
		
		main.curvobj.color = main.drawColor;
		main.curvobj.drawCurve(newCanvas, parePos, pos);

		$("#branch-color").css({"background-color" : main.drawColor});

		if(saveHist)
			main.savehist();

		return addedObj;		
	}

	main.updateNode 	= function(moveObj, saveHist)
	{
		var pos1 	= {x : 0, y : 0};
		var pos2 	= {x : moveObj.position().left, y : moveObj.position().top};
		var canvas 	= moveObj.children("canvas")[0];
		var parent 	= moveObj.parent().parent();
		var direct 	= 1;

		if(parent.attr("id") == "center_point")
		{
			pos1 = {x : $("#center_title").width()  / 2, y : $("#center_title").height() / 2};
		}

		if(pos2.x <= 0)
		{
			pos2 	= {x : moveObj.position().left + main.bWidth, y : moveObj.position().top};
			direct 	= 2;
		}
		else
		{
			if(parent.attr("id") != "center_point")
				pos1 = {x : main.bWidth, y : 0};
		}

		main.drawColor 	= main.dragobj.css("border-bottom-color");
		
		main.curvobj.color = main.drawColor;
		main.curvobj.drawCurve(canvas, pos1, pos2);

		moveObj.attr("direction", direct);
	}

	main.setNodeProp 	= function(obj, title, fsize, fweight, fstyle, fcolor, tdecr, bcolor, ffamily)
	{
		obj.css("border-bottom-color", bcolor);
		obj.children(".node-title").html(title);
		obj.children(".node-title").css("font-size", fsize);
		obj.children(".node-title").css("font-weight", fweight);
		obj.children(".node-title").css("font-style", fstyle);
		obj.children(".node-title").css("color", fcolor);
		obj.children(".node-title").css("text-decoration", tdecr);
		obj.children(".node-title").css("font-family", ffamily);
	}

	main.getNodeProp 	= function()
	{
		var lcolor 	= $(".title-sel").parent().css("border-bottom-color");
		var fcolor 	= $(".title-sel").css("color");

		var ffamily = $(".title-sel").css("font-family");
		var fweight = $(".title-sel").css("font-weight");
		var fstyle 	= $(".title-sel").css("font-style");
		var fdecrt 	= $(".title-sel").css("text-decoration");

		$("#branch-color").css({"background-color" : lcolor});
		$("#font-color").css({"background-color" : fcolor});

		if(fweight == "bold")
			$("#btn-font-bold").addClass("sel");
		else
			$("#btn-font-bold").removeClass("sel");

		if(fstyle == "italic")
			$("#btn-font-italic").addClass("sel");
		else
			$("#btn-font-italic").removeClass("sel");

		if(fdecrt == "underline")
		{
			$("#btn-font-underline").addClass("sel");
			$("#btn-font-midline").removeClass("sel");
		}
		else if(fdecrt == "line-through")
		{
			$("#btn-font-underline").removeClass("sel");
			$("#btn-font-midline").addClass("sel");
		}
		else
		{
			$("#btn-font-underline").removeClass("sel");
			$("#btn-font-midline").removeClass("sel");
		}

		$("#font-family-btns select").val(ffamily);
	}

	main.nodeToJSON 	= function(obj)
	{
		var title 		= obj.children(".node-title").html();
		var pos_x 		= obj.position().left;
		var pos_y 		= obj.position().top;
		var child_arr 	= [];
		var json 		= {};

		var fcolor 		= obj.children(".node-title").css("color");
		var fsize 		= obj.children(".node-title").css("font-size").replace("px","");
		var fweight 	= obj.children(".node-title").css("font-weight");
		var fdecrt 		= obj.children(".node-title").css("text-decoration");
		var fstyle 		= obj.children(".node-title").css("font-style");
		var ffamily 	= obj.children(".node-title").css("font-family");
		var bcolor 		= obj.css("border-bottom-color");

		if(obj.attr("direction") == "2")
			pos_x = pos_x + main.bWidth;

		if(obj.find(".node-item").length > 0)
		{
			obj.children(".node-child-list").children(".node-item").each(function(child)
			{
				child_arr.push(main.nodeToJSON($(this)));
			});
		}

		json = {
			x 		: pos_x, 
			y 		: pos_y, 
			fcolor 	: fcolor,
			fsize 	: fsize,
			fweight : fweight,
			ffamily : ffamily,
			fdecrt 	: fdecrt,
			fstyle 	: fstyle,
			bcolor 	: bcolor,
			title 	: title, 
			child 	: child_arr
		};

		return json;
	}

	main.JSONToNode 	= function(parent, node)
	{
		var node_obj 	= null;

		main.drawColor = node.bcolor;
		node_obj = main.createNode(parent, {x : node.x, y : node.y});
		
		main.setNodeProp(node_obj, node.title, node.fsize, node.fweight, node.fstyle, node.fcolor, node.fdecrt, node.bcolor, node.ffamily);

		for(var i = 0; i < node.child.length; i ++)
		{
			main.JSONToNode(node_obj, node.child[i]);
		}
	}

	main.canvToJSON 	= function()
	{
		var pare 	= $("#center_point");
		var json 	= main.nodeToJSON(pare);

		return JSON.stringify(json);
	}

	main.JSONToCanv 	= function(json)
	{
		var parent 		= $("#center_point");
		var child_arr 	= json.child;
		var hist_tmp 	= main.histInd;

		$("#ctrl-pointer").appendTo($("#canvas_area"));

		parent.children(".node-child-list").remove();

		for(var i = 0; i < child_arr.length; i ++)
		{
			main.JSONToNode(parent, child_arr[i]);
		}

		main.histInd = hist_tmp;
	}

	main.savehist 		= function()
	{
		main.histInd ++;
		main.histArr[main.histInd] = main.canvToJSON();

		$("#btn-menu-undo").removeAttr("disabled");
		$("#btn-menu-undo").removeClass("disabled");
	}

	main.undo 			= function()
	{
		if(!main.histInd)
			return;

		main.histInd --;

		if(!main.histArr[main.histInd])
		{
			$("#center_point").children(".node-child-list").remove();

			$("#btn-menu-undo").attr("disabled", "disabled");
			$("#btn-menu-undo").addClass("disabled");

			return;
		}

		main.JSONToCanv(JSON.parse(main.histArr[main.histInd]));

		$("#btn-menu-redo").removeAttr("disabled");
		$("#btn-menu-redo").removeClass("disabled");
	}

	main.redo 			= function()
	{
		if(main.histInd >= main.histArr.length - 1)
			return;

		main.histInd ++;

		main.JSONToCanv(JSON.parse(main.histArr[main.histInd]));

		$("#btn-menu-undo").removeAttr("disabled");
		$("#btn-menu-undo").removeClass("disabled");

		if(main.histInd >= main.histArr.length - 1)
		{
			$("#btn-menu-redo").attr("disabled", "disabled");
			$("#btn-menu-redo").addClass("disabled");
		}
	}

	main.zoom	 		= function(n_scale)
	{
		var scale 		= n_scale / main.pscale;

		main.scale 		= n_scale;
		main.pscale 	= n_scale;
		main.bWidth 	= 100 * main.scale;
		main.drawSize 	= 10  * main.scale;
		main.curvobj.width = 10 * main.scale;

		$("#canvas_area canvas").each(function()
		{
			var width 	= $(this).width();
			var height 	= $(this).height();

			var left 	= $(this).position().left;
			var top 	= $(this).position().top;

			$(this).css("width", 	width  * scale);
			$(this).css("height", 	height * scale);

			$(this).css("left", 	left  * scale);
			$(this).css("top", 		top * scale);
		});

		$("#canvas_area .node-item").each(function()
		{
			var width 	= $(this).width();
			var height 	= $(this).height();

			var left 	= $(this).position().left;
			var top 	= $(this).position().top;

			$(this).css("width", 		width  * scale);
			$(this).css("height", 		height * scale);

			if($(this).attr("id") != "center_point")
			{
				$(this).css("left", 		left  * scale);
				$(this).css("top", 			top * scale);
			}

			$(this).css("border-bottom-width", 10 * main.scale);
		});

		$(".node-title").each(function()
		{
			var width 	= $(this).width();
			var height 	= $(this).height();

			var left 	= $(this).position().left;
			var top 	= $(this).position().top;
			var fsize 	= $(this).css("font-size").replace("px", "");

			var lpad 	= 5  * main.scale;
			var tpad 	= 10 * main.scale;
			var lhght 	= 20 * main.scale;

			$(this).css("width", 		width  * scale);
			$(this).css("height", 		height * scale);
			$(this).css("font-size", 	Math.floor(fsize * scale));
			$(this).css({"line-height" : lhght + "px"});

			if($(this).attr("id") == "center_title")
				$(this).css("padding", 		lpad + "px " + tpad + "px");
		});
	}

	main.setScaleNewObj 	= function(tobj)
	{
		var width 	= tobj.width();
		var height 	= tobj.height();
		var left 	= tobj.position().left;
		var top 	= tobj.position().top;

		var tWidth 	= tobj.children(".node-title").width();
		var tHeight = tobj.children(".node-title").height();
		var tLeft 	= tobj.children(".node-title").position().left;
		var tTop 	= tobj.children(".node-title").position().top;
		var fsize 	= tobj.children(".node-title").css("font-size").replace("px", "");
		var lhght 	= 20 * main.scale;

		tobj.css("width", 		width  * main.scale);
		tobj.css("height", 		height * main.scale);

		tobj.children(".node-title").css("width", 		tWidth  * main.scale);
		tobj.children(".node-title").css("height", 		tHeight * main.scale);
		tobj.children(".node-title").css("font-size", 	Math.floor(fsize * main.scale));
		tobj.children(".node-title").css({"line-height" : lhght + "px"});
	}
}
