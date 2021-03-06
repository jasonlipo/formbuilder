function FormElement(element) {
  this.element = element;

  this.props = {
    label: "Element Label",
    help: "",
    required: false,
    validation: {}
  }

  // Is selected
  this.is_selected = function () {
    if (this.element.form.selected === this.element.index) {
      this.element.$elem.addClass("selected");
    }
  }

  // Print out the label (checking if required or not)
  this.print_label = function () {
    var $help = $("<small>").html(this.element.props.help);
    var $label = $("<label>", { class: "formbuilder-label" }).html(this.element.props.label);
    if (this.element.props.required) {
      $label.append($("<span>", { class: "formbuilder-required" }).html("*"));
    }
    $label.append($help);
    return $label;
  }

  // When clicking a generic form element
  this.onclick = function () {
    this.element.$elem.click(function (e) {
      e.stopPropagation();
      this.element.form.$body.find(".selected").removeClass("selected");
      if (this.element.form.selected === this.element.index) {
        this.element.form.selected = null;
      }
      else {
        this.element.form.selected = this.element.index;
        this.element.$elem.addClass("selected");
      }
      this.element.form.reload_settings();
    }.bind(this));
  }

  // Validate element when changing/typing
  this.validate_on_change = function () {
    this.element.super.get_input().on("keyup change", function () {
      this.element.form.validator.validate_element(this.element);
      if (this.element.form.props.payment) {
        this.element.form.payment.check_payment(this.element);
      }
    }.bind(this));
  }

  // Setting the index property
  this.setIndex = function(i) {
    this.element.index = i;
  }

  // Get the input/textarea/select from the element
  this.get_input = function () {
    return this.element.$elem.find("input, select, textarea");
  }

  // Generic element settings
  this.regular_settings = function () {
    this.setting_section("General");
    this.add_setting("Field Label", "label");
    this.add_setting("Field Help Text", "help");
    this.add_setting("Required", "required", true);
  }

  // Add setting section
  this.setting_section = function (label) {
    var $settings_section = $("<div>", { class: "formbuilder-settings-section" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });
    $settings_label.html(label).appendTo($settings_section);
    this.element.form.settings.$field_properties.append($settings_section);
  }

  // Setting to delete element
  this.setting_delete = function () {
    $("<a>", { class: "formbuilder-button formbuilder-delete" })
      .html("Delete")
      .appendTo(this.element.form.settings.$field_properties)
      .click(function () {
        if (this.element.index.toString().indexOf(".") > -1) {
          var selected_components = this.element.index.split(".");
          this.element.form.elements[selected_components[0]].props.children.splice(selected_components[1], 1);
        }
        else {
          this.element.form.elements.splice(this.element.index, 1);
        }
        this.element.form.selected = null;
        this.element.form.reload_form();
        this.element.form.reload_settings();
      }.bind(this));
  }

  // Add setting to link to field property
  this.add_setting = function (label, property) {
    var $settings_block = $("<div>", { class: "formbuilder-settings-block" });
    var $settings_input = $("<input>", { class: "formbuilder-settings-input" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });

    $settings_label
      .html(label)
      .appendTo($settings_block);

    $settings_input.appendTo($settings_block);

    if (typeof this.element.props[property] == "string") {
      $settings_input.val(this.element.props[property]);
      $settings_input.keyup(function (property, $input) {
        this.element.props[property] = $input.val();
        this.element.form.reload_form();
      }.bind(this, property, $settings_input));
    }
    else {
      $settings_input.attr('type', 'checkbox');
      $settings_input.attr('checked', this.element.props[property]);
      $settings_input.change(function (property, $input) {
        this.element.props[property] = $input.is(':checked');
        this.element.form.reload_form();
      }.bind(this, property, $settings_input));
    }

    this.element.form.settings.$field_properties.append($settings_block);
  }

  // Radio, dropdowns and checkboxes
  this.multiple_options = function () {
    var $settings_block = $("<div>", { class: "formbuilder-settings-block" });
    var $settings_label = $("<label>", { width: 180, class: "formbuilder-label" });
    $settings_label.html("Options").appendTo($settings_block);
    var $limit_label = $("<label>", { width: 70, class: "formbuilder-label" });
    $limit_label.html("Limit").appendTo($settings_block);
    if (this.element.form.props.payment) {
      $settings_block.append(this.element.form.payment.price_label())
    }

    for (var i=0; i<this.element.props.options.length; i++) {
      var $option_input = $("<input>", { class: "formbuilder-settings-input", width: 180 }).val(this.element.props.options[i].value);
      var option_required_id = Math.random().toString(36).substring(2, 15)
      var $option_required = $("<input>", { id: option_required_id, type: "checkbox", checked: this.element.props.options[i].required  })
      var $option_required_label = $("<label>", { for: option_required_id }).html("Required")
      var $option_up = $("<span>", { class: "formbuilder-icon" }).html($("<i>", { class: "fas fa-arrow-up" }));
      var $option_down = $("<span>", { class: "formbuilder-icon" }).html($("<i>", { class: "fas fa-arrow-down" }));
      var $option_remove = $("<span>", { class: "formbuilder-icon" }).html($("<i>", { class: "fas fa-minus-circle" }));
      var $option_add_below = $("<span>", { class: "formbuilder-icon" }).html($("<i>", { class: "fas fa-plus" }));
      var $option_limit = $("<input>", { class: "formbuilder-settings-input", width: 70 }).val(this.element.props.options[i].limit);
      var $option_date = $("<span>", { class: "formbuilder-icon" }).html($("<i>", { class: "fas fa-calendar-alt" }));
      if (this.element.props.options[i].close) {
        var $option_date_container = $("<i>", { class: "formbuilder-option-close-date" });
        $option_date_container.append($option_date);
        $option_date_container.append(moment(this.element.props.options[i].close).format('D MMM YY HH:mm'));
        $option_date = $option_date_container;
      }
      var $option_datepicker = $("<input>", { class: "formbuilder-datepicker-popup", css: { display: "none" } });
      var onSelectCallback = function(self, i) {
        return function (date) {
          self.element.props.options[i].close = date;
          self.element.form.reload_form();
          self.element.form.reload_settings();
        }
      }(this, i)
      $option_datepicker.datetimepicker({
        onSelect: onSelectCallback,
        dateFormat: "yy-mm-dd"
      });

      // Events
      $option_input.keyup(function ($el, index) { this.element.props.options[index].value = $el.val(); this.element.form.reload_form(); }.bind(this, $option_input, i));
      $option_remove.click(function (index) { this.element.props.options.splice(index, 1); this.element.form.reload_form(); this.element.form.reload_settings(); }.bind(this, i));
      $option_required.change(function ($el, index) { this.element.props.options[index].required = $el.is(':checked'); this.element.form.reload_form(); }.bind(this, $option_required, i));
      $option_up.click(function ($el, index) { this.swapArrayElements(this.element.props.options, index, index - 1); this.element.form.reload_form(); this.element.form.reload_settings(); }.bind(this, $option_up, i));
      $option_down.click(function ($el, index) { this.swapArrayElements(this.element.props.options, index, index + 1); this.element.form.reload_form(); this.element.form.reload_settings(); }.bind(this, $option_down, i));
      $option_add_below.click(function ($el, index) { this.element.props.options.splice(index + 1, 0, { value: "" }); this.element.form.reload_form(); this.element.form.reload_settings(); }.bind(this, $option_add_below, i));
      $option_limit.keyup(function ($el, index) { this.element.props.options[index].limit = $el.val(); this.element.form.reload_form(); }.bind(this, $option_limit, i));
      $option_date.click(function($picker) {
        $picker.datepicker('show');
      }.bind(null, $option_datepicker));

      $settings_block.append($option_input);
      $settings_block.append($option_limit);
      if (this.element.form.props.payment) {
        $settings_block.append(this.element.form.payment.price_settings(this.element.props.options[i]));
      }
      $settings_block.append("<br />");
      $settings_block.append(`<em>${this.element.props.options[i].taken || 0} selections so far</em><br />`)
      $settings_block.append($option_required);
      $settings_block.append($option_required_label);
      $settings_block.append("&nbsp;&nbsp;&nbsp;");
      if (i > 0) {
        $settings_block.append($option_up);
      }
      if (i < this.element.props.options.length - 1) {
        $settings_block.append($option_down);
      }
      $settings_block.append($option_remove);
      $settings_block.append($option_add_below);
      $settings_block.append($option_datepicker);
      $settings_block.append($option_date);
      $settings_block.append("<br /><br />")
    }

    this.element.form.settings.$field_properties.append($settings_block);

    var path = this.element.form.$dom.attr('formpath');
    this.element.form.settings.$field_properties.append(
      $("<a>", { class: "formbuilder-button", href: "javascript:;" })
        .html("Add bulk options")
        .click(function () {
          $(".formcontrol-app-response-modal-bg, .formcontrol-app-response-modal").remove();
          $("body").append(`
            <div class="formcontrol-app-response-modal-bg"></div>
            <div class="formcontrol-app-response-modal">
              <h1>Bulk Upload Options</h1>
              <small>Copy and Paste multiple options, one per line<br /><b>Important: do not copy the column headers in row 1</b></small><br />
              <img src="${path}/public/bulk_upload.png" height="100" />
              <br /><br />
              <textarea style="width:100%; height: 300px;"></textarea>
              <br /><br />
            </div>
          `);
          $add_bulk_options = $("<a>", { class: "formbuilder-button" }).html("Add");
          $('.formcontrol-app-response-modal').append($add_bulk_options);
          $('.formcontrol-app-response-modal-bg').click(function () {
            $('.formcontrol-app-response-modal, .formcontrol-app-response-modal-bg').remove();
          })
          $add_bulk_options.click(function () {
            var new_values = $('.formcontrol-app-response-modal textarea').val().split("\n").map(x => x.split("\t")).map(v => {
              var obj = { value: v[0] }
              if (v[1] && v[1].toLowerCase() == "required") {
                obj.required = true
              }
              if (v[2] && moment(v[2]).isValid()) {
                obj.close = moment(v[2]).format("YYYY-MM-DD HH:mm")
              }
              if (v[3] && !isNaN(parseFloat(v[3]))) {
                obj.price = parseFloat(v[3])
              }
              return obj
            }).filter(v => v.value)
            this.element.props.options = this.element.props.options.concat(new_values);
            this.element.form.reload_form();
            this.element.form.reload_settings();
            $(".formcontrol-app-response-modal-bg, .formcontrol-app-response-modal").remove();
          }.bind(this));
        }.bind(this))
    );
  }

  // Swap index a and b
  this.swapArrayElements = function (arr, a, b) {
    var temp = arr[a];
    arr[a] = arr[b];
    arr[b] = temp;
  };

  // Zip into json
  this.zip = function () {
    var properties = {
      class: this.element.constructor.name,
      props: this.element.props
    }
    return properties;
  }

  this.generate_id = function () {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 20; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

}