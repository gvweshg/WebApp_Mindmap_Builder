//***************************************************************************************//
//
//	Action relation for all the buttons such as menu buttons, inspector buttons
//	Created By Giryong Jong. 1/14/2015
//
//***************************************************************************************//

var classAction	= function()
{ 
	var main		= this;

	main.objParent 	= null;

	main.init 		= function(parent)
	{
		main.objParent = parent;

		main.setNode();
		main.initFontBtns();
		main.initMenuBtns();
		main.initZoomSlider();
		main.initHintBtns();
	}

	main.setNode 	= function()
	{
		$("#center_point").draggable({handle : $("#center_title")});
		$("#canvas_area").draggable({cancel : ".node-title"});

		$("#font-color").ColorPicker(
		{
			color: '#000000',
			onChange: function (hsb, hex, rgb)
			{
				$("#font-color").css({"background-color" : "#" + hex});
				$(".title-sel").css({"color" : "#" + hex});
			}
		});

		$("#branch-color").ColorPicker(
		{
			color: '#000000',
			onChange: function (hsb, hex, rgb)
			{
				var pos 	= $(".title-sel").parent().position();
				var pObj 	= $(".title-sel").parent();

				$("#branch-color").css({"background-color" : "#" + hex});
				$(".title-sel").parent().css({"border-bottom-color" : "#" + hex});

				main.objParent.objNode.dragobj 		= $(".title-sel").parent();
				main.objParent.objNode.canvas 		= $(".title-sel").parent().children("canvas")[0];
				main.objParent.objNode.updateNode(pObj, 1);
			}
		});
	}

	main.initFontBtns 	= function()
	{
		$("#font-style-btns").find("input[type='button']").click(function()
		{
			var index = $(this).index();

			if($(this).hasClass("sel"))
			{
				switch(index)
				{
					case 0 :
						$(".title-sel").css({"font-weight" : ""});
					break;
					case 1 :
						$(".title-sel").css({"font-style" : ""});
					break;
					case 2 :

						$(".title-sel").css({"text-decoration" : ""});
					break;
					case 3 :
						$(".title-sel").css({"text-decoration" : ""});
					break;
				}

				$(this).removeClass("sel");
			}
			else
			{
				switch(index)
				{
					case 0:
						$(".title-sel").css({"font-weight" : "bold"});
					break;
					case 1:
						$(".title-sel").css({"font-style" : "italic"});
					break;
					case 2:
						$("#btn-font-midline").removeClass("sel");
						$(".title-sel").css({"text-decoration" : "underline"});
					break;
					case 3:
						$("#btn-font-underline").removeClass("sel");
						$(".title-sel").css({"text-decoration" : "line-through"});
					break;
				}

				$(this).addClass("sel");
			}
		});

		$("#btn-fsize-inc").click(function()
		{
			var fsize 	= $(".title-sel").css("font-size").replace("px", "");

			$(".title-sel").css("font-size", fsize * 1 + 1);
		});

		$("#btn-fsize-dec").click(function()
		{
			var fsize 	= $(".title-sel").css("font-size").replace("px", "");

			$(".title-sel").css("font-size", fsize * 1 - 1);
		});

		$("#font-family-btns select").change(function()
		{
			$(".title-sel").css("font-family", $(this).val());
		});
	}

	main.initMenuBtns 	= function()
	{
		$("#btn-menu-add").click(function()
		{
			if(!$(".title-sel").length)
				return;

			var parent 	= $(".title-sel").parent();
			var pos 	= {x : 150, y : 0};
			var color 	= main.objParent.objNode.curvobj.getRandomColor();

			if(parent.attr("direction") == "2")
			{
				pos.x 	= - 150;
			}

			pos.y = Math.round(Math.random() * 200);

			main.objParent.objNode.drawColor = color;
			main.objParent.objNode.curvobj.color = color;
			main.objParent.objNode.createNode(parent, pos, 1);
		});

		$("#btn-menu-del").click(function()
		{
			if(!$(".title-sel").length)
				return;

			if($(".title-sel").parent().attr("id") == "center_point")
				return;

			$("#ctrl-pointer").appendTo($("#center_point"));
			$("#ctrl-pointer").css({left : $("#center_title").width() / 2, top : $("#center_title").height() / 2 })

			$(".title-sel").parent().remove();
		});

		$("#btn-menu-copy").click(function()
		{
			if(!$(".title-sel").length)
				return;

			var pare 	= $(".title-sel").parent();
			var json 	= main.objParent.objNode.nodeToJSON(pare);

			$("#clipboard-area").html(JSON.stringify(json));

			$("#btn-menu-paste").removeAttr("disabled");
			$("#btn-menu-paste").removeClass("disabled");
		});

		$("#btn-menu-cut").click(function()
		{
			if(!$(".title-sel").length)
				return;

			var pare 	= $(".title-sel").parent();
			var json 	= main.objParent.objNode.nodeToJSON(pare);

			$("#clipboard-area").html(JSON.stringify(json));

			$("#btn-menu-paste").removeAttr("disabled");
			$("#btn-menu-paste").removeClass("disabled");

			$(".title-sel").parent().remove();
		});

		$("#btn-menu-paste").click(function()
		{
			if(!$(".title-sel").length)
				return;

			var parent 		= $(".title-sel").parent();
			var json 		= JSON.parse($("#clipboard-area").html());

			main.objParent.objNode.JSONToNode(parent, json);
		});

		$("#menu_right button").click(function()
		{
			$("#drop_menu").toggle();
		});

		$("#btn-menu-undo").click(function()
		{
			main.objParent.objNode.undo();
		});

		$("#btn-menu-redo").click(function()
		{
			main.objParent.objNode.redo();
		});
	}

	main.initZoomSlider 	= function()
	{
		$("#slider-area").slider(
		{
			min		: 1,
			max		: 10,
			value	: 4,
			change	: function(event, ui)
			{
				var percent = ui.value / 4 * 100;
				var scale 	= ui.value / 4;

				main.objParent.objNode.zoom(scale);

				$("#zoom-area center").html(percent + "%");
			}
		});
	}

	main.initHintBtns 		= function()
	{
		$(".close-hint").click(function()
		{
			$(this).parent().fadeOut();
		});
	}
}
