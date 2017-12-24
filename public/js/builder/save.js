function FormSave(builder) {
  
  // DOM elements
  this.builder = builder;
  this.$dom = null;
  
  // Initialise
  this.init = function () {
    var $save  = $("<div>", { class: "formbuilder-save" });
    this.builder.$dom.prepend(
      $save
        .append("<b>Congrats! </b>")
        .append("Your form is up-to-date!")
    );
    this.$dom = $save;
  }

}