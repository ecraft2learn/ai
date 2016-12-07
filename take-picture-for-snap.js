window.take_picture_and_analyse(show_photo,
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
  var get_url_parameter = function (name, default_value) {
      var parts = window.location.search.substr(1).split('&');
      var value = default_value;
      parts.some(function (part) {
                     var name_and_value = part.split('=');
                     if (name_and_value[0] === name) {
                         value = name_and_value[1];
                         return true;
                     }
                 });
      return value;
  };
  var provider = get_url_parameter("provider", "Watson");
  if (provider === "Watson") {
     invoke(callback, new List([javascript_to_snap(JSON.parse(response).images[0].classifiers[0].classes)]));
     return;
  }
  if (provider === "Google") {
     invoke(callback, new List([javascript_to_snap(JSON.parse(response).responses)]));
     return;
  }
});
