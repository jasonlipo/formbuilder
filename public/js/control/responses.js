$(function () {
  $('.metric-button').click(function () {
    var path = location.pathname.split("/").slice(0, 3).join("/");
    var metric_data = { data: {
      name: $('.metric-name').val(),
      type: $('.metric-type').val(),
      column: $('.metric-column').val(),
      matches: $('.metric-matches').val()
    }};
    $.post(path + "/metric", metric_data, function () {
      location.reload();
    });
  });
});