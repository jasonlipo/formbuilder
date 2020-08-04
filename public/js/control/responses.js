var table, fieldEl, typeEl, valueEl;

$(function () {
  if (location.search.indexOf("combine") == -1) {
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
  }
  else {
    $('.formcontrol-responses td').filter(function () {
      return $(this).find('br').length > 0
    }).each(function () {
      $(this).html($(this).html().split("<br>").join("; "));
    })
  }

  var columns = $(".formcontrol-responses th").map(function() { return $(this).html(); }).toArray();
  table = new Tabulator(".formcontrol-responses", {
    layout: "fitColumns",
    downloadConfig: {
      columnCalcs: false
    },
    rowClick:function(e, row){
      var data = row['_row'].data
      getSubmissionInfo(data);
    },
    columns: columns.map(c => ({ bottomCalc: c == "Response" ? countDistinct : null, title: c, field: c, headerFilter: "input", headerFilterParams:{values:true} })),
    pagination:"local",
    paginationSize: 50,
    paginationSizeSelector:[25, 50, 100, 200],
  });
  table.hideColumn("Submission Id");
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

function getSubmissionInfo(submission_data) {
  var submission_id = submission_data['Submission Id']
  var path = $('.formcontrol-app').attr('formpath');
  var form_id = $('.formcontrol-app').attr('formbuilder');
  var authkey = $('.formcontrol-app').attr('authkey');
  var submission_info = {}
  $.get(path + "/" + form_id + "/response/" + submission_id, function (data) {
    data = JSON.parse(data)
    $.get(path + "/" + form_id + "/structure?key=" + authkey, function (structure) {
      structure = JSON.parse(structure)
      for (var el of structure.elements) {
        var props = el.props
        var label = props.label
        var id = props.id
        var value = data[id]
        if (props.validation && props.validation.type == 4) {
          value = data[id+"_0"] + " " + data[id+"_1"]
        }
        submission_info[label] = value
      }

      $('.formcontrol-app-response-modal, .formcontrol-app-response-modal-bg').remove();
      $('body').append(`
        <div class="formcontrol-app-response-modal-bg"></div>
        <div class="formcontrol-app-response-modal">
          <h1>Response #${submission_data['Response']}</h1>
          <small>Submitted on ${submission_data['Submission Date']}</small>
          <br /><br />
          ${
            Object.keys(submission_info).map(label => {
              let value = submission_info[label] || "<em>No response recorded</em>"
              if (typeof submission_info[label] == "object") {
                value = value.join("<br />")
              }
              return `<p>
              <b>${label}</b><br />${value}
              </p>`
            }).join("")
          }
          <br />
          <a class="delete-response-button formbuilder-button" onclick="delete_response('${submission_data['Submission Id']}')">Remove</a>
        </div>
      `);
      $('.formcontrol-app-response-modal-bg').click(function () {
        $('.formcontrol-app-response-modal, .formcontrol-app-response-modal-bg').remove();
      })
    })
  })
}

function delete_response(id) {
  if (confirm("Are you sure you want to delete this submission?")) {
    var path = $('.formcontrol-app').attr('formpath');
    var form_id = $('.formcontrol-app').attr('formbuilder');
    var authkey = $('.formcontrol-app').attr('authkey');
    $.post(path + "/" + form_id + "/response/" + id + "/delete?key=" + authkey, function () {
      location.reload()
    })
  }
}

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

function download_excel_all() {
  table.download("xlsx", "KinlossForm.xlsx", { sheetName: "Responses"}, "all")
}

function deleteMetric(i) {
  var path = $('.formcontrol-app').attr('formpath');
  var id = $('.formcontrol-app').attr('formbuilder');
  $.post(path + "/" + id + "/metric/" + i + "/remove", function () {
    location.reload();
  });
}