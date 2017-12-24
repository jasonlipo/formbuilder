function FormBuilder($dom) {

  // Set up
  this.$dom = $dom;
  this.settings = new FormSettings(this);
  this.save = new FormSave(this);
  this.structure = new FormStructure(this);
  this.element_list = FormElementList.all();

  // Defaults
  this.name = "My Form";
  this.description = "A description of your form goes here";
  this.elements = [];
  this.selected = null;

  // DOM elements
  this.$form = null;
  this.$body = null;
  this.$choose_elem_select = null;

  // Initialise
  this.init = function () {
    var $form = $("<div>", { class: "formbuilder-form" });
    this.$dom.html($form);
    this.$form = $form;
    this.settings.init();
    this.save.init();
    this.reload_form();
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
    this.save.save();
  }

  // Reload settings
  this.reload_settings = function () {
    this.settings.display();
  }

  // Prints all the elements in the form
  this.init_elements = function () {
    for (var i=0; i<this.elements.length; i++) {
      this.elements[i].super.setIndex(i);
      this.elements[i].init();
    }
    if (this.elements.length == 0) {
      var $empty = $("<div>", { class: "formbuilder-element" });
      var $empty_label = $("<label>", { class: "formbuilder-label" }).html("Empty Form!");
      this.$body.append($empty.html($empty_label).append("Please insert an element"));
    }
    this.$body.sortable({
      items: "> .formbuilder-selectable",
      placeholder: "formbuilder-placeholder",
      forcePlaceholderSize: true,
      update: function (event, ui) {
        $obj = ui.item;
        var old_index = $obj.attr("formbuilder-index");
        var removed_elements = this.elements.splice(old_index, 1);
        var new_index = $obj.index(".formbuilder-body .formbuilder-element");
        this.elements.splice(new_index, 0, removed_elements[0]);
        this.selected = null;
        this.reload_form();
      }.bind(this)
    });
  }

  // Adds the submit button
  this.submit_button = function () {
    var $submit = $("<input>", { value: "Submit", type: "button", class: "formbuilder-submit" });
    this.$form.append($submit);
  }

}