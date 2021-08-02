var formui;

function showForms() {
  if (typeof FormLoad !== "function" || typeof FormPages !== "function" || typeof FormValidator !== "function" || 
      typeof FormSave !== "function" || typeof FormPayment !== "function") {
    setTimeout(showForms, 500);
  }
  else {
    formui = new FormUI($('.formui-app'));
    formui.init();
  }
}

$(function () {
  showForms();
});
