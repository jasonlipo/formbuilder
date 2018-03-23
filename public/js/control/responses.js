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
  $('.csv-button').click(function () {
    var html = $('.formcontrol-responses')[0].outerHTML;
    export_table_to_csv(html, $('.form_title').val()+"_"+(new Date()).getTime()+".csv");
  })
});

function download_csv(csv, filename) {
  var csvFile;
  var downloadLink;
  downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csv);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
}

function export_table_to_csv(html, filename) {
  var csv = [], indentNextXRows = 0, indentTo = 9999999;
  var rows = document.querySelectorAll("table tr");

  for (var i = 0; i < rows.length; i++) {
    var row = [], cols = rows[i].querySelectorAll("td, th");
    if (indentNextXRows > 0) {
      // Indent
      for (var k=0; k<indentTo; k++) {
        row.push("");
      }
      indentNextXRows--;
    }
    for (var j = 0; j < cols.length; j++) {
      if (cols[j].rowSpan > 1) {
        indentNextXRows = cols[j].rowSpan - 1;
      }
      else if (indentNextXRows > 0) {
        indentTo = Math.min(indentTo, j);
      }
      row.push('"' + cols[j].innerText + '"');
    }
    csv.push(row.join(","));		
  }
  download_csv(csv.join("\n"), filename);
}


function deleteMetric(i) {
  var path = $('.formcontrol-app').attr('formpath');
  var id = $('.formcontrol-app').attr('formbuilder');
  $.post(path + "/" + id + "/metric/" + i + "/remove", function () {
    location.reload();
  });
}