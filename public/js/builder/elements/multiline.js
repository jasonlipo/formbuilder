function FormElement_MultiLine(builder) {
 
  // Properties
  this.super = new FormElement(this);
  this.props = $.extend(this.super.props, {
  });
  this.builder = builder;
  this.index = null;
  this.$elem = null;
  
  
  // Create a single-line text box
  this.init = function () {
    var $help = $("<small>").html(this.props.help);
    var $label = $("<label>", { class: "formbuilder-label" }).html(this.props.label).append($help);
    var $input = $("<textarea>", { type: "text", class: "formbuilder-multiline", readonly: true });
    var $newelem = $("<div>", { class: "formbuilder-element formbuilder-selectable" })
                        .append($label)
                        .append($input)
                        .attr("formbuilder-index", this.index);

    this.builder.$body.append($newelem);
    this.$elem = $newelem;
    this.super.onclick();
  }

  // Element settings
  this.get_settings = function () {
    this.super.regular_settings();
  }

  // Zip into json
  this.zip = function () {
    return this.super.zip();
  }

}