function FormSave(builder) {
  
  // DOM elements
  this.$dom = null;

  // Properties
  this.builder = builder;
  this.timeout = null;

  // Initialise
  this.init = function () {
    var $save  = $("<div>", { class: "formbuilder-save" });
    this.$dom = $save;
    this.success();
    this.builder.$dom.prepend($save);
  }

  // Save form
  this.save = function () {
    clearTimeout(this.timeout);
    this.waiting();
    // DO SAVING
    this.timeout = setTimeout(function () {
      this.success();
    }.bind(this), 300);
  }

  // Waiting text
  this.waiting = function () {
    this.$dom.html("Saving in progress... please don't exit the page");
  }

  // Success text
  this.success = function () {
    this.$dom
      .html("<b>Congrats! </b>")
      .append("Your form is up-to-date!")
  }

}