function FormElement_Repeater(builder) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = {
    children: []
  };
  this.builder = builder;
  this.index = null;
  this.$elem = null;
  this.$repeater = null;
  
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
        var outer_index = $obj.index(".formbuilder-body .formbuilder-element");
        this.builder.elements.splice(outer_index, 0, removed_elements[0]);
        this.builder.reload_form();
      }.bind(this),
      stop: function (event, ui) {
        $obj = ui.item;
        if ($obj.parent(".formbuilder-repeater").length > 0) {
          var old_index = $obj.attr("formbuilder-index").split(".")[1];
          var removed_elements = this.props.children.splice(old_index, 1);
          var new_index = $obj.index(".formbuilder-repeater .formbuilder-element");
          this.props.children.splice(new_index, 0, removed_elements[0]);
          this.selected = null;
          this.builder.reload_form();
        }
      }.bind(this)
    });
  }

  // Element settings
  this.get_settings = function () {
    
  }

  // Zip into json
  this.zip = function () {
    return {
      class: this.constructor.name,
      props: {
        children: this.props.children.map(function (i) {
          return i.zip();
        })
      }
    };
  }

}