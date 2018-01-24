function FormLoad(form) {

  this.form = form;
  
  // Load the form's stored data
  this.do = function (callback) {
    var id = this.form.$dom.attr('formbuilder');
    $.get("/form/" + id + "/structure", function (response) {
      if (response) {
        json = JSON.parse(response);
        $.extend(this.form.props, json["props"]);
        for (var i=0; i<json["elements"].length; i++) {
          var el = json["elements"][i];
          var new_el = new (window[el["class"]])(this.form);
          $.extend(new_el.props, json["elements"][i]["props"]);
          // Repeaters
          if (el["class"] == "FormElement_Repeater") {
            var children = new_el["props"]["children"];
            new_el["props"]["children"] = [];
            for (var j=0; j<children.length; j++) {
              var repeat_el = children[j];
              var repeat_new_el = new (window[repeat_el["class"]])(this.form);
              $.extend(repeat_new_el.props, children[j]["props"]);
              new_el["props"]["children"].push(repeat_new_el);
            }
          }
          this.form.elements.push(new_el);
        }
      }
      callback();
    }.bind(this));
  }

  // Load the form's structure and response
  this.response = function (callback) {
    this.do(function () {
      var id = this.builder.$dom.attr('formbuilder');
      $.get("/form/" + id + "/response/" + this.form.$dom.attr("formresponse"), function (result) {
        var json = JSON.parse(result);
        this.form.response = json;
        callback();
      }.bind(this));
    }.bind(this));
  }

}