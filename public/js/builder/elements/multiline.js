function FormElement_MultiLine(builder) {
 
  // Defaults
  this.label = "Label";
  this.help = "Help text goes here";
  this.builder = builder;
  
  // Create a single-line text box
  this.init = function () {
    var $help = $("<small>").html(this.help);
    var $label = $("<label>", { class: "formbuilder-label" }).html(this.label).append($help);
    var $input = $("<textarea>", { type: "text", class: "formbuilder-multiline", readonly: true });
    var $newelem = $("<div>", { class: "formbuilder-element" })
                        .append($label)
                        .append($input);

    this.builder.$body.append($newelem);
  }

}