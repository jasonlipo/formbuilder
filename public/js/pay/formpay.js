function FormPay($dom) {

  // Set up
  this.$dom = $dom;
  this.load = new FormLoad(this);
  this.stripe = new FormStripe(this);
  this.props = {};
  this.editable = false;

  this.response = {};
  this.elements = [];
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
      this.stripe.init();
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

    this.$body.append('\
    <div class="formbuilder-element">\
      <div class="formbuilder-section-title">Payment Summary</div>\
      <div class="formbuilder-section-description formpay-summary"></div>\
    </div>');

    this.$body.append('\
    <form action="/charge" method="post" class="stripe-form">\
      <div class="formbuilder-element">\
        <label class="formbuilder-label">\
          Credit or debit card<span class="formbuilder-required">*</span>\
          <small>Card Number</small>\
        </label>\
        <div id="formpay-card-number"></div>\
        <div class="formbuilder-errors"></div>\
      </div>\
      <div class="formbuilder-element formbuilder-half">\
        <label class="formbuilder-label">\
          <small>Expiry Date <span class="formbuilder-required">*</span></small>\
        </label>\
        <label class="formbuilder-label">\
          <small>CVC <span class="formbuilder-required">*</span></small>\
        </label>\
        <div id="formpay-card-expiry"></div>\
        <div id="formpay-card-cvc"></div>\
        <div class="formbuilder-errors"></div>\
        <div class="formbuilder-errors"></div>\
      </div>\
      <div class="formbuilder-buttons">\
        <input type="submit" class="formbuilder-button formpay-submit" value="'+this.props.submit+'">\
      </div>\
    </form>');

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
    this.$body.find(".formpay-summary").html($summary[0].outerHTML);
  }
}