function FormElement_Dropdown(form) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = $.extend({}, this.super.props, {
    options: [
      { value: "Option 1" },
      { value: "Option 2" },
      { value: "Option 3" }
    ]
  });
  this.form = form;
  this.index = null;
  this.$elem = null;
  
  // Create a single-line text box
  this.init = function ($container) {
    var $input = this.print_options();
    var $newelem = $("<div>", { class: "formbuilder-element" })
                        .toggleClass("formbuilder-selectable", this.form.editable)
                        .append(this.super.print_label())
                        .append($input)
                        .attr("formbuilder-index", this.index);

    $container.append($newelem);
    this.$elem = $newelem;
    if (this.form.editable) {
      this.super.onclick();
      this.super.is_selected();
    }
    else {
      this.super.validate_on_change();
    }
  }

  // Print options
  this.print_options = function () {
    var $select = $("<select>", { class: "formbuilder-dropdown", readonly: this.form.editable });
    $select.append($("<option>"));
    for (var i=0; i<this.props.options.length; i++) {
      $select.append($("<option>", { value: this.props.options[i].value }).html(this.props.options[i].value));
    }
    return $select;
  }

  // Element settings
  this.get_settings = function () {
    this.super.regular_settings();
    this.super.multiple_options();
    this.super.setting_delete();
  }

  // Zip into json
  this.zip = function () {
    return this.super.zip();
  }

}