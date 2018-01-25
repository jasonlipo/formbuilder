$(function () {
  $('.metric-button').click(function () {
    var metric_data = { data: {
      name: $('.metric-name').val(),
      type: $('.metric-type').val(),
      column: $('.metric-column').val(),
      matches: $('.metric-matches').val()
    }};
    var path = $('.formcontrol-app').attr('formpath');
    var id = $('.formcontrol-app').attr('formbuilder');
    $.post(path + "/" + id + "/metric", metric_data, function () {
      location.reload();
    });
  });
});