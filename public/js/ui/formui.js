function FormUI($dom) {

  // Set up
  this.$dom = $dom;
  this.load = new FormLoad(this);
  this.props = {};
  this.editable = false;

  this.elements = [];

  // DOM elements
  this.$form = null;
  this.$body = null;
  this.$choose_elem_select = null;

  // Initialise
  this.init = function () {
    var $form = $("<div>", { class: "formbuilder-form" });
    this.$dom.html($form);
    this.$form = $form;
    this.load.do(function () {
      this.load_form();
    }.bind(this));
  }

  this.load_form = function () {
    var $title = $("<div>", { class: "formbuilder-title" }).html(this.props.name);
    var $desc = $("<div>", { class: "formbuilder-description" }).html(this.props.description);
    var $header = $("<div>", { class: "formbuilder-header" });
    var $body = $("<div>", { class: "formbuilder-body" });
    this.$form.html(
      $header.html($title).append($desc)
    ).append($body);
    this.$body = $body;
    this.init_elements();
    this.submit_button();
  }

  // Prints all the elements in the form
  this.init_elements = function () {
    for (var i=0; i<this.elements.length; i++) {
      this.elements[i].super.setIndex(i);
      this.elements[i].init(this.$body);
    }
  }

   // Adds the submit button
   this.submit_button = function () {
    var $submit = $("<input>", { value: this.props.submit, type: "button", class: "formbuilder-submit" });
    this.$form.append($submit);
  }

}