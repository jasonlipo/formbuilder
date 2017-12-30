function FormSave(form) {

  this.form = form;
  this.submission = {};
  
  this.page_submission = function (page) {
    $.each(this.form.pages.data[page], function (n, i) {
      if (i.props.id) {
        if (i.props.validation && i.props.validation.type == 4) {
          this.submission[i.props.id + "_0"] = i.$elem.find("input").eq(0).val();
          this.submission[i.props.id + "_1"] = i.$elem.find("input").eq(1).val();
        }
        else {
          this.submission[i.props.id] = i.$elem.find("input").val();
        }
      }
    }.bind(this));
  }

  this.fill_page = function (page) {
    $.each(this.form.pages.data[page], function (n, i) {
      if (i.props.id) {
        if (i.props.validation && i.props.validation.type == 4) {
          i.$elem.find("input").eq(0).val(this.submission[i.props.id + "_0"]);
          i.$elem.find("input").eq(1).val(this.submission[i.props.id + "_1"]);
        }
        else {
          i.$elem.find("input").val(this.submission[i.props.id]);
        }
        
      }
    }.bind(this));
  }

}