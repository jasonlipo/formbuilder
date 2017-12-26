function FormElement_SingleLine(builder) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = $.extend(this.super.props, {
  });
  this.builder = builder;
  this.index = null;
  this.$elem = null;
  
  // Create a single-line text box
  this.init = function () {
    var $input = $("<input>", { type: "text", class: "formbuilder-singleline", readonly: true });
    var $newelem = $("<div>", { class: "formbuilder-element formbuilder-selectable" })
                        .append(this.super.print_label())
                        .append($input)
                        .attr("formbuilder-index", this.index);

    this.builder.$body.append($newelem);
    this.$elem = $newelem;
    this.super.onclick();
    this.super.is_selected();
  }

  // Element settings
  this.get_settings = function () {
    this.super.regular_settings();
    FormValidate.settings(this);
  }

  // Zip into json
  this.zip = function () {
    return this.super.zip();
  }

}