function FormElement_Radio(builder) {
  
  // Defaults
  this.label = "Label";
  this.help = "Help text goes here";
  this.builder = builder;

  this.options = [
    { value: "Option 1" },
    { value: "Option 2" },
    { value: "Option 3" }
  ];
  
  // Create a single-line text box
  this.init = function () {
    var $help = $("<small>").html(this.help);
    var $label = $("<label>", { class: "formbuilder-label" }).html(this.label).append($help);
    var $inputs = this.print_options();
    var $newelem = $("<div>", { class: "formbuilder-element" })
                        .append($label)
                        .append($inputs);

    this.builder.$body.append($newelem);
  }

  // Print options
  this.print_options = function () {
    var $radio_container = $("<div>", { class: "formbuilder-radio" });
    for (var i=0; i<this.options.length; i++) {
      var $input = $("<input>", { type: "radio", disabled: true });
      var $label = $("<label>", { class: "formbuilder-radio-label" }).html(this.options[i].value);
      $radio_container.append($input).append($label);
    }
    return $radio_container;
  }

}