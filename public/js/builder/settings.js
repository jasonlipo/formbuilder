function FormSettings(builder) {
  this.builder = builder;

  // Initialise
  this.init = function () {
    var $title = $("<div>", { class: "formbuilder-settings-title" }).html("Settings");
    var $body = $("<div>", { class: "formbuilder-settings-content" });
    var $settings = $("<div>", { class: "formbuilder-settings" });
    this.builder.$dom.append(
      $settings.append($title).append($body)
    );
    this.builder.$settings = $body;
    this.display();
  }

  // Display settings
  this.display = function () {
    this.builder.$settings.html("");
    if (this.builder.selected != null) {
      // Element settings
      var selected_elem = this.builder.elements[this.builder.selected];
      $elem_title = $("<input>", { class: "formbuilder-settings-input" }).val(selected_elem.label);
      this.builder.$settings.append("Label<br />").append($elem_title);
      $elem_help = $("<input>", { class: "formbuilder-settings-input" }).val(selected_elem.help);
      this.builder.$settings.append("<br /><br />Help text<br />").append($elem_help);
      $elem_title.change(function () {
        selected_elem.label = $elem_title.val();
        this.builder.init();
      }.bind(this));
      $elem_help.change(function () {
        selected_elem.help = $elem_help.val();
        this.builder.init();
      }.bind(this));
    }
    else {
      // Form settings
      $form_title = $("<input>", { class: "formbuilder-settings-input" }).val(this.builder.name);
      this.builder.$settings.append("Form Title<br />").append($form_title);
      $form_desc = $("<input>", { class: "formbuilder-settings-input" }).val(this.builder.description);
      this.builder.$settings.append("<br /><br />Form Description<br />").append($form_desc);
      $form_title.change(function () {
        this.builder.name = $form_title.val();
        this.builder.init();
      }.bind(this));
      $form_desc.change(function () {
        this.builder.description = $form_desc.val();
        this.builder.init();
      }.bind(this));
    }
  }

}