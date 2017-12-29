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
        if (page_count > 0) {
          navigation.props.button1.value = top.props.prev;
          navigation.props.button1.onclick = this.prev_page.bind(this);
        }
        navigation.props.button2.value = top.props.next;
        navigation.props.button2.onclick = this.next_page.bind(this);
        this.data[page_count].push(navigation);
        page_count++;
        this.data[page_count] = [];
      }
      else {
        this.data[page_count].push(top);
      }
    }
    
    var submit = new FormElement_Buttons(this.form);
    submit.props.button1.value = this.form.props.submit;
    submit.props.button1.onclick = this.submit_form.bind(this);
    this.data[page_count].push(submit);
  }

  this.prev_page = function () {

  }

  this.next_page = function () {
    this.current++;
    this.form.init_page();
  }

  this.submit_form = function () {
    
  }

}