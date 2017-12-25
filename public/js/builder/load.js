function FormLoad(builder) {

  this.builder = builder;
  
  // Load the form's stored data
  this.do = function (callback) {
    $.get(location.pathname + "/structure", function (response) {
      if (response) {
        json = JSON.parse(response);
        this.builder.props = json["props"];
        for (var i=0; i<json["elements"].length; i++) {
          var el = json["elements"][i];
          var new_el = new (window[el["class"]])(this.builder);
          new_el.label = json["elements"][i]["label"];
          new_el.help = json["elements"][i]["help"];
          new_el.options = json["elements"][i]["options"];
          this.builder.elements.push(new_el);
        }
      }
      callback();
    }.bind(this));
  }

}