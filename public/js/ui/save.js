function FormSave(form) {

  this.form = form;
  this.submission = {};
  
  this.page_submission = function (page) {
    $.each(this.form.pages.data[page], function (n, i) {
      if (i.props.id) {
        if (i.constructor.name == "FormElement_Radio") {
          this.submission[i.props.id] = i.$elem.find(":checked").next(".formbuilder-radio-label").text();
        }
        else if (i.constructor.name == "FormElement_Checkbox") {
          this.submission[i.props.id] = i.$elem.find(":checked").next(".formbuilder-checkbox-label").map(function () { return $(this).text(); }).toArray();
        }
        else if (i.props.validation && (i.props.validation.type == 4 || i.props.validation.type == 5)) {
          for (var j=0; j<i.super.get_input().length; j++) {
            this.submission[i.props.id + "_" + j] = i.super.get_input().eq(j).val();
          }
        }
        else {
          this.submission[i.props.id] = i.super.get_input().val();
        }
      }
    }.bind(this));
  }

  this.fill_page = function (page) {
    $.each(this.form.pages.data[page], function (n, i) {
      if (i.props.id) {
        if (i.props.validation && (i.props.validation.type == 4 || i.props.validation.type == 5)) {
          for (var j=0; j<i.super.get_input().length; j++) {
            i.super.get_input().eq(j).val(this.submission[i.props.id + "_" + j]);
          }
        }
        else {
          i.super.get_input().val(this.submission[i.props.id]);
        }
        
      }
    }.bind(this));
  }

}