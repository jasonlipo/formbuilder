function FormElement_Buttons(form) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = {
    button1: { value: "", onclick: null },
    button2: { value: "", onclick: null }
  };
  this.form = form;
  this.index = null;
  this.$elem = null;
  
  // Create a button
  this.init = function ($container) {
    var $newelem = $("<div>", { class: "formbuilder-buttons" })
      .attr("formbuilder-index", this.index);

    if (this.props.button1.value != "") {
      var $one = $("<input>", { type: "button", class: "formbuilder-button", value: this.props.button1.value });
      $one.click(this.props.button1.onclick);
      $newelem.append($one);
    }
    if (this.props.button2.value != "") {
      var $two = $("<input>", { type: "button", class: "formbuilder-button", value: this.props.button2.value });
      $two.click(this.props.button2.onclick);
      $newelem.append($two);
    }

    $container.append($newelem);
    this.$elem = $newelem;
  }

}