function FormElement_Buttons(form) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = {
    button1: "Button",
    button2: ""
  };
  this.form = form;
  this.index = null;
  this.$elem = null;
  
  // Create a button
  this.init = function ($container) {
    var $newelem = $("<div>", { class: "formbuilder-buttons" })
      .attr("formbuilder-index", this.index);

    var $one = $("<input>", { type: "button", class: "formbuilder-button", value: this.props.button1 });
    $newelem.append($one);
    if (this.props.button2 != "") {
      var $two = $("<input>", { type: "button", class: "formbuilder-button", value: this.props.button2 });
      $newelem.append($two);
    }

    $container.append($newelem);
    this.$elem = $newelem;
  }

}