function FormElement(element) {
  this.element = element;

  this.props = {
    label: "Label",
    help: "Help text goes here"
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
    $elem_title = $("<input>", { class: "formbuilder-settings-input" }).val(this.element.props.label);
    this.element.builder.settings.$field_properties.append("Label<br />").append($elem_title);
    $elem_help = $("<input>", { class: "formbuilder-settings-input" }).val(this.element.props.help);
    this.element.builder.settings.$field_properties.append("<br /><br />Help text<br />").append($elem_help);
    $elem_title.keyup(function () {
      this.element.props.label = $elem_title.val();
      this.element.builder.reload_form();
    }.bind(this));
    $elem_help.keyup(function () {
      this.element.props.help = $elem_help.val();
      this.element.builder.reload_form();
    }.bind(this));
  }

  // Radio, dropdowns and checkboxes
  this.multiple_options = function () {
    this.element.builder.settings.$field_properties.append("<br /><br />Options<br />");
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
      this.element.builder.settings.$field_properties.append($option_input);
      this.element.builder.settings.$field_properties.append($option_remove);
    }
    this.element.builder.settings.$field_properties.append("<br />").append(
      $("<a>", { class: "formbuilder-button", href: "javascript:;" })
        .html("+ Add new option")
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