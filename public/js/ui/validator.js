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
    var $input = this.get_input(el);
    $input.removeClass('error');
    if (el.$elem.find(".formbuilder-errors").length == 0) {
      el.$elem.append($("<div>", { class: "formbuilder-errors" }));
    }
    el.$elem.find(".formbuilder-errors").text("");
    
    el_valid &= this.email(el);
    el_valid &= this.required(el);

    return el_valid;
  }

  this.get_input = function (el) {
    return el.$elem.find("input");
  }

  this.required = function (el) {
    if (el.props.required) {
      var empty = this.get_input(el).filter(function () {
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
      if (empty > 0) {
        return false;
      }
    }
    return true;
  }

  this.email = function (el) {
    if (el.props.validation && el.props.validation.type == 1) {
      if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.get_input(el).val())) {
        this.get_input(el).addClass('error');
        el.$elem.find(".formbuilder-errors").text("Please enter a valid email address.");
        return false;
      }
    }
    return true;
  }
}