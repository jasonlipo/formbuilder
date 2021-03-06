function FormPayment(builder) {

  this.builder = builder;
  
  // Load the payment settings
  this.settings = function () {
    this.builder.settings.setting_section("Payment");

    var $settings_block = $("<div>", { class: "formbuilder-settings-block" });
    var $settings_input = $("<input>", { type: "checkbox", class: "formbuilder-settings-input" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });

    $settings_label.html("Enabled").appendTo($settings_block);
    $settings_input.appendTo($settings_block);
    $settings_input.attr('checked', this.builder.props.payment);
    $settings_input.change(function ($input) {
      this.builder.props.payment = $input.is(':checked');
      this.builder.reload_form();
      this.builder.reload_settings();
    }.bind(this, $settings_input));

    this.builder.settings.$form_properties.append($settings_block);

    if (this.builder.props.payment) {
      this.builder.settings.add_setting("Stripe Public Key", "stripe_public_key");
      this.builder.settings.add_setting("Stripe Secret Key", "stripe_secret_key");
    }
  }

  this.price_settings = function (option) {
    var $settings_input = $("<input>", { type: "text", class: "formbuilder-payment-input" }).val(option.price);

    $settings_input.change(function ($input, option) {
      option.price = $input.val();
      this.builder.reload_form();
      this.builder.reload_settings();
    }.bind(this, $settings_input, option));

    return $settings_input;
  }

  this.price_label = function () {
    var $settings_label= $("<label>", { class: "formbuilder-label" })
      .html("Price (&pound;)")
      .css("width", "auto");
    return $settings_label;
  }

  this.number_price = function (validation) {
    var $settings_block = $("<div>", { class: "formbuilder-settings-block" });
    var $settings_label = $("<label>", { class: "formbuilder-label" }).html("Price multiplier (&pound;)");
    $settings_block.append($settings_label)

    var $settings_input = $("<input>", { type: "text", class: "formbuilder-settings-input" }).val(validation.price);
    $settings_input.change(function ($input, validation) {
      validation.price = $input.val();
      this.builder.reload_form();
      this.builder.reload_settings();
    }.bind(this, $settings_input, validation));
    $settings_block.append($settings_input)

    return $settings_block;
  }

}