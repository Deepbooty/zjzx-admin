require.config({
	waitSeconds: 0,
	paths: {
		"util": "js/util"
	},
	shim: {},
});
define(["util"], function(util) {
	$("#btn").click(function() {
		var filebtn = $("input[type=file]");
		filebtn.change(function() {
			var filedata = $(this)[0].files[0];
			let fileFormData = new FormData();
			fileFormData.append('file', filedata, filedata.name);

			$.ajax({
				url: CONST.fileServer + "/file/uploadPic",
				type: 'post',
				dataType: 'json',
				data: fileFormData,
				async: true,
				processData: false,
				contentType: false,
				success: function(res) {
					var image = $("<img />")
					image.attr("src",CONST.fileRoot+"/"+res.result.url)
					image.css({"width":"500px","height":"300px"})
					$("#imageDiv").html(image);
				}
			})

		}).click();

	})
});