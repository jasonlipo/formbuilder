function FormPay($dom) {

  // Set up
  this.$dom = $dom;
  this.load = new FormLoad(this);
  this.validator = new FormValidator(this);
  this.props = {};
  this.editable = false;

  this.response = {};
  this.elements = [];
  this.payment_elements = [];
  this.prices = {};
  this.total = 0;

  // DOM elements
  this.$form = null;
  this.$body = null;
  this.$choose_elem_select = null;

  // Initialise
  this.init = function () {
    var $form = $("<div>", { class: "formbuilder-form" });
    this.$dom.html($form);
    this.$form = $form;
    this.load.response(function () {
      this.add_elements();
      this.find_all_prices(this.elements);
      this.prices_summary();
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
    title.props = { title: "Payment Summary", description: "" };
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
    submit.props.button1.value = this.props.submit;
    submit.props.button1.onclick = this.submit.bind(this);
    this.payment_elements.push(submit);
  }

  // Prints all the payment elements
  this.print_form = function () {
    this.$body.html("");
    for (var i=0; i<this.payment_elements.length; i++) {
      this.payment_elements[i].super.setIndex(i);
      this.payment_elements[i].init(this.$body);
    }
    this.pages = { data: [this.payment_elements] };
  }

  this.find_all_prices = function (parent) {
    $.each(parent, function (n, i) {
      if (i.props.children) {
        this.find_all_prices(i.props.children);
      }
      else {
        var regex = new RegExp('^' + i.props.id + '(_)?([0-9]*)');
        for (var key in this.response) {
          if (regex.test(key)) {
            var submitted_value = this.response[key];
            if (i.props.options) {
              for (var option in i.props.options) {
                if ((typeof submitted_value == "object" && $.inArray(i.props.options[option].value, submitted_value) > -1)
                  || (i.props.options[option].value == submitted_value)) {
                  if (i.props.options[option].price) {
                    var submitted_price = parseFloat(i.props.options[option].price);
                    this.store_price(i.props.options[option].value, submitted_price, 1);
                  }
                }
              }
            }
            else if (i.props.validation && i.props.validation.type == 2) {
              if (i.props.validation.price) {
                var submitted_value = parseInt(submitted_value);
                var submitted_price = parseFloat(i.props.validation.price) * submitted_value;
                this.store_price(i.props.label, submitted_price, submitted_value);
              }
            }
          }
        }
      }
    }.bind(this));
  }

  this.store_price = function (value, price, quantity) {
    if (!this.prices[value]) {
      this.prices[value] = { quantity: quantity, price: price };
    }
    else {
      this.prices[value].quantity += quantity;
      this.prices[value].price += price;
    }
  }

  this.prices_summary = function () {
    $summary = $("<div>", { class: "formbuilder-summary" });
    for (var x in this.prices) {
      $summary.append(
        $("<div>", { class: "formbuilder-summary-quantity" }).html(
          this.prices[x].quantity + " x " + x
        )
      );
      $summary.append(
        $("<div>", { class: "formbuilder-summary-price" }).html(
          "&pound;" + this.prices[x].price.toFixed(2)
        )
      );
      this.total += this.prices[x].price;
    }
    $summary.append(
      $("<div>", { class: "formbuilder-summary-quantity" }).html($("<b>").html("Total"))
    );
    $summary.append(
      $("<div>", { class: "formbuilder-summary-price" }).html($("<b>").html("&pound;" + this.total.toFixed(2)))
    );
    this.payment_elements[0].props.description = $summary[0].outerHTML;
  }

  this.submit = function () {
    this.validator.validate_page(0);
  }

}