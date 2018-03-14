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
          navigation.props.button1.value = this.form.props.prev;
          navigation.props.button1.onclick = this.prev_page.bind(this);
        }
        navigation.props.button2.value = this.form.props.next;
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
    if (page_count > 0) {
      submit.props.button1.value = this.form.props.prev;
      submit.props.button1.onclick = this.prev_page.bind(this);
    }
    submit.props.button2.value = this.form.props.submit;
    submit.props.button2.onclick = this.submit_form.bind(this);
    this.data[page_count].push(submit);
  }

  this.prev_page = function () {
    this.form.save.page_submission(this.current);
    this.current--;
    this.form.init_page();
  }

  this.next_page = function () {
    if (this.form.validate()) {
      this.form.save.page_submission(this.current);
      this.current++;
      this.form.init_page();
    }
  }

  this.loading = function () {
    if (this.form.$form.find(".formpay-loading").length > 0) {
      this.form.$form.find(".formpay-loading, .formpay-spinner").remove();
    }
    else {
      this.form.$form.append($("<div>", { class: "formpay-loading" }))
                .append($("<i>", { class: "fas fa-circle-notch fa-spin formpay-spinner" }));
    }
  }

  this.submit_form = function () {
    if (this.form.validate()) {
      this.form.save.page_submission(this.current);
      var id = this.form.$dom.attr('formbuilder');
      this.loading();
      this.upload_all_files();
    }
  }

  this.upload_all_files = function (callback) {
    var path = this.form.$dom.attr('formpath');

    var number_files = 0;
    for (var i=0; i<this.data.length; i++) {
      for (var j=0; j<this.data[i].length; j++) {
        if (this.data[i][j] instanceof FormElement_FileUpload) {
          number_files++;
          this.form.save.submission[this.data[i][j].props.id] = [];
          this.upload_file(i, j, 0, callback);
        }
      }
    }

    if (number_files == 0) {
      this.post_data();
    }
  }

  this.upload_file = function (i, j, k, callback) {
    if (k >= this.data[i][j].files.length) {
      number_files--;
      if (number_files == 0) {
        this.post_data();
      }
      return;
    }
    var file_to_upload = new FormData();
    data.append(0, this.data[i][j].files[k]);
    $.ajax({
      url: path + "/" + id + "/upload",
      type: 'POST',
      data: file_to_upload,
      cache: false,
      processData: false,
      contentType: false,
      success: function (response, status, xhr) {
        if (status == "success") {
          this.form.save.submission[this.data[i][j].props.id].push(response);
          this.upload_file(i, j, k+1, callback);
        }
      }
    });
  }

  this.post_data = function () {
    var path = this.form.$dom.attr('formpath');
    $.post(path + "/" + id + "/submit", { json: this.form.save.json() }, function (result) {
      if (this.form.props.payment) {
        var pay_url = this.form.$dom.attr('formpay');
        location.href = pay_url + "?id=" + id + "&key=" + result;
      }
      else {
        location.href = this.form.props.redirect;
      }
    }.bind(this));
  }

}