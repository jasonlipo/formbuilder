function FormElement_Radio(form) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = $.extend({}, this.super.props, {
    id: this.super.generate_id(),
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
    var $inputs = this.print_options();
    var $newelem = $("<div>", { class: "formbuilder-element" })
                        .toggleClass("formbuilder-selectable", this.form.editable)
                        .append(this.super.print_label())
                        .append($inputs)
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
    var $radio_container = $("<div>", { class: "formbuilder-radio" });
    for (var i=0; i<this.props.options.length; i++) {
      var id = Math.random().toString(36).substring(2, 15)
      var $input = $("<input>", { id, type: "radio", disabled: this.form.editable, name: this.index, value: this.props.options[i].value });
      var $label = $("<label>", { for: id, class: "formbuilder-radio-label" }).html(this.props.options[i].value);
      var $cont = $("<div>").append($input).append($label);
      $radio_container.append($cont);
    }
    return $radio_container;
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