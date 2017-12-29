function FormSave(builder) {
  
  // DOM elements
  this.$dom = null;

  // Properties
  this.builder = builder;
  this.timeout = null;

  // Initialise
  this.init = function () {
    var $save  = $("<div>", { class: "formbuilder-save" });
    $("<a>", { class: "formbuilder-button", href: "/" }).html("Back").appendTo($save);
    this.$dom = $("<span>").appendTo($save);
    this.loading();
    this.builder.$dom.prepend($save);
  }

  // Save form
  this.save = function () {
    clearTimeout(this.timeout);
    this.waiting();
    var path = location.pathname.split("/");
    path.splice(-1);
    $.post(path.join("/") + "/structure", { json: this.builder.structure.json() }, function (result) {
      this.success();
    }.bind(this));
  }

  // Waiting text
  this.waiting = function () {
    this.$dom.html("Saving in progress... please don't exit the page");
  }

  // Loading text
  this.loading = function () {
    this.$dom.html("Loading form... please don't exit the page");
  }

  // Success text
  this.success = function () {
    this.$dom
      .html("<b>Up-to-date! </b>")
      .append("Changes are saved automatically.")
  }

}