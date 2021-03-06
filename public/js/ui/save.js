function FormSave(form) {

  this.form = form;
  this.submission = {};
  
  this.page_submission = function (page) {
    $.each(this.form.pages.data[page], function (n, i) {
      if (i.props.id) {
        if (i.constructor.name == "FormElement_Radio") {
          this.submission[i.props.id] = i.$elem.find(":checked").val();
        }
        else if (i.constructor.name == "FormElement_Checkbox") {
          this.submission[i.props.id] = i.$elem.find(":checked").map(function (n,i) { return i.value; }).toArray();
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
        if (i.constructor.name == "FormElement_Radio") {
          if (this.submission[i.props.id]) {
            i.$elem.find('[value="'+this.submission[i.props.id]+'"]').prop("checked", true);
          }
        }
        else if (i.constructor.name == "FormElement_Checkbox") {
          if (this.submission[i.props.id]) {
            for (var j=0; j<this.submission[i.props.id].length; j++) {
              i.$elem.find('[value="'+this.submission[i.props.id][j]+'"]').prop("checked", true);
            }
          }
        }
        else if (i.props.validation && (i.props.validation.type == 4 || i.props.validation.type == 5)) {
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

  this.json = function () {
    return JSON.stringify(
      $.extend({}, this.submission, {
        "total_price": this.form.payment.total(),
        "payment_status": "unpaid"
      })
    );
  }

}