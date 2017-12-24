function FormElement(element) {
  this.element = element;

  // When clicking a generic form element
  this.onclick = function () {
    this.element.$elem.click(function () {
      if (this.element.builder.selected == this.element.index) {
        this.element.builder.selected = null;
      }
      else {
        this.element.builder.selected = this.element.index;
      }
      this.element.builder.reload_form();
      this.element.builder.reload_settings();
    }.bind(this));
  }

  // Wheb selecting an element
  this.select = function () {
    if (this.element.builder.selected == this.element.index) {
      this.element.$elem.addClass("selected");
    }
  }

  // Setting the index property
  this.setIndex = function(i) {
    this.element.index = i;
  }

  // Generic element settings
  this.regular_settings = function () {
    $elem_title = $("<input>", { class: "formbuilder-settings-input" }).val(this.element.label);
    this.element.builder.settings.$field_properties.append("Label<br />").append($elem_title);
    $elem_help = $("<input>", { class: "formbuilder-settings-input" }).val(this.element.help);
    this.element.builder.settings.$field_properties.append("<br /><br />Help text<br />").append($elem_help);
    $elem_title.keyup(function () {
      this.element.label = $elem_title.val();
      this.element.builder.reload_form();
    }.bind(this));
    $elem_help.keyup(function () {
      this.element.help = $elem_help.val();
      this.element.builder.reload_form();
    }.bind(this));
  }
}