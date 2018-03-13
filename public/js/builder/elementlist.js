var FormElementList = {
  elements: [
    {
      title: "Single-line textbox",
      widget: FormElement_SingleLine
    },
    {
      title: "Multi-line textbox",
      widget: FormElement_MultiLine
    },
    {
      title: "Radio buttons",
      widget: FormElement_Radio
    },
    {
      title: "Checkboxes",
      widget: FormElement_Checkbox
    },
    {
      title: "Dropdown",
      widget: FormElement_Dropdown
    },
    {
      title: "Repeater",
      widget: FormElement_Repeater
    },
    {
      title: "Page break",
      widget: FormElement_PageBreak
    },
    {
      title: "Title",
      widget: FormElement_Title
    },
    {
      title: "File Upload",
      widget: FormElement_FileUpload
    }
  ],
  all: function () {
    return this.elements;
  }
}