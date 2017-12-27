function FormElement_PageBreak(builder) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = {
    next: "Next",
    prev: "Back"
  };
  this.builder = builder;
  this.index = null;
  this.$elem = null;
  
  // Create a single-line text box
  this.init = function ($container) {
    var $break = $("<div>", { class: "formbuilder-break" });
    var $label = $("<div>", { class: "formbuilder-break-label" }).html("Page Break");
    var $newelem = $("<div>", { class: "formbuilder-element formbuilder-selectable" })
                        .append($break)
                        .append($label)
                        .attr("formbuilder-index", this.index);

    $container.append($newelem);
    this.$elem = $newelem;
    this.super.onclick();
    this.super.is_selected();
  }

  // Element settings
  this.get_settings = function () {
    this.super.setting_delete();
  }

  // Zip into json
  this.zip = function () {
    return this.super.zip();
  }

}