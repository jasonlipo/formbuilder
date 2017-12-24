function FormElement_Radio(builder) {
  
  // Defaults
  this.label = "Label";
  this.help = "Help text goes here";
  this.builder = builder;
  this.index = null;

  // Properties
  this.$elem = null;
  this.options = [
    { value: "Option 1" },
    { value: "Option 2" },
    { value: "Option 3" }
  ];
  this.super = new FormElement(this);
  
  // Create a single-line text box
  this.init = function () {
    var $help = $("<small>").html(this.help);
    var $label = $("<label>", { class: "formbuilder-label" }).html(this.label).append($help);
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
    var $radio_container = $("<div>", { class: "formbuilder-radio" });
    for (var i=0; i<this.options.length; i++) {
      var $input = $("<input>", { type: "radio", disabled: true });
      var $label = $("<label>", { class: "formbuilder-radio-label" }).html(this.options[i].value);
      var $cont = $("<div>").append($input).append($label);
      $radio_container.append($cont);
    }
    return $radio_container;
  }

  // Element settings
  this.get_settings = function () {
    this.super.regular_settings();
  }

}