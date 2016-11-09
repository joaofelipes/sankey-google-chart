// Sets chart options.
colors = ['#a6cee3', '#b2df8a', '#fb9a99', '#fdbf6f','#cab2d6', '#999966', '#b3ffff','#1f78b4', '#33a02c'];
options = {
      sankey: { 
          node: { nodePadding: 2, colors: colors, width: 10 }
      }
};

$( document ).ready(function() {
      
      // Resize hook function
      function resizeChart () {
          drawChart();
      }
      if (document.addEventListener) {
          window.addEventListener('resize', resizeChart);
      }
      else if (document.attachEvent) {
          window.attachEvent('onresize', resizeChart);
      }
      else {
          window.resize = resizeChart;
      }

      // Option checkbox
      $('#chkcolorlinks').click(function() {
        if (!($(this).is(':checked'))) {
            $('#linktype').attr('disabled', 'disabled');
        } else {
            $('#linktype').removeAttr('disabled');
        }
      });
      
      // Chart Button
      $('#chartbtn').click(function() { 
        localStorage.setItem('Current', txtdatasource.value);
        createChart('Current');
        $('#myModal').modal('hide'); 
      });
      
      // Reset button
      $('#rstbtn').click(function() {
            localStorage.removeItem("Current");
            $('#myModal').modal('hide');
            location.reload();
      });
      if (localStorage.getItem("Current") === null || localStorage.getItem("Current") === "") {
           datarows = [["Tango","Flamenco",1],
                      ["Flamenco","Dance",1],
                      ["Foxtrot","Dance",1],
                      ["Country Muisc","Folk-Rock",1],
                      ["Country Muisc","Rock-a-Billy",1],
                      ["Rock-a-Billy","Pop-Rock",1],
                      ["Rock-a-Billy","Soul",1],
                      ["Rock-a-Billy","Folk-Rock",1],
                      ["Blues","R+B",3],
                      ["R+B","Rock-a-Billy",1],
                      ["R+B","Hard-Rock",1],
                      ["R+B","Doo Wop",1],
                      ["Doo Wop","Soul",1],
                      ["Doo Wop","Funk",1]];

            var txtEntry = "";
            datarows.forEach(function(entry) {
                txtEntry = txtEntry + JSON.stringify(entry) + ',\r\n';
            });
            txtdatasource.value = '[' + txtEntry.slice(0, -3) +']'
            localStorage.setItem('Current', txtdatasource.value )
      } else {
            txtdatasource.value = localStorage.getItem('Current');
            datarows = $.parseJSON(localStorage.getItem('Current'));
      }


      // Manage Buttons
      $('.manage-bt').click(function () { loadMngSelect() });
      $('.btnMngSave').click(function () { saveAsMngbt() });
      $('.btnMngDelete').click(function () { deleteMngbt() });
      $('.btnMngLoad').click(function () { loadMngbt() });

      // Manage Save imput and button
      $('.btnMngSave').prop('disabled',true);
      $('#inputSaveAs').keyup(function(){
          $('.btnMngSave').prop('disabled', this.value == "" ? true : false);     
      })

});

function createChart ( dataSource )  {
  datarows = $.parseJSON(localStorage.getItem(dataSource));
  var colormode = linktype.value
  var npadd = inputpad.value;
  var nwidth = inputwid.value;          
  var nfsize = inputfsize.value;  
  options["sankey"] = {node: { nodePadding: npadd, colors: colors, width: nwidth, label: { fontName: 'verdana', fontSize: nfsize } }};
  if (chkcolorlinks.checked) {
     options["sankey"] = {link: {colorMode: colormode,colors: colors}, node: { nodePadding: npadd, colors: colors, width: nwidth, label: { fontName: 'verdana', fontSize: nfsize } }};
  } else {
    delete options.sankey.link;
  }
  drawChart();
}

google.charts.load('current', {'packages':['sankey']});
      google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Area');
  data.addColumn('string', 'SystemToBe');
  data.addColumn('number', 'Weight');
  data.addRows(datarows);
  // Instantiates and draws our chart, passing in some options.
  var chart = new google.visualization.Sankey(document.getElementById('sankey_multiple'));
  chart.draw(data, options);
};


function loadMngSelect () {
    $('#ManageSelect').empty()
    for (var key in localStorage){
      $('#ManageSelect').append($('<option>', {
        value: key,
        text: key
      }));    
    };
};

function saveAsMngbt () {
  localStorage.setItem(inputSaveAs.value, txtdatasource.value);
}

function deleteMngbt () {
  localStorage.removeItem(ManageSelect.value);
  $('#ManageModal').modal('hide');
}

function loadMngbt () {
  createChart(ManageSelect.value);
  $('#ManageModal').modal('hide');
}
