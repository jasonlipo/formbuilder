function FormBuilder($dom) {

  // Set up
  this.$dom = $dom;
  this.settings = new FormSettings(this);
  this.element_list = FormElementList.all();

  // Defaults
  this.name = "My Form";
  this.description = "A description of your form goes here";
  this.elements = [];

  // DOM elements
  this.$form = null;
  this.$body = null;
  this.$choose_elem_select = null;

  // Initialise
  this.init = function () {
    var $title = $("<div>", { class: "formbuilder-title" }).html(this.name);
    var $desc = $("<div>", { class: "formbuilder-description" }).html(this.description);
    var $header = $("<div>", { class: "formbuilder-header" });
    var $body = $("<div>", { class: "formbuilder-body" });
    var $form = $("<div>", { class: "formbuilder-form" });
    this.$dom.append(
      $form.append(
        $header.append($title).append($desc)
      ).append($body)
    );
    this.$form = $form;
    this.$body = $body;
    this.submit_button();
    this.choose_element();
    this.settings.init();
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

    var $label = $("<label>").html("Insert a new form element");
    var $newelem = $("<div>", { class: "formbuilder-element" })
                      .addClass("last")
                      .append($label)
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
    element.init();
    this.$choose_elem_select.val('');
  }

}