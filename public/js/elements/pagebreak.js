function FormElement_PageBreak(form) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = {
    next: "Next",
    prev: "Back"
  };
  this.form = form;
  this.index = null;
  this.$elem = null;
  
  // Create a single-line text box
  this.init = function ($container) {
    var $break = $("<div>", { class: "formbuilder-break" });
    var $label = $("<div>", { class: "formbuilder-break-label" }).html("Page Break");
    var $newelem = $("<div>", { class: "formbuilder-element" })
                        .toggleClass("formbuilder-selectable", this.form.editable)
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
    this.super.setting_section("Buttons");
    this.super.add_setting("Next text", "next");
    this.super.add_setting("Previous text", "prev");
    this.super.setting_delete();
  }

  // Zip into json
  this.zip = function () {
    return this.super.zip();
  }

}