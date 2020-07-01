var table, fieldEl, typeEl, valueEl;

$(function () {
  $('.formcontrol-responses td').filter(function () {
    return $(this).find('br').length > 0
  }).each(function() {
    var values = $(this).html().split("<br>")
    var index = $(this).parent('tr').find('td').index($(this))
    var new_rows = []
    for (var i=0; i<values.length; i++) {
      var cloned_row = $(this).parent('tr').clone()
      cloned_row.find('td').eq(index).html(values[i])
      new_rows.push(cloned_row)
    }
    $(this).parent('tr').after(new_rows)
    $(this).parent('tr').remove()
  });

  var columns = $(".formcontrol-responses th").map(function() { return $(this).html(); }).toArray();
  table = new Tabulator(".formcontrol-responses", {
    layout: "fitColumns",
    columns: columns.map(c => ({ bottomCalc: c == "Response" ? countDistinct : null, title: c, field: c, headerFilter: "select", headerFilterParams:{values:true} })),
    pagination:"local",
    paginationSize: 50,
    paginationSizeSelector:[25, 50, 100, 200],
  });
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

function countDistinct(values){
  return _.uniq(values).length;
}

function download_pdf() {
  table.download("pdf", "KinlossForm.pdf", {
    orientation:"landscape",
    title:"Responses",
  });
}

function download_excel() {
  table.download("xlsx", "KinlossForm.xlsx", { sheetName: "Responses"})
}


function deleteMetric(i) {
  var path = $('.formcontrol-app').attr('formpath');
  var id = $('.formcontrol-app').attr('formbuilder');
  $.post(path + "/" + id + "/metric/" + i + "/remove", function () {
    location.reload();
  });
}