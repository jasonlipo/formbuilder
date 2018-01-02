function FormPay($dom) {

  // Set up
  this.$dom = $dom;
  this.load = new FormLoad(this);
  this.validator = new FormValidator(this);
  this.props = {};
  this.editable = false;

  this.elements = [];
  this.payment_elements = [];

  // DOM elements
  this.$form = null;
  this.$body = null;
  this.$choose_elem_select = null;

  // Initialise
  this.init = function () {
    var $form = $("<div>", { class: "formbuilder-form" });
    this.$dom.html($form);
    this.$form = $form;
    this.load.do(function () {
      this.add_elements();
      this.print_form();
    }.bind(this));
  }

  this.add_elements = function () {
    var $title = $("<div>", { class: "formbuilder-title" }).html(this.props.name);
    var $desc = $("<div>", { class: "formbuilder-description" }).html(this.props.description);
    var $header = $("<div>", { class: "formbuilder-header" });
    var $body = $("<div>", { class: "formbuilder-body" });
    this.$form.html(
      $header.html($title).append($desc)
    ).append($body);
    this.$body = $body;

    // Add title
    var title = new FormElement_Title(this);
    title.props = { title: "Payment", description: "" };
    this.payment_elements.push(title);

    // Add credit card form
    var card_name = new FormElement_SingleLine(this);
    card_name.props = {
      label: "Name on Card",
      required: true,
      validation: { type: 4 }
    }

    var card_number = new FormElement_SingleLine(this);
    card_number.props = {
      label: "Card Number",
      required: true,
      validation: { type: 0 }
    }

    var cvv = new FormElement_SingleLine(this);
    cvv.props = {
      label: "CVV",
      required: true,
      validation: { type: 2, min: 0, max: 999 }
    }
    
    this.payment_elements.push(card_name, card_number, cvv);

    // Add nav buttons
    var submit = new FormElement_Buttons(this);
    submit.props.button1.value = this.props.prev;
    submit.props.button1.onclick = function () {
      this.form.pages.current--;
      this.form.init_page();
    }.bind(this);
    submit.props.button2.value = this.props.submit;
    submit.props.button2.onclick = this.submit.bind(this);
    this.payment_elements.push(submit);
  }

  // Prints all the payment elements
  this.print_form = function () {
    this.$body.html("");
    for (var i=0; i<this.payment_elements.length; i++) {
      this.payment_elements[i].super.setIndex(i);
      this.payment_elements[i].init(this.$body);
    }
  }

  this.submit = function () {

  }

}