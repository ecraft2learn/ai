if (typeof window.take_picture_and_analyse != 'function') {
    alert("You need to run the 'setup camera' command before analysing images.");
} else {
    window.take_picture_and_analyse(cloud_provider,
                                    show_photo,
                                    function (response) {
					var javascript_to_snap = function (x) {
					    if (Array.isArray(x)) {
						return new List(x.map(javascript_to_snap));
					    }
					    if (typeof x === 'object') {
						return new List(Object.keys(x).map(function (key) {
                                                    return new List([key, javascript_to_snap(x[key])]);
						}));
					    }
					    return x;
					};
					switch (cloud_provider) {
					case "Watson":
					    invoke(callback, new List([javascript_to_snap(JSON.parse(response).images[0].classifiers[0].classes)]));
					    return;
					case "Google":
					    invoke(callback, new List([javascript_to_snap(JSON.parse(response).responses)]));
					    return;
					case "Microsoft":
					    invoke(callback, new List([javascript_to_snap(JSON.parse(response))]));
					    return;
					}
				    });
}
