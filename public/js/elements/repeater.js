function FormElement_Repeater(form) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = {
    children: [],
    type: 0,
    limit: 10,
    add_button: "Add"
  };
  this.form = form;
  this.index = null;
  this.$elem = null;
  this.$repeater = null;
  this.number_repetitions = 0;
  this.trigger_repetitions = [];

  this.repeater_options = {
    0: "User adds as many as they like",
    1: "Controlled by another element",
  };
  
  // Create a single-line text box
  this.init = function ($container) {
    if (this.form.editable) {
      var $label = $("<div>", { class: "formbuilder-repeater-label" }).html("Repeater");
      var $repeater = $("<div>", { class: "formbuilder-repeater formbuilder-sort-container" });
      var $newelem = $("<div>", { class: "formbuilder-element" })
                          .toggleClass("formbuilder-selectable", this.form.editable)
                          .append($label)
                          .append($repeater)
                          .attr("formbuilder-index", this.index);
  
      $container.append($newelem);
      this.$elem = $newelem;
      this.$repeater = $repeater;

      this.super.onclick();
      this.super.is_selected();

      for (var i=0; i<this.props.children.length; i++) {
        this.props.children[i].super.setIndex(this.index + "." + i);
        this.props.children[i].init(this.$repeater);
      }

      this.$repeater.sortable({
        cancel: null,
        items: "> .formbuilder-selectable",
        placeholder: "formbuilder-placeholder",
        forcePlaceholderSize: true,
        connectWith: ".formbuilder-sort-container",
        remove: function (event, ui) {
          $obj = ui.item;
          // Moving an element out of a repeater
          var old_index = $obj.attr("formbuilder-index").split(".")[1];
          var removed_elements = this.props.children.splice(old_index, 1);
          var outer_index = $obj.index(".formbuilder-body > .formbuilder-element");
          this.form.elements.splice(outer_index, 0, removed_elements[0]);
          this.form.reload_form();
        }.bind(this),
        stop: function (event, ui) {
          $obj = ui.item;
          if ($obj.parent(".formbuilder-repeater").length > 0) {
            var old_index = $obj.attr("formbuilder-index").split(".")[1];
            var removed_elements = this.props.children.splice(old_index, 1);
            var new_index = $obj.index(".formbuilder-repeater > .formbuilder-element");
            this.props.children.splice(new_index, 0, removed_elements[0]);
            this.selected = null;
            this.form.reload_form();
          }
        }.bind(this)
      });
    }
    else {
      if (this.props.type == 0) {
        if (this.number_repetitions == this.props.limit) {
          var $newelem = $("<div>", { class: "formbuilder-repeat-container" }).attr("formbuilder-index", this.index)
            .append("You have reached the maximum of <b>"+this.props.limit+"</b> additions.");
          this.$elem = $newelem;
          $container.append($newelem);
        }
        else {
          var $button = $("<input>", { type: "button", class: "formbuilder-button" }).val(this.props.add_button);
          var $newelem = $("<div>", { class: "formbuilder-repeat-container" }).append($button).attr("formbuilder-index", this.index);
          this.$elem = $newelem;
          $container.append($newelem);
          $button.click(function () {
            this.form.save.page_submission(this.form.pages.current);
            for (var i=0; i<this.props.children.length; i++) {
              var new_element = new (window[this.props.children[i].constructor.name])(this.form);
              new_element.props = Object.assign({}, this.props.children[i].props);
              new_element.props.id = new_element.props.id + "_" + this.number_repetitions.toString();
              this.form.pages.data[this.form.pages.current].splice(this.index, 0, new_element);
              this.form.init_page();
            }
            this.number_repetitions += 1;
            this.form.init_page();
          }.bind(this));
        }
      }
      else {
        this.$elem = $();
        var trigger = this.form.pages.data[this.form.pages.current].filter(function (i) {
          return i.props.id == this.props.trigger;
        }.bind(this))[0];
        trigger.$elem.on("keyup", function (el) {
          if (this.form.validator.validate_element(el)) {
            var elem_value = el.super.get_input().val();
            this.form.save.page_submission(this.form.pages.current);
            if (parseInt(elem_value) < this.number_repetitions) {
              // Tidy up repeats, remove some
              var to_remove = this.number_repetitions - parseInt(elem_value);
              for (var k=0; k<to_remove; k++) {
                for (var j=0; j<this.props.children.length; j++) {
                  var remove_id = this.trigger_repetitions.pop();
                  var remove_position = -1;
                  $.each(this.form.pages.data[this.form.pages.current], function (n, i) {
                    if (i.props.id == remove_id) {
                      remove_position = n;
                      delete this.form.save.submission[remove_id];
                      if (i.props.validation && (i.props.validation.type == 4 || i.props.validation.type == 5)) {
                        for (var m=0; m<i.super.get_input().length; m++) {
                          delete this.form.save.submission[remove_id + "_" + m];
                        }
                      }
                    }
                  }.bind(this));
                  this.form.pages.data[this.form.pages.current].splice(remove_position, 1);
                  this.form.init_page();
                }
                this.number_repetitions -= 1;
                this.form.init_page();
              }
            }
            else {
              // Add more repetitions
              var to_add = parseInt(elem_value) - this.number_repetitions;
              for (var k=0; k<to_add; k++) {
                for (var i=0; i<this.props.children.length; i++) {
                  var new_element = new (window[this.props.children[i].constructor.name])(this.form);
                  new_element.props = Object.assign({}, this.props.children[i].props);
                  new_element.props.id = new_element.props.id + "_" + this.number_repetitions.toString();
                  this.trigger_repetitions.push(new_element.props.id);
                  this.form.pages.data[this.form.pages.current].splice(this.index, 0, new_element);
                  this.form.init_page();
                }
                this.number_repetitions += 1;
                this.form.init_page();
              }
            }
          }
        }.bind(this, trigger));
      }
    }
  }

  // Element settings
  this.get_settings = function () {
    var $settings_block = $("<div>", { class: "formbuilder-settings-block" });
    var $settings_input = $("<select>", { class: "formbuilder-settings-input" });
    var $settings_label = $("<label>", { class: "formbuilder-label" });

    $settings_label.html("Type").appendTo($settings_block);

    for (i in this.repeater_options) {
      var $option = $("<option>", { value: i }).html(this.repeater_options[i]);
      if (this.props.type && this.props.type == i) {
        $option.attr("selected", true);
      }
      $settings_input.append($option);
    }

    $settings_input.appendTo($settings_block);
    this.form.settings.$field_properties.append($settings_block);

    // Limit repeating
    if (this.props.type == 0) {
      var $limit_block = $("<div>", { class: "formbuilder-settings-block" });
      var $limit_label = $("<label>", { class: "formbuilder-label" });
      var $limit_input = $("<input>", { type: "text", class: "formbuilder-settings-input" });
      $limit_block
        .append($limit_label.html("Maximum number of repetitions"))
        .append(
          $limit_input.val(this.props.limit).keyup(function ($el) {
            this.props.limit = $el.val();
            this.form.reload_form();
          }.bind(this, $limit_input))
        )
        .appendTo(this.form.settings.$field_properties);
    }
    
    // Trigger repeating
    if (this.props.type == 1) {
      var prev_elements = this.form.elements.slice(0, this.index).filter(function (i) {
        return i.props.validation && i.props.validation.type == 2;
      });
      var $trigger_block = $("<div>", { class: "formbuilder-settings-block" });
      var $trigger_label = $("<label>", { class: "formbuilder-label" });
      var $trigger_input = $("<select>", { class: "formbuilder-settings-input" });
      for (var i=0; i<prev_elements.length; i++) {
        if (prev_elements[i].props.label) {
          $option = $("<option>", { value: prev_elements[i].props.id }).html(prev_elements[i].props.label);
          if (this.props.trigger === $option.val()) {
            $option.attr("selected", true);
          }
          $trigger_input.append($option);
        }
      }
      $trigger_block
        .append($trigger_label.html("Fix number of repetitions"))
        .append(
          $trigger_input.change(function ($el) {
            this.props.trigger = $el.val();
            this.form.reload_form();
          }.bind(this, $trigger_input))
        )
        .appendTo(this.form.settings.$field_properties);
    }

    $settings_input.change(function ($el) {
      this.props.type = parseInt($el.val());
      this.form.reload_form();
      this.form.reload_settings();
    }.bind(this, $settings_input));

    this.super.add_setting("&quot;Add More&quot; label", "add_button");
    this.super.setting_delete();
  }

  // Zip into json
  this.zip = function () {
    return {
      class: this.constructor.name,
      props: $.extend({}, this.props, {
        children: this.props.children.map(function (i) {
          return i.zip();
        })
      })
    };
  }

}