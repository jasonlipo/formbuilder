function FormValidator(form) {
  this.form = form;
  this.is_valid = true;

  this.validate_page = function (page) {
    this.is_valid = true;
    $.each(this.form.pages.data[page], function (n, i) {
      this.is_valid &= this.validate_element(i);
    }.bind(this));
    return this.is_valid; 
  }

  this.validate_element = function (el) {
    var el_valid = true;
    var $input = el.super.get_input();
    $input.removeClass('error');
    if (el.$elem.find(".formbuilder-errors").length == 0) {
      el.$elem.append($("<div>", { class: "formbuilder-errors" }));
    }
    el.$elem.find(".formbuilder-errors").text("");
    
    el_valid &= this.email(el);
    el_valid &= this.required(el);

    return el_valid;
  }

  this.required = function (el) {
    if (el.props.required) {
      var empty;
      if (el.constructor.name == "FormElement_Radio" || el.constructor.name == "FormElement_Checkbox") {
        empty = (el.$elem.find(":checked").length > 0) ? 0 : 1;
        if (empty > 0) {
          el.$elem.find(".formbuilder-errors").text("This field is required.");
        }
      }
      else {
        empty = el.super.get_input().filter(function () {
          if ($(this).val() == "") {
            $(this).addClass('error');
            if (el.props.validation && el.props.validation.type == 4) {
              el.$elem.find(".formbuilder-errors").text("First and Last Name are both required.");
            }
            else {
              el.$elem.find(".formbuilder-errors").text("This field is required.");
            }
            return true;
          }
          return false;
        }).length;
      }
      if (empty > 0) {
        return false;
      }
    }
    return true;
  }

  this.email = function (el) {
    if (el.props.validation && el.props.validation.type == 1) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(el.super.get_input().val())) {
        el.super.get_input().addClass('error');
        el.$elem.find(".formbuilder-errors").text("Please enter a valid email address.");
        return false;
      }
    }
    return true;
  }
}