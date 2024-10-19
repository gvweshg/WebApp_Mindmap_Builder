//***************************************************************************************//
//
//	Control relation javascript functions
//	Created By Giryong Jong. 12/29/2014
//
//***************************************************************************************//

var classControl	= function()
{ 
	var main		= this;

	main.ctrlID 	= "ctrl-pointer";
	main.isDrag 	= 0;
	main.ctrlElem 	= null;
	main.pareobj 	= null;
	main.autotimer	= null;
	main.savetime 	= 10 * 60 * 1000; // 10 minutes for auto-save

	main.init 		= function(parent)
	{
		main.ctrlElem 	= $("#ctrl-pointer");
		main.pareobj 	= parent;

		main.initEnv();
		main.initEvent();
		main.dropEvent();		
	}

	main.initEnv 		= function()
	{
		main.ctrlElem.draggable(
		{
			start 	: function(evt)
			{
				main.isDrag = 1;
				main.pareobj.beforeCreate(evt);
				main.pareobj.canvas = document.getElementById("creator-canvas");

				$("#creator-canvas").css({"display" : "block"});
			},
			drag 	: function(evt)
			{
				var parent 	= main.ctrlElem.parent();
				var canvas 	= document.getElementById("creator-canvas");

				var pos1 	= {x : $("#center_title").width() / 2, y : $("#center_title").height() / 2};
				var pos2 	= {x : $("#ctrl-pointer").position().left, y : $("#ctrl-pointer").position().top};

				if(parent.attr("id") != "center_point")
				{
					pos1 	= {x : 0, y : 0};
					pos2 	= {x : $("#ctrl-pointer").position().left, y : $("#ctrl-pointer").position().top};

					if(pos2.x > 0)
						pos1 = {x :  main.pareobj.bWidth, y : 0};
				}

				main.pareobj.curvobj.drawCurve(canvas, pos1, pos2);
			},
			stop 	: function(evt)
			{
				var parent 	= main.ctrlElem.parent();
				var canvas 	= document.getElementById("creator-canvas");
				var pos 	= {x : $("#ctrl-pointer").position().left, y : $("#ctrl-pointer").position().top};

				main.pareobj.createNode(parent, pos, 1);
				main.isDrag = 0;

				$("#creator-canvas").css({"display" : "none"});
			}
		});
	}

	main.initEvent 		= function()
	{
		$("#canvas_area").on("mouseover", ".node-title", function()
		{
			var left 	= $(this).width()  / 2 + 5;
			var top 	= $(this).height() / 2 + 5;

			if(main.isDrag)
				return;

			if(main.pareobj.isDrag)
				return;

			if($(this).parent().children("#" + main.ctrlID).length)
				return;

			if($(this).attr("contenteditable") == "true")
				return;

			main.ctrlElem.appendTo($(this).parent());

			$("#ctrl-pointer").css({"display" : "block"});

			if($(this).parent().attr("id") == "center_point")
				main.ctrlElem.css({left : left, top : top});
			else if($(this).parent().attr("direction") == 1)
			{
				main.ctrlElem.css({left : "88px", top : "-2px"});
			}
			else if($(this).parent().attr("direction") == 2)
			{
				main.ctrlElem.css({left : "-10px", top : "-2px"});
			}
		});

		$("#canvas_area").on("click", ".node-title", function(evt)
		{
			if($(this).attr("contenteditable") == "true")
				return;

			if($(".title-sel").html() == "")
				$(".title-sel").html("New Idea");

			$(".title-sel").attr("contenteditable", false);
			$(".title-sel").css("cursor", "move");
			$(".title-sel").parent().draggable({disabled: false});
			$(".title-sel").removeClass("title-sel");

			$(this).addClass("title-sel");

			main.pareobj.getNodeProp();

			evt.stopPropagation();

			$("#addimg_area").fadeOut();
			$("#addimg_area").css("opacity", "0.5");
		});

		$("#canvas_area").on("dblclick", ".node-title", function(evt)
		{
			if($(this).html() == "New Idea")
				$(this).html("");

			$(".title-sel").attr("contenteditable", false);
			$(".title-sel").css("cursor", "move");
			$(".title-sel").parent().draggable({disabled: false});
			$(".title-sel").removeClass("title-sel");

			$(this).addClass("title-sel");
			$(this).attr("contenteditable", true);
			$(this).parent().draggable({disabled: true});
			$(this).parent().removeClass("ui-state-disabled");
			$(this).css("cursor", "auto");
			$(this).focus();

			$("#addimg_area").fadeIn();
			$("#addimg_area").css("top",  evt.clientY - 70);
			$("#addimg_area").css("left", evt.clientX - 100);
		});

		$("#canvas_area").on("click", ".btn-collapse", function()
		{
			$(this).attr("class", "btn-expand");
			$(this).parent().children(".node-child-list").css("display", "none");
		});

		$("#canvas_area").on("click", ".btn-expand", function()
		{
			$(this).attr("class", "btn-collapse");
			$(this).parent().children(".node-child-list").css("display", "block");
		});

		$("#img_url").on("focus", function()
		{
			$("#addimg_area").css("opacity", "1");
		});

		$("#img_url").on("focusout", function()
		{
			$("#addimg_area").css("opacity", "0.5");
		});

		$(window).on("keyup", function(evt)
		{
			if(evt.keyCode == 9 )
			{
				$("#btn-menu-add").trigger("click");
			}

			if(evt.keyCode == 13 )
			{
				$(".title-sel").trigger("dblclick");
			}

			evt.stopPropagation();
			evt.preventDefault();
		});

		$("#canvas_area").on("keyup", ".node-title", function(evt)
		{
			var height 	= $(this).height() + 10;
			var html 	= $(this).html();

			if($(this).attr("id") == "center_title")
			{
				$(this).css("margin-top", 0);
			}
			else
			{
				$(this).css("margin-top", height * (-1));
			}

			if(html.substring(0,4) == "http")
				$(this).html("<a href='" + html + "'>" + html + "</a>");

		});

		$("#img_add_btn").click(function()
		{
			var img 	= "<img src='" + $("#img_url").val() + "'>";
			var width 	= $(".title-sel").css("width");

			$(".title-sel").html(img);
			$(".title-sel").children("img").css("width", "100%");

			$(".title-sel").css("margin-top", $(".title-sel").children("img").height() * (-1) - 10);
			$(".title-sel").css("height", $(".title-sel").children("img").height());

			console.log($(".title-sel").children("img").height());
		});
	}

	main.dropEvent 		= function()
	{
		$("#drop_file li").click(function()
		{
			var index 	= $(this).index();
			var json 	= main.pareobj.canvToJSON();
			var name 	= "save_file.sav";

			switch(index)
			{
				case 0 :
					$.ajax(
					{
						type: "POST",
						url: "php/ajax.php", 
						data: ({mode : 'save_project', data : json, name : name}),
						cache: false,
						success: function(result)
						{
							window.open("php/download.php?name=" + name);
						}
					});
				break;
				case 1 :
					$("#overlay").css("display", "block");
					$("#over_overlay").fadeIn();
				break;
				case 2 :
					var canv_elem = document.getElementById("canvas_area");

					$("#canvas_area").css({"background" : "white"});

					html2canvas(canv_elem, 
					{
						onrendered  : function(canvas)
						{
							$("#canvas_area").css({"background" : 'url("img/grid_bg.png") repeat white'});

							window.open(canvas.toDataURL());
						}
					})
				break;
				case 3:
					$(".hint-pup").each(function()
					{
						$(this).css({"display" : "block"});
					});
				break;
				case 4:
					var canv_elem = document.getElementById("canvas_area");

					$("#canvas_area").css({"background" : "white"});

					html2canvas(canv_elem, 
					{
						onrendered  : function(canvas)
						{
							$("#canvas_area").css({"background" : 'url("img/grid_bg.png") repeat white'});

							main.Popup("<img style='width:100%;' src='" + canvas.toDataURL() + "'/>");
						}
					})
				break;
				case 5:
					if($(this).hasClass("checked"))
					{
						$(this).removeClass("checked");
						main.stopAutoSave();
					}
					else
					{
						$(this).addClass("checked");
						main.startAutoSave();
					}
				break;
			}

			$("#drop_menu").fadeOut();
		})
	}

	main.startAutoSave 	= function()
	{
		main.autotimer 	= setInterval(function()
		{
			$("#drop_file li:nth-child(1)").trigger("click");
		},main.savetime);
	}

	main.stopAutoSave 	= function()
	{
		clearInterval(main.autotimer);
	}

	main.Popup 			= function(data) 
    {
        var mywindow = window.open('', 'my div', 'height=2500,width=2500');
        mywindow.document.write('<html><head><title>my div</title>');

        /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
        mywindow.document.write('</head><body >');
        mywindow.document.write(data);
        mywindow.document.write('</body></html>');

        mywindow.document.close(); // necessary for IE >= 10
        mywindow.focus(); // necessary for IE >= 10

        mywindow.print();
        mywindow.close();

        return true;
    }
}
