function FormElement_FileUpload(form) {
  
  // Properties
  this.super = new FormElement(this);
  this.props = $.extend({}, this.super.props, {
    id: this.super.generate_id(),
    types: ""
  });
  this.files = [];
  this.form = form;
  this.index = null;
  this.$elem = null;
  
  // Create a single-line text box
  this.init = function ($container) {
    var $newelem = $("<div>", { class: "formbuilder-element" })
                        .append(this.super.print_label())
                        .toggleClass("formbuilder-selectable", this.form.editable)
                        .attr("formbuilder-index", this.index);

    if (this.files.length == 0) {
      var $input = $("<input>", { type: "file", class: "formbuilder-file", disabled: this.form.editable });
      $newelem.append($input);
    }
    else {
      $files_display = $("<div>", { class: "formbuilder-file-contents" });
      for (var i=0; i<this.files.length; i++) {
        $files_display.append(
          $("<div>", { class: "formbuilder-file-item" }).append(
            $("<i>", { class: "formbuilder-file-delete fas fa-times" })
          ).append(this.files[i].name));
      }
      $newelem.append($files_display);
    }

    $container.append($newelem);
    this.$elem = $newelem;
    if (this.form.editable) {
      this.super.onclick();
      this.super.is_selected();
    }
    else {
      this.on_upload();
    }
  }

  // Element settings
  this.get_settings = function () {
    this.super.regular_settings();

    var $type_block = $("<div>", { class: "formbuilder-settings-block" });
    var $type_label = $("<label>", { class: "formbuilder-label" });
    var types = {
      ".jpg,.jpeg,.png,.gif": "Images (.jpg, .png, .jpeg, .gif)",
      ".pdf": "PDF Document (.pdf)",
      ".doc,.docx,.xls,.xlsx": "Microsoft Office (.doc, .xls)",
      ".mp3,.ogg,.wav": "Recordings (.mp3, .ogg, .wav)",
      ".mp4,.avi,.mkv,.mpeg": "Videos (.mp4, .avi, .mkv, .mpeg)"
    }
    $type_block.append($type_label.html("Allowed file formats"))
    for (t in types) {
      $type_block.append("<br />")
                 .append(
                  $("<input>", { name: this.props.id + "_ff[]", type: "checkbox", value: t, checked: (this.props.types.indexOf(t) > -1) }).change(function () {
                    this.props.types = $("input[name='"+ this.props.id + "_ff[]']:checked").map(function () { return $(this).val(); }).toArray().join(",");
                    this.form.reload_form();
                  }.bind(this)))
                 .append($("<label>").css("margin-left", "8px").html(types[t]))
    }
    $type_block.appendTo(this.form.settings.$field_properties);

    this.super.setting_delete();
  }

  // Zip into json
  this.zip = function () {
    return this.super.zip();
  }

  this.on_upload = function () {
    $input = this.$elem.find('input[type="file"]');
    $input.change(function ($el) {
      this.files.push($el[0].files[0]);
      this.form.save.page_submission(this.form.pages.current);
      this.form.init_page();
    }.bind(this, $input));
  }

}