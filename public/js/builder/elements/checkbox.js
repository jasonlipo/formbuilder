function FormElement_Checkbox(builder) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = $.extend(this.super.props, {
    options: [
      { value: "Option 1" },
      { value: "Option 2" },
      { value: "Option 3" }
    ]
  });
  this.builder = builder;
  this.index = null;
  this.$elem = null;
    
  // Create a single-line text box
  this.init = function () {
    var $help = $("<small>").html(this.props.help);
    var $label = $("<label>", { class: "formbuilder-label" }).html(this.props.label).append($help);
    var $inputs = this.print_options();
    var $newelem = $("<div>", { class: "formbuilder-element formbuilder-selectable" })
                        .append($label)
                        .append($inputs)
                        .attr("formbuilder-index", this.index);

    this.builder.$body.append($newelem);
    this.$elem = $newelem;
    this.super.onclick();
  }

  // Print options
  this.print_options = function () {
    var $checkbox_container = $("<div>", { class: "formbuilder-checkbox" });
    for (var i=0; i<this.props.options.length; i++) {
      var $input = $("<input>", { type: "checkbox", disabled: true });
      var $label = $("<label>", { class: "formbuilder-checkbox-label" }).html(this.props.options[i].value);
      var $cont = $("<div>").append($input).append($label);
      $checkbox_container.append($cont);
    }
    return $checkbox_container;
  }

  // Element settings
  this.get_settings = function () {
    this.super.regular_settings();
    this.super.multiple_options();
  }

  // Zip into json
  this.zip = function () {
    return this.super.zip();
  }

}