function FormElement_SingleLine(form) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = $.extend({}, this.super.props, {
  });
  this.form = form;
  this.index = null;
  this.$elem = null;
  
  // Create a single-line text box
  this.init = function ($container) {
    var $newelem = $("<div>", { class: "formbuilder-element" })
      .toggleClass("formbuilder-selectable", this.form.editable)
      .append(this.super.print_label())
      .attr("formbuilder-index", this.index);

    if (this.props.validation.type == 4) {
      // First/Last Name
      var $label_first = $("<label>", { class: "formbuilder-label" });
      var $label_last = $("<label>", { class: "formbuilder-label" });
      var $first = $("<input>", { type: "text", class: "formbuilder-singleline", readonly: this.form.editable });
      var $last = $("<input>", { type: "text", class: "formbuilder-singleline", readonly: this.form.editable });
      $newelem.addClass("formbuilder-half")
        .append($label_first.html($("<small>").html("First Name")))
        .append($label_last.html($("<small>").html("Last Name")))
        .append($first).append($last);
    }
    else if (this.props.validation.type == 5) {
      // Address
      for (var i=0; i<this.props.validation.address; i++) {
        var $line = $("<input>", { type: "text", class: "formbuilder-singleline", readonly: this.form.editable });
        $newelem.append($line);
      }
    }
    else {
      var $input = $("<input>", { type: "text", class: "formbuilder-singleline", readonly: this.form.editable });
      $newelem.append($input);
    }

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

  // Element settings
  this.get_settings = function () {
    this.super.regular_settings();
    FormValidate.settings(this);
    this.super.setting_delete();
  }

  // Zip into json
  this.zip = function () {
    return this.super.zip();
  }
}