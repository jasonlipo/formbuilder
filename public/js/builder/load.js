function FormLoad(builder) {

  this.builder = builder;
  
  // Load the form's stored data
  this.do = function (callback) {
    $.get(location.pathname + "/structure", function (response) {
      if (response) {
        json = JSON.parse(response);
        $.extend(this.builder.props, json["props"]);
        for (var i=0; i<json["elements"].length; i++) {
          var el = json["elements"][i];
          var new_el = new (window[el["class"]])(this.builder);
          $.extend(new_el.props, json["elements"][i]["props"]);
          // Repeaters
          if (el["class"] == "FormElement_Repeater") {
            var children = new_el["props"]["children"];
            new_el["props"]["children"] = [];
            for (var j=0; j<children.length; j++) {
              var repeat_el = children[j];
              var repeat_new_el = new (window[repeat_el["class"]])(this.builder);
              $.extend(repeat_new_el.props, children[j]["props"]);
              new_el["props"]["children"].push(repeat_new_el);
            }
          }
          this.builder.elements.push(new_el);
        }
      }
      callback();
    }.bind(this));
  }

}