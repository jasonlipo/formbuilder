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
      if (this.builder.selected.toString().indexOf(".") > -1) {
        var selected_components = this.builder.selected.split(".");
        this.builder.elements[selected_components[0]].props.children[selected_components[1]].get_settings();
      }
      else {
        this.builder.elements[this.builder.selected].get_settings();
      }
      this.$tab.tabs("option", "active", 1);
    }
    else {
      this.$field_properties.html("Please select a field to edit");
      this.$tab.tabs("option", "active", 0);
    }

    // Form settings
    this.$form_properties.html("");
    
    this.setting_section("General");
    this.add_setting("Form Title", "name");
    this.add_setting("Form Description", "description");

    this.builder.payment.settings();

    this.setting_section("Navigation");
    this.add_setting("Previous page button", "prev");
    this.add_setting("Next page button", "next");
    this.add_setting("Submit button", "submit");

    this.setting_section("Submission");
    this.add_setting("Redirect after Submission", "redirect");
    this.add_setting("From Name", "confirmation_from_name");
    this.add_setting("From Email Address", "confirmation_from_email");
    this.email_confirmation();

    this.setting_section("AWS S3");
    this.add_setting("AWS Access Key", "aws_access_key");
    this.add_setting("AWS Secret Key", "aws_secret_key");
    this.add_setting("S3 Bucket Name", "s3_bucket");

    this.setting_section("Emails");
    this.add_setting("SMTP Server", "smtp_server");
    this.add_setting("Customer SMTP Username", "smtp_username");
    this.add_setting("Customer SMTP Password", "smtp_password");
    this.add_setting("Notify From Address", "notify_from_email");
    this.add_setting("Notify SMTP Username", "notify_smtp_username");
    this.add_setting("Notify SMTP Password", "notify_smtp_password");
    this.add_setting("SMTP Port", "smtp_port");

    this.choose_element();
  }

  // Add setting section
  this.setting_section = function (label) {
    var $settings_section = $("<div>", { class: "formbuilder-settings-section" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });
    $settings_label.html(label).appendTo($settings_section);
    this.$form_properties.append($settings_section);
  }

  // Add setting to link to form property
  this.add_setting = function (label, property) {
    var $settings_block = $("<div>", { class: "formbuilder-settings-block" });
    var $settings_input = $("<input>", { class: "formbuilder-settings-input" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });

    $settings_label
      .html(label)
      .appendTo($settings_block);

    $settings_input
      .val(this.builder.props[property])
      .appendTo($settings_block)
      .keyup(function (property, $input) {
        this.builder.props[property] = $input.val();
        this.builder.reload_form();
      }.bind(this, property, $settings_input));

    this.$form_properties.append($settings_block);
  }

  // Email confirmation settings
  this.email_confirmation = function () {
    var email_elements = this.builder.elements.filter(function (i) {
      return i.props.validation && i.props.validation.type == 1;
    });
    var $email_block = $("<div>", { class: "formbuilder-settings-block" });
    var $email_label = $("<label>", { class: "formbuilder-label" });
    var $email_input = $("<select>", { class: "formbuilder-settings-input" });
    $email_input.append($("<option>").html("[No email]"));
    for (var i=0; i<email_elements.length; i++) {
      $option = $("<option>", { value: email_elements[i].props.id }).html(email_elements[i].props.label);
      if (this.builder.props.email_confirmation === $option.val()) {
        $option.attr("selected", true);
      }
      $email_input.append($option);
    }
    $email_block
      .append($email_label.html("Send confirmation email to"))
      .append(
        $email_input.change(function ($el) {
          this.builder.props.email_confirmation = $el.val();
          this.builder.reload_form();
        }.bind(this, $email_input))
      )
      .appendTo(this.$form_properties);

    var text_elements = this.builder.elements.filter(function (i) {
      return i.props.validation && (i.props.validation.type == 0 || i.props.validation.type == 4);
    });
    var $text_block = $("<div>", { class: "formbuilder-settings-block" });
    var $text_label = $("<label>", { class: "formbuilder-label" });
    var $text_input = $("<select>", { class: "formbuilder-settings-input" });
    $text_input.append($("<option>").html("\"Guest\""));
    for (var i=0; i<text_elements.length; i++) {
      $option = $("<option>", { value: text_elements[i].props.id }).html(text_elements[i].props.label);
      if (this.builder.props.email_to === $option.val()) {
        $option.attr("selected", true);
      }
      $text_input.append($option);
    }
    $text_block
      .append($text_label.html("Name in confirmation email"))
      .append(
        $text_input.change(function ($el) {
          this.builder.props.email_to = $el.val();
          this.builder.reload_form();
        }.bind(this, $text_input))
      )
      .appendTo(this.$form_properties);

    var $msg_block = $("<div>", { class: "formbuilder-settings-block" });
    var $msg_input = $("<textarea>", { class: "formbuilder-settings-input" });
    var $msg_label = $("<label>", { class: "formbuilder-label" });
  
    $msg_label.html("Email confirmation template").appendTo($msg_block);

    $msg_input
      .html(this.builder.props["email_confirmation_message"])
      .appendTo($msg_block)
      .keyup(function ($input) {
        this.builder.props["email_confirmation_message"] = $input.val();
        this.builder.reload_form();
      }.bind(this, $msg_input));

    this.$form_properties.append($msg_block);

    var $pay_block = $("<div>", { class: "formbuilder-settings-block" });
    var $pay_input = $("<textarea>", { class: "formbuilder-settings-input" });
    var $pay_label = $("<label>", { class: "formbuilder-label" });

    $pay_label.html("Payment confirmation template").appendTo($pay_block);

    $pay_input
                                              .html(this.builder.props["pay_confirmation_message"])
                                              .appendTo($pay_block)
                                              .keyup(function ($input) {
                                                this.builder.props["pay_confirmation_message"] = $input.val();
                                                this.builder.reload_form();
                                              }.bind(this, $pay_input));

    this.$form_properties.append($pay_block);
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
    if (this.builder.selected == null) {
      this.builder.elements.push(element);
      this.builder.selected = this.builder.elements.length - 1;
    }
    else {
      if (this.builder.selected.toString().indexOf(".") > -1) {
        // Inside a repeater, add after this element
        var selected_components = this.builder.selected.toString().split(".");
        this.builder.elements[selected_components[0]].props.children.splice(parseInt(selected_components[1])+1, 0, element);
        this.builder.selected = selected_components[0] + "." + (parseInt(selected_components[1])+1);
      }
      else if (this.builder.elements[this.builder.selected].constructor.name == "FormElement_Repeater") {
        // Is a repeater, add to the end of the repeater
        var new_inner_index = this.builder.elements[this.builder.selected].props.children.length;
        this.builder.elements[this.builder.selected].props.children.push(element);
        this.builder.selected = this.builder.selected + "." + new_inner_index;
      }
      else {
        this.builder.elements.splice(this.builder.selected+1, 0, element);
        this.builder.selected += 1;
      }
    }
    this.builder.reload_form();
    this.builder.reload_settings();
    $('html,body').animate({ scrollTop: this.builder.elements[this.builder.selected].$elem.offset().top }, 0);
  }

}
