function FormElement_Checkbox(builder) {
  
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
    this.super.select();
  }

  // Print options
  this.print_options = function () {
    var $checkbox_container = $("<div>", { class: "formbuilder-checkbox" });
    for (var i=0; i<this.options.length; i++) {
      var $input = $("<input>", { type: "checkbox", disabled: true });
      var $label = $("<label>", { class: "formbuilder-checkbox-label" }).html(this.options[i].value);
      var $cont = $("<div>").append($input).append($label);
      $checkbox_container.append($cont);
    }
    return $checkbox_container;
  }

  // Element settings
  this.get_settings = function () {
    this.super.regular_settings();
    this.builder.settings.$field_properties.append("<br /><br />Options<br />");
    for (var i=0; i<this.options.length; i++) {
      var $option_input = $("<input>", { class: "formbuilder-settings-input" }).val(this.options[i].value);
      $option_input.keyup(function ($el, index) {
        this.options[index].value = $el.val();
        this.builder.reload_form();
      }.bind(this, $option_input, i));
      this.builder.settings.$field_properties.append($option_input);
    }
    this.builder.settings.$field_properties.append("<br />").append(
      $("<a>", { href: "#" })
        .html("+ Add new option")
        .click(function () { 
          this.options.push({ value: "" });
          this.builder.reload_form();
          this.builder.reload_settings();
        }.bind(this))
    );
  }

}