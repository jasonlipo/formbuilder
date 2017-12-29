function FormPages(form) {

  this.form = form;
  this.current = 0;
  this.data = { 0: [] };

  this.separate = function () {
    var page_count = 0;
    while (this.form.elements.length > 0) {
      var top = this.form.elements.shift();
      if (top.constructor.name == "FormElement_PageBreak") {
        var navigation = new FormElement_Buttons(this.form);
        navigation.props.button1 = top.props.prev;
        navigation.props.button2 = top.props.next;
        this.data[page_count].push(navigation);
        page_count++;
        this.data[page_count] = [];
      }
      else {
        this.data[page_count].push(top);
      }
    }
    
    var submit = new FormElement_Buttons(this.form);
    submit.props.button1 = this.form.props.submit;
    this.data[page_count].push(submit);
  }

}