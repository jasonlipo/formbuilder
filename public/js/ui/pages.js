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
      this.loading();
      this.upload_all_files();
    }
  }

  this.upload_all_files = function () {
    number_files = 0;
    for (var i=0; i<Object.keys(this.data).length; i++) {
      for (var j=0; j<this.data[i].length; j++) {
        if (this.data[i][j] instanceof FormElement_FileUpload) {
          number_files++;
          this.form.save.submission[this.data[i][j].props.id] = [];
          this.upload_file(i, j, 0);
        }
      }
    }

    if (number_files == 0) {
      this.post_data();
    }
  }

  this.upload_file = function (i, j, k) {
    var path = this.form.$dom.attr('formpath');
    var id = this.form.$dom.attr('formbuilder');

    if (k >= this.data[i][j].files.length) {
      this.form.save.submission[this.data[i][j].props.id] = this.form.save.submission[this.data[i][j].props.id].join(", ");
      number_files--;
      if (number_files == 0) {
        this.post_data();
      }
      return;
    }
    var file_to_upload = new FormData();
    file_to_upload.append(0, this.data[i][j].files[k]);
    $.ajax({
      url: path + "/" + id + "/upload",
      type: 'POST',
      data: file_to_upload,
      cache: false,
      processData: false,
      contentType: false,
      xhr: function() {
        return new window.XMLHttpRequest();
      },
      success: function (response, status, xhr) {
        if (status == "success") {
          this.form.save.submission[this.data[i][j].props.id].push(response);
          this.upload_file(i, j, k+1);
        }
      }.bind(this)
    });
  }

  this.post_data = function () {
    var path = this.form.$dom.attr('formpath');
    var id = this.form.$dom.attr('formbuilder');
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