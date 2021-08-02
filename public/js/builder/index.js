var formbuilder;

function buildForms() {
  if (typeof FormSettings !== "function" || typeof FormSave !== "function" || typeof FormLoad !== "function" || 
      typeof FormStructure !== "function" || typeof FormPayment !== "function" || typeof FormElementList !== "object") {
    setTimeout(buildForms, 500);
  }
  else {
    formbuilder = new FormBuilder($('.formbuilder-app'));
    formbuilder.init();
  }
}

$(function () {
  buildForms();
});
