function FormPayment(form) {

  this.form = form;
  this.$elem = null;
  this.prices = {};

  this.init = function () {
    this.$elem = $("<div>", { class: "formbuilder-payment" }).html("Price: &pound;0.00");
    this.form.$body.append(this.$elem);
    this.update();
  }

  this.update = function () {
    this.$elem.html("Price: &pound;" + this.total().toFixed(2));
  }

  this.total = function () {
    var running_total = 0;
    for (key in this.prices) {
      running_total += this.prices[key].price
    }
    return running_total;
  }

  this.check_payment = function (element) {
    delete this.prices[element.props.id];
    if (element.props.validation && element.props.validation.price) {
      if (element.super.get_input().val()) {
        this.prices[element.props.id] = {
          quantity: parseInt(element.super.get_input().val()),
          price: parseInt(element.super.get_input().val()) * element.props.validation.price
        };
      }
    }
    else if (element.props.options) {
      if (element.constructor.name == "FormElement_Dropdown") {
        var selected_option = element.props.options[element.$elem.find("option[value]").index(element.$elem.find(":checked"))];
        if (selected_option && selected_option.price) {
          this.prices[element.props.id] = {
            quantity: 1,
            price: parseInt(selected_option.price)
          };
        }
      }
      else if (element.constructor.name == "FormElement_Radio") {
        var selected_option = element.props.options[element.super.get_input().index(element.$elem.find(":checked"))];
        if (selected_option.price) {
          this.prices[element.props.id] = {
            quantity: 1,
            price: parseInt(selected_option.price)
          };
        }
      }
      else if (element.constructor.name == "FormElement_Checkbox") {
        this.prices[element.props.id] = { quantity:0, price:0 };
        $.each(element.$elem.find(":checked"), function (n,i) {
          var selected_option = element.props.options[element.super.get_input().index(i)];
          if (selected_option.price) {
            this.prices[element.props.id].quantity += 1;
            this.prices[element.props.id].price += parseInt(selected_option.price);
          }
        }.bind(this));
        if (this.prices[element.props.id].quantity == 0) {
          delete this.prices[element.props.id];
        }
      }
    }
    this.update();
  }

}