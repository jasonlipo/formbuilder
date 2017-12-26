function FormElement_Radio(builder) {
  
  // Properties
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
    var $inputs = this.print_options();
    var $newelem = $("<div>", { class: "formbuilder-element formbuilder-selectable" })
                        .append(this.super.print_label())
                        .append($inputs)
                        .attr("formbuilder-index", this.index);

    this.builder.$body.append($newelem);
    this.$elem = $newelem;
    this.super.onclick();
    this.super.is_selected();
  }

  // Print options
  this.print_options = function () {
    var $radio_container = $("<div>", { class: "formbuilder-radio" });
    for (var i=0; i<this.props.options.length; i++) {
      var $input = $("<input>", { type: "radio", disabled: true });
      var $label = $("<label>", { class: "formbuilder-radio-label" }).html(this.props.options[i].value);
      var $cont = $("<div>").append($input).append($label);
      $radio_container.append($cont);
    }
    return $radio_container;
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