function FormBuilder($dom) {

  // Set up
  this.dom = $dom;
  this.settings = new FormSettings(this);
  this.element_list = FormElementList.all();

  // Defaults
  this.name = "My Form";
  this.description = "A description of your form goes here";
  this.elements = [];
  this.form = null;

  // Initialise
  this.init = function () {
    var $title = $("<div>", { class: "formbuilder-title" }).html(this.name);
    var $desc = $("<div>", { class: "formbuilder-description" }).html(this.description);
    var $header = $("<div>", { class: "formbuilder-header" });
    var $form = $("<div>", { class: "formbuilder-form" });
    this.dom.append(
      $form.html(
        $header.append($title).append($desc)
      )
    );
    this.form = $form;
    this.choose_element();
    this.settings.init();
  }

  // Adds the new element chooser
  this.choose_element = function () {
    var $select = $("<select>", { class: "formbuilder-select" });
    for (var i=0; i<this.element_list.length; i++) {
      var this_el = this.element_list[i];
      var $option = $("<option>", { value: i }).html(this_el.title);
      $select.append($option);
    }
    var $newelem = $("<div>", { class: "formbuilder-element" })
                      .addClass("formbuilder-empty")
                      .append("Insert a new form element")
                      .append($select);
    this.form.append($newelem);
  }

}