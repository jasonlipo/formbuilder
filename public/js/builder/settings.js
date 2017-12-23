function FormSettings(builder) {
  this.builder = builder;

  // Initialise
  this.init = function () {
    var $title = $("<div>", { class: "formbuilder-settings-title" }).html("Settings");
    var $wrapper = $("<div>", { class: "formbuilder-wrapper" });
    var $settings = $("<div>", { class: "formbuilder-settings" });
    this.builder.$dom.append(
      $settings.html($wrapper.html($title))
    );
  }
}