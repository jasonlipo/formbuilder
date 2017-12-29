var FormValidate = {
  validation_options: {
    0: "No validation",
    1: "Email address",
    2: "Number",
    3: "Phone Number",
    4: "First/Last Name",
    5: "Address"
  },

  settings: function (element) {
    element.super.setting_section("Element Type");
    var $settings_block = $("<div>", { class: "formbuilder-settings-block" });
    var $settings_input = $("<select>", { class: "formbuilder-settings-input" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });

    $settings_label.html("Type").appendTo($settings_block);

    for (i in this.validation_options) {
      var $option = $("<option>", { value: i }).html(this.validation_options[i]);
      if (element.props.validation.type == i) {
        $option.attr("selected", true);
      }
      $settings_input.append($option);
    }

    $settings_input.appendTo($settings_block);
    element.form.settings.$field_properties.append($settings_block);

    // Number validation
    if (element.props.validation.type == 2) {
      var $minmax_block = $("<div>", { class: "formbuilder-settings-block formbuilder-half" });
      var $minmax_label = $("<label>", { class: "formbuilder-label" });
      var $min_input = $("<input>", { type: "text", class: "formbuilder-settings-input" });
      var $max_input = $("<input>", { type: "text", class: "formbuilder-settings-input" });
      $minmax_block
        .append($minmax_label.clone().html("Min"))
        .append($minmax_label.clone().html("Max"))
        .append(
          $min_input.val(element.props.validation.min).keyup(function ($el) {
            this.props.validation.min = $el.val();
            this.form.reload_form();
          }.bind(element, $min_input))
        )
        .append(
          $max_input.val(element.props.validation.max).keyup(function ($el) {
            this.props.validation.max = $el.val();
            this.form.reload_form();
          }.bind(element, $max_input))
        )
        .appendTo(element.form.settings.$field_properties);
      
      if (element.form.props.payment) {
        element.form.settings.$field_properties.append(element.form.payment.number_price(element.props.validation));
      }
    }

     // Address validation
     if (element.props.validation.type == 5) {
      var $numlines_block = $("<div>", { class: "formbuilder-settings-block" });
      var $numlines_label = $("<label>", { class: "formbuilder-label" });
      var $numlines_input = $("<input>", { type: "text", class: "formbuilder-settings-input" });
      $numlines_block
        .append($numlines_label.html("Number of address lines"))
        .append(
          $numlines_input.val(element.props.validation.address).keyup(function ($el) {
            this.props.validation.address = $el.val();
            this.form.reload_form();
          }.bind(element, $numlines_input))
        )
        .appendTo(element.form.settings.$field_properties);
    }
    
    $settings_input.change(function ($el) {
      element.props.validation = {};
      if ($el.val() == 2) {
        element.props.validation.min = 0;
        element.props.validation.max = 0;
      }
      if ($el.val() == 5) {
        element.props.validation.address = 3;
      }
      element.props.validation.type = parseInt($el.val());
      element.form.reload_form();
      element.form.reload_settings();
    }.bind(this, $settings_input));
  }
}