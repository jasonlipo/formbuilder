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
    }
  ],
  all: function () {
    return this.elements;
  }
}