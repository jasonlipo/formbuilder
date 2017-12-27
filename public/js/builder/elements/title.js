function FormElement_Title(builder) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = {
    title: "Section",
    description: "A description of this section"
  };
  this.builder = builder;
  this.index = null;
  this.$elem = null;
  
  // Create a single-line text box
  this.init = function ($container) {
    var $title = $("<div>", { class: "formbuilder-section-title" }).html(this.props.title);;
    var $description = $("<div>", { class: "formbuilder-section-description" }).html(this.props.description);;
    var $newelem = $("<div>", { class: "formbuilder-element formbuilder-selectable" })
                        .append($title)
                        .append($description)
                        .attr("formbuilder-index", this.index);

    $container.append($newelem);
    this.$elem = $newelem;
    this.super.onclick();
    this.super.is_selected();
  }

  // Element settings
  this.get_settings = function () {
    this.super.setting_section("General");
    this.super.add_setting("Title", "title");
    this.super.add_setting("Descriptions", "description");
    this.super.setting_delete();
  }

  // Zip into json
  this.zip = function () {
    return this.super.zip();
  }

}