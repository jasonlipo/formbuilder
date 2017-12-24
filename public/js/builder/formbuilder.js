function FormBuilder($dom) {

  // Set up
  this.$dom = $dom;
  this.settings = new FormSettings(this);
  this.element_list = FormElementList.all();

  // Defaults
  this.name = "My Form";
  this.description = "A description of your form goes here";
  this.elements = [];
  this.submitted = null;

  // DOM elements
  this.$form = null;
  this.$body = null;
  this.$choose_elem_select = null;
  this.$settings = null;

  // Initialise
  this.init = function () {
    var $form = $("<div>", { class: "formbuilder-form" });
    this.$dom.html($form);
    this.$form = $form;
    this.reload_form();
    this.reload_settings();
  }

  // Reload form with current settings
  this.reload_form = function () {
    var $title = $("<div>", { class: "formbuilder-title" }).html(this.name);
    var $desc = $("<div>", { class: "formbuilder-description" }).html(this.description);
    var $header = $("<div>", { class: "formbuilder-header" });
    var $body = $("<div>", { class: "formbuilder-body" });
    this.$form.html(
      $header.html($title).append($desc)
    ).append($body);
    this.$body = $body;
    this.init_elements();
    this.submit_button();
    this.choose_element();
  }

  // Reload settings
  this.reload_settings = function () {
    this.settings.init();
  }

  // Prints all the elements in the form
  this.init_elements = function () {
    for (var i=0; i<this.elements.length; i++) {
      this.elements[i].init();
    }
  }

  // Adds the submit button
  this.submit_button = function () {
    var $submit = $("<input>", { value: "Submit", type: "button", class: "formbuilder-submit" });
    this.$form.append($submit);
  }

  // Adds the new element chooser
  this.choose_element = function () {
    var $select = $("<select>", { class: "formbuilder-select" });
    var $default = $("<option>", { value: "" }).html("Choose an element...");
    $select.append($default);
    for (var i=0; i<this.element_list.length; i++) {
      var this_el = this.element_list[i];
      var $option = $("<option>", { value: i }).html(this_el.title);
      $select.append($option);
    }

    var $newelem = $("<div>", { class: "formbuilder-add" })
                      .append("Insert a new form element<br />")
                      .append($select);
    this.$form.append($newelem);
    this.$choose_elem_select = $select;
    this.$choose_elem_select.on('change', this.select_element.bind(this));
  }

  // Adds a new element based on selector
  this.select_element = function () {
    var value = this.$choose_elem_select.val();
    var widget = this.element_list[value].widget;
    var element = new (widget)(this);
    this.elements.push(element);
    this.init();
  }

}