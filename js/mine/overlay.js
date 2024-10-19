var classOverlay	= function()
{
	var main 			= this;

	main.pareObj 		= null;
	main.activeID 		= "";

	main.init 			= function(pare)
	{
		main.pareObj 	= pare;

		main.initEvent();
		main.fileUploader();
	}

	main.initEvent 		= function()
	{
		$(".overlay_close").click(main.hidePopup);

		$("#btn_load").click(function()
		{
			var upload_name = $("#overlay_load").find("div.files").find("span").html();

			if(upload_name == "" || !upload_name)
			{
				$("#overlay_load .error_log").css("display","block");

				return;
			}

			main.loadUploaded(upload_name);
		});
	}

	main.showPopup		= function(popupID)
	{
		main.activeID 	= popupID;

		$("#" + popupID).css("display","block");
		$("#overlay").css("display","block");
		$("#over_overlay").fadeIn();
	}

	main.hidePopup		= function()
	{
		$("#" + main.activeID).css("display","none");
		$("#over_overlay").css("display","none");
		$("#overlay").fadeOut();
	}

	main.fileUploader 	= function()
	{
		var url = 'php/ajax_fileupload.php';

		$('.obj_upload').fileupload(
		{
			url 	: url,
			dataType: 'json',
			done 	: function (e, data)
			{
				var obj = this;

			    $.each(data.result.files, function (index, file)
			    {
		    		$(obj).parent().find(".files").html("<p><span>" + file.name + "</span></p>");
			    });

			    $("#loading").css("display","none");
			},	
			progressall: function (e, data)
			{
				$("#loading").css("display","block");
			}
		})

		.prop('disabled', !$.support.fileInput)
		.parent().addClass($.support.fileInput ? undefined : 'disabled');
	}

	main.loadUploaded 	= function(file_name)
	{
		$.ajax(
		{
			type: "POST",
			url: "php/ajax.php", 
			data: ({mode : "load_project", name : file_name}),
			cache: false,
			success: function(data)
			{
				var json = JSON.parse(data);

				main.pareObj.objNode.JSONToCanv(json);
				main.hidePopup();
			}
		});
	}
}