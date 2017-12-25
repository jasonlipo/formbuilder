function FormElement(element) {
  this.element = element;

  this.props = {
    label: "Label",
    help: "Help text goes here",
    required: false
  }

  // Print out the label (checking if required or not)
  this.print_label = function () {
    var $help = $("<small>").html(this.element.props.help);
    var $label = $("<label>", { class: "formbuilder-label" }).html(this.element.props.label);
    if (this.element.props.required) {
      $label.append($("<span>", { class: "formbuilder-required" }).html("*"));
    }
    $label.append($help);
    return $label;
  }

  // When clicking a generic form element
  this.onclick = function () {
    this.element.$elem.click(function () {
      this.element.builder.$body.find(".selected").removeClass("selected");
      if (this.element.builder.selected == this.element.index) {
        this.element.builder.selected = null;
      }
      else {
        this.element.builder.selected = this.element.index;
        this.element.$elem.addClass("selected");
      }
      this.element.builder.reload_settings();
    }.bind(this));
  }

  // Setting the index property
  this.setIndex = function(i) {
    this.element.index = i;
  }

  // Generic element settings
  this.regular_settings = function () {
    this.setting_section("General");
    this.add_setting("Field Label", "label");
    this.add_setting("Field Help Text", "help");
    this.add_setting("Required", "required", true);
  }

  // Add setting section
  this.setting_section = function (label) {
    var $settings_section = $("<div>", { class: "formbuilder-settings-section" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });
    $settings_label.html(label).appendTo($settings_section);
    this.element.builder.settings.$field_properties.append($settings_section);
  }

  // Add setting to link to field property
  this.add_setting = function (label, property) {
    var $settings_block = $("<div>", { class: "formbuilder-settings-block" });
    var $settings_input = $("<input>", { class: "formbuilder-settings-input" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });

    $settings_label
      .html(label)
      .appendTo($settings_block);

    $settings_input.appendTo($settings_block);

    if (typeof this.element.props[property] == "string") {
      $settings_input.val(this.element.props[property]);
      $settings_input.keyup(function (property, $input) {
        this.element.props[property] = $input.val();
        this.element.builder.reload_form();
      }.bind(this, property, $settings_input));
    }
    else {
      $settings_input.attr('type', 'checkbox');
      $settings_input.attr('checked', this.element.props[property]);
      $settings_input.change(function (property, $input) {
        this.element.props[property] = $input.is(':checked');
        this.element.builder.reload_form();
      }.bind(this, property, $settings_input));
    }
      
    this.element.builder.settings.$field_properties.append($settings_block);
  }

  // Radio, dropdowns and checkboxes
  this.multiple_options = function () {
    var $settings_block = $("<div>", { class: "formbuilder-settings-block" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });
    $settings_label.html("Options").appendTo($settings_block);

    for (var i=0; i<this.element.props.options.length; i++) {
      var $option_input = $("<input>", { class: "formbuilder-settings-input" }).val(this.element.props.options[i].value);
      var $option_remove = $("<span>", { class: "formbuilder-icon" }).html($("<i>", { class: "fas fa-minus-circle" }));
      $option_input.keyup(function ($el, index) {
        this.element.props.options[index].value = $el.val();
        this.element.builder.reload_form();
      }.bind(this, $option_input, i));
      $option_remove.click(function (index) {
        this.element.props.options.splice(index, 1);
        this.element.builder.reload_form();
        this.element.builder.reload_settings();
      }.bind(this, i));
      $settings_block.append($option_input);
      $settings_block.append($option_remove);
    }

    this.element.builder.settings.$field_properties.append($settings_block);

    this.element.builder.settings.$field_properties.append(
      $("<a>", { class: "formbuilder-button", href: "javascript:;" })
        .html("Add option")
        .click(function () { 
          this.element.props.options.push({ value: "" });
          this.element.builder.reload_form();
          this.element.builder.reload_settings();
        }.bind(this))
    );
  }

  // Zip into json
  this.zip = function () {
    var properties = {
      class: this.element.constructor.name,
      props: this.element.props
    }
    return properties;
  }
}