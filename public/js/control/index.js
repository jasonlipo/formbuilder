$(function () {
  refreshEvent();

  $(window).click(function () {
    $(".formcontrol-entry-delete-confirm").before(
      $("<i>", { class: "formcontrol-entry-delete fas fa-times" })
    ).remove();
    refreshEvent();
  });
});

function refreshEvent() {
  $(".formcontrol-entry-delete").unbind("click");
  $(".formcontrol-entry-delete").off("click");
  $(".formcontrol-entry-delete").click(function (event) {
    event.stopPropagation();
    var form_id = $(this).parents(".formcontrol-entry").attr("data-form");
    $(this).before(
      $("<a>", { class: "formbuilder-button formbuilder-delete formcontrol-entry-delete-confirm" })
        .text("Confirm Delete")
        .click(function (event) {
          event.stopPropagation();
          var path = $('.formcontrol-app').attr('formpath');
          $.post(path + "/" + form_id + "/delete", function (result) {
            location.reload();
          });
        })
    ).remove();
  });
}