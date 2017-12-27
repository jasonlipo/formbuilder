function FormElement_Repeater(builder) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = {
    children: [],
    type: 0,
    limit: 10
  };
  this.builder = builder;
  this.index = null;
  this.$elem = null;
  this.$repeater = null;

  this.repeater_options = {
    0: "User adds as many as they like",
    1: "Controlled by another element",
  };
  
  // Create a single-line text box
  this.init = function ($container) {
    var $label = $("<div>", { class: "formbuilder-repeater-label" }).html("Repeater");
    var $repeater = $("<div>", { class: "formbuilder-repeater formbuilder-sort-container" });
    var $newelem = $("<div>", { class: "formbuilder-element formbuilder-selectable" })
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
        this.builder.elements.splice(outer_index, 0, removed_elements[0]);
        this.builder.reload_form();
      }.bind(this),
      stop: function (event, ui) {
        $obj = ui.item;
        if ($obj.parent(".formbuilder-repeater").length > 0) {
          var old_index = $obj.attr("formbuilder-index").split(".")[1];
          var removed_elements = this.props.children.splice(old_index, 1);
          var new_index = $obj.index(".formbuilder-repeater > .formbuilder-element");
          this.props.children.splice(new_index, 0, removed_elements[0]);
          this.selected = null;
          this.builder.reload_form();
        }
      }.bind(this)
    });
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
    this.builder.settings.$field_properties.append($settings_block);

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
            this.builder.reload_form();
          }.bind(this, $limit_input))
        )
        .appendTo(this.builder.settings.$field_properties);
    }
    
    // Trigger repeating
    if (this.props.type == 1) {
      var prev_elements = this.builder.elements.slice(0, this.index);
      var $trigger_block = $("<div>", { class: "formbuilder-settings-block" });
      var $trigger_label = $("<label>", { class: "formbuilder-label" });
      var $trigger_input = $("<select>", { class: "formbuilder-settings-input" });
      for (var i=0; i<prev_elements.length; i++) {
        $option = $("<option>", { value: prev_elements[i].index }).html(prev_elements[i].props.label);
        if (this.props.trigger === $option.val()) {
          $option.attr("selected", true);
        }
        $trigger_input.append($option);
      }
      $trigger_block
        .append($trigger_label.html("Fix number of repetitions"))
        .append(
          $trigger_input.change(function ($el) {
            this.props.trigger = $el.val();
            this.builder.reload_form();
          }.bind(this, $trigger_input))
        )
        .appendTo(this.builder.settings.$field_properties);
    }

    $settings_input.change(function ($el) {
      this.props.type = parseInt($el.val());
      this.builder.reload_form();
      this.builder.reload_settings();
    }.bind(this, $settings_input));

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