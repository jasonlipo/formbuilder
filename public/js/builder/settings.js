function FormSettings(builder) {
  
  // DOM elements
  this.builder = builder;
  this.$dom = null;
  this.$tab = null;
  this.$add_field = null;
  this.$field_properties = null;
  this.$form_properties = null;
  
  // Initialise
  this.init = function () {
    var $title = $("<div>", { class: "formbuilder-settings-title" }).html("Settings");
    var $body = $("<div>", { class: "formbuilder-settings-content" });
    var $settings = $("<div>", { class: "formbuilder-settings" });
    this.builder.$dom.append(
      $settings.append($title).append($body)
    );
    this.$dom = $settings;
    this.$tab = $body;
    this.make_tabs();
    this.display();
  }

  // Create the three tabs
  this.make_tabs = function () {
    var $tab_add = $("<li>").html($("<a>", { href: "#formbuilder-tab1" }).html("Add a Field"));
    var $tab_field = $("<li>").html($("<a>", { href: "#formbuilder-tab2" }).html("Field Properties"));
    var $tab_form = $("<li>").html($("<a>", { href: "#formbuilder-tab3" }).html("Form Properties"));
    this.$tab.html(
      $("<ul>")
        .append($tab_add)
        .append($tab_field)
        .append($tab_form)
    );
    this.$add_field = $("<div>", { id: "formbuilder-tab1" });
    this.$field_properties = $("<div>", { id: "formbuilder-tab2" });
    this.$form_properties = $("<div>", { id: "formbuilder-tab3" });
    this.$tab
      .append(this.$add_field)
      .append(this.$field_properties)
      .append(this.$form_properties);

    this.$tab.tabs();
  }

  // Display settings
  this.display = function () {
    
    if (this.builder.selected != null) {
      // Element settings
      this.$field_properties.html("");
      var selected_elem = this.builder.elements[this.builder.selected];
      selected_elem.get_settings();
      this.$tab.tabs("option", "active", 1);
    }
    else {
      this.$field_properties.html("Please select a field to edit");
      this.$tab.tabs("option", "active", 0);
    }

    // Form settings
    this.$form_properties.html("");
    $form_title = $("<input>", { class: "formbuilder-settings-input" }).val(this.builder.name);
    this.$form_properties.append("Form Title<br />").append($form_title);
    $form_desc = $("<input>", { class: "formbuilder-settings-input" }).val(this.builder.description);
    this.$form_properties.append("<br /><br />Form Description<br />").append($form_desc);
    $form_title.keyup(function () {
      this.builder.name = $form_title.val();
      this.builder.reload_form();
    }.bind(this));
    $form_desc.keyup(function () {
      this.builder.description = $form_desc.val();
      this.builder.reload_form();
    }.bind(this));

    this.choose_element();
  }

  // Adds the new element chooser
  this.choose_element = function () {
    var $select = $("<select>", { class: "formbuilder-select formbuilder-settings-input" });
    var $default = $("<option>", { value: "" }).html("Choose an element...");
    $select.append($default);
    for (var i=0; i<this.builder.element_list.length; i++) {
      var this_el = this.builder.element_list[i];
      var $option = $("<option>", { value: i }).html(this_el.title);
      $select.append($option);
    }

    var $newelem = $("<div>", { class: "formbuilder-add" })
                      .append("Insert a new form element<br />")
                      .append($select);
    this.$add_field.html($newelem);
    this.builder.$choose_elem_select = $select;
    this.builder.$choose_elem_select.on('change', this.select_element.bind(this));
  }

  // Adds a new element based on selector
  this.select_element = function () {
    var value = this.builder.$choose_elem_select.val();
    var widget = this.builder.element_list[value].widget;
    var element = new (widget)(this.builder);
    this.builder.elements.push(element);
    this.builder.reload_form();
    this.builder.reload_settings();
  }

}