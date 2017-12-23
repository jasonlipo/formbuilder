function FormElement(element) {
  this.element = element;

  this.onclick = function () {
    this.element.$elem.click(function () {
      if (this.element.builder.selected == this.element.index) {
        this.element.builder.selected = null;
      }
      else {
        this.element.builder.selected = this.element.index;
      }
      this.element.builder.init();
    }.bind(this));
  }

  this.select = function () {
    if (this.element.builder.selected == this.element.index) {
      this.element.$elem.addClass("selected");
    }
  }
}