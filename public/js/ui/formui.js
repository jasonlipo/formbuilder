function FormUI($dom) {

  // Set up
  this.$dom = $dom;
  this.load = new FormLoad(this);
  this.pages = new FormPages(this);
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
      this.pages.separate();
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
    this.init_page();
  }

  // Prints all the elements in this page
  this.init_page = function () {
    this.$body.html("");
    for (var i=0; i<this.pages.data[this.pages.current].length; i++) {
      this.pages.data[this.pages.current][i].super.setIndex(i);
      this.pages.data[this.pages.current][i].init(this.$body);
    }
  }

}