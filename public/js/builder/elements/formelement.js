function FormElement(element) {
  this.element = element;

  // When clicking a generic form element
  this.onclick = function () {
    this.element.$elem.click(function () {
      if (this.element.builder.selected == this.element.index) {
        this.element.builder.selected = null;
      }
      else {
        this.element.builder.selected = this.element.index;
      }
      this.element.builder.reload_form();
      this.element.builder.reload_settings();
    }.bind(this));
  }

  // Wheb selecting an element
  this.select = function () {
    if (this.element.builder.selected == this.element.index) {
      this.element.$elem.addClass("selected");
    }
  }

  // Setting the index property
  this.setIndex = function(i) {
    this.element.index = i;
  }
}