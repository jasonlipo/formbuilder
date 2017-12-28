function FormBuilder($dom) {

  // Set up
  this.$dom = $dom;
  this.settings = new FormSettings(this);
  this.save = new FormSave(this);
  this.load = new FormLoad(this);
  this.structure = new FormStructure(this);
  this.payment = new FormPayment(this);
  this.element_list = FormElementList.all();
  this.scroll = 0;

  // Defaults
  this.props = {
    name: "My Form",
    description: "A description of your form goes here",
    redirect: "",
    submit: "Submit",
    email_confirmation: null,
    email_confirmation_message: "",
    payment: false
  };

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
    this.load.do(function () {
      this.reload_form();
      this.reload_settings();
    }.bind(this));
    $(window).scroll(function (e) {
      this.scroll = $(document).scrollTop();
    }.bind(this));
  }

  // Reload form with current settings
  this.reload_form = function () {
    var $title = $("<div>", { class: "formbuilder-title" }).html(this.props.name);
    var $desc = $("<div>", { class: "formbuilder-description" }).html(this.props.description);
    var $header = $("<div>", { class: "formbuilder-header" });
    var $body = $("<div>", { class: "formbuilder-body formbuilder-sort-container" });
    this.$form.html(
      $header.html($title).append($desc)
    ).append($body);
    this.$body = $body;
    this.init_elements();
    this.submit_button();
    this.save.save();
    $('html, body').animate({
      scrollTop: this.scroll
    }, 0);
  }

  // Reload settings
  this.reload_settings = function () {
    this.settings.display();
  }

  // Prints all the elements in the form
  this.init_elements = function () {
    for (var i=0; i<this.elements.length; i++) {
      this.elements[i].super.setIndex(i);
      this.elements[i].init(this.$body);
    }
    if (this.elements.length == 0) {
      var $empty = $("<div>", { class: "formbuilder-element" });
      var $empty_label = $("<label>", { class: "formbuilder-label" }).html("Empty Form!");
      this.$body.append($empty.html($empty_label).append("Please insert an element"));
    }
    this.$body.sortable({
      create: function(){
        jQuery(this).height(jQuery(this).height());
      },
      cancel: null,
      items: "> .formbuilder-selectable",
      placeholder: "formbuilder-placeholder",
      forcePlaceholderSize: true,
      connectWith: ".formbuilder-sort-container",
      remove: function (event, ui) {
        $obj = ui.item;
        // Dropped into a repeater
        var repeater_index = $obj.parent(".formbuilder-repeater").parent(".formbuilder-element").attr('formbuilder-index');
        var repeater = this.elements[repeater_index];
        var old_index = $obj.attr("formbuilder-index");
        var removed_elements = this.elements.splice(old_index, 1);
        var inner_index = $obj.index(".formbuilder-repeater > .formbuilder-element");
        repeater.props.children.splice(inner_index, 0, removed_elements[0]);
        this.reload_form();
      }.bind(this),
      stop: function (event, ui) {
        $obj = ui.item;
        if ($obj.parent(".formbuilder-repeater").length == 0) {
          var old_index = $obj.attr("formbuilder-index");
          var removed_elements = this.elements.splice(old_index, 1);
          var new_index = $obj.index(".formbuilder-body > .formbuilder-element");
          this.elements.splice(new_index, 0, removed_elements[0]);
          this.selected = null;
          this.reload_form();
        }
      }.bind(this)
    });
  }

  // Adds the submit button
  this.submit_button = function () {
    var $submit = $("<input>", { value: this.props.submit, type: "button", class: "formbuilder-submit" });
    this.$form.append($submit);
  }

}