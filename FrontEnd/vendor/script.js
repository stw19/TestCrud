var toggleModifica = 0;
$(document).ready(function () {
  $('#create, #read, #update, #delete').hide();
  $('#create').show();
});

$(document).on("click", '.editable', function (e) {
  if (toggleModifica === 0) {
    toggleModifica = 1;
    console.log("toggleModifica vale " + toggleModifica);
    var i = 0;
    var id = $(this).attr('id');
    e.stopPropagation();
    var value = $('#' + id).html();
    updateVal('#' + id, value);
  }
});
function updateVal(currentEle, value) {
  $(currentEle).html("<input class='thVal' type='text' value='" + value + "' />");
  $(".thVal").focus();
  $(".thVal").keyup(function (event) {
    if (event.keyCode == 13) {
        $(currentEle).html($(".thVal").val().trim());
        var id = currentEle.split("-");
        update(id);
        toggleModifica = 0;
    }
  });

  $(".thVal").focusout(function () {
        $(currentEle).html($(".thVal").val().trim());
        var id = currentEle.split("-");
        update(id);
        toggleModifica = 0;
  });
}

function update(id) {
  var data = {
    "id": id[1],
    "username": $("td#username-" + id[1]).html(),
    "nome": $("td#nome-" + id[1]).html(),
    "cognome": $("td#cognome-" + id[1]).html(),
    "email": $("td#email-" + id[1]).html()
  }
  console.log(data);
  $.ajax({
    url: '../api/product/update.php',
    method: 'POST',
    data: JSON.stringify(data),
    dataType: 'JSON',
    //async: false
  }).done(function () {
      console.log("Aggiornato correttamente");
    }).fail(function () {
    console.log("Operazione non andata a buon fine");
    alert("Operazione non andata a buon fine.");
  });
}

function clear(id) {
  $('#createid, #readid, #updateid, #deleteid').removeClass('active');
  $('#create, #read, #update, #delete').hide();
  $('#' + id + 'id').addClass('active');
  $('#' + id).show();
}

$(document).on('click', 'button.delete', function () {
  var currID = this.id;
  var cancellato;
  var domanda = confirm("Cancellare l'utente ID #" + currID + "?");
  if (domanda === true) {
    $.ajax({
      url: '../api/product/delete.php',
      method: 'POST',
      data: { id: currID },
      dataType: 'JSON',
      async: false
    }).done(function () {
      cancellato = true;
    }).fail(function () {
      cancellato = false;
    });
    if (cancellato === true) {
      $(this).closest('tr').remove();
      alert("Eliminato correttamente.");
    } else {
      alert("Errore nella cencellazione dell'utente");
    }
  }
});
$('#createid').click(function () {
  /*$('#createid, #readid, #updateid, #deleteid').removeClass('active');
              $('#create, #read, #update, #delete').hide();
              $('#createid').addClass('active');
              $('#create').show();*/
  clear("create");
});
$('#readid').click(function () {
  /*$('#createid, #readid, #updateid, #deleteid').removeClass('active');
              $('#create, #read, #update, #delete').hide();
              $('#readid').addClass('active');
              $('#read').show();*/
  clear("read");
});

//vuoto campi ricerca
$('input#inputID').focus(function () {
  $('input#inputRicerca').val("");
});

$('input#inputRicerca').focus(function () {
  $('input#inputID').val("");
});

//click su ricerca
$('#cercaid').click(function () {
  var inputID = $('#inputID').val();
  var inputRicerca = $('#inputRicerca').val();
  if (inputID) {
    $("#result").empty();
    $.ajax({
      method: 'POST',
      url: '../api/product/read_one.php?id=' + inputID
    }).done(function (r) {
      var content = "<table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Username</th><th scope='col'>Nome</th><th scope='col'>Cognome</th><th scope='col'>Email</th></tr></thead><tbody>";
      content += "<tr><td>" + r['id'] + "</td>";
      content += "<td class='editable' id='username-" + r["id"] + "'>" + r["username"] + "</td>";
      content += "<td class='editable' id='nome-" + r["id"] + "'>" + r["nome"] + "</td>";
      content += "<td class='editable' id='cognome-" + r["id"] + "'>" + r["cognome"] + "</td>";
      content += "<td class='editable' id='email-" + r["id"] + "'>" + r["email"] + "</td>";
      content += "<td><button type='button' class='btn btn-link delete' id='" + r["id"] + "'><i class='far fa-trash-alt'></i></i></a></td></tr>";
      content += '</tbody></table>'
      $('#result').append(content);
    });
  }
  if (inputRicerca) {
    $("#result").empty();
    $.ajax({
      method: 'POST',
      url: '../api/product/search.php?s=' + inputRicerca
    }).done(function (r) {
      var elemento = r.records;
      var max = elemento.length;
      var content = "<table class='table'><thead><tr><th scope='col'>#</th><th scope='col'>Username</th><th scope='col'>Nome</th><th scope='col'>Cognome</th><th scope='col'>Email</th><th scope='col'></th></tr></thead><tbody>";
      for (var i = 0; i < max; i++) {
        content += "<tr><td>" + elemento[i]['id'] + "</td>";
        content += "<td class='editable' id='username-" + elemento[i]["id"] + "'>" + elemento[i]["username"] + "</td>";
        content += "<td class='editable' id='nome-" + elemento[i]["id"] + "'>" + elemento[i]["nome"] + "</td>";
        content += "<td class='editable' id='cognome-" + elemento[i]["id"] + "'>" + elemento[i]["cognome"] + "</td>";
        content += "<td class='editable' id='email-" + elemento[i]["id"] + "'>" + elemento[i]["email"] + "</td>";
        content += "<td><button type='button' class='btn btn-link delete' id='" + elemento[i]["id"] + "'><i class='far fa-trash-alt'></i></i></a></td></tr>";
      }
      content += '</tbody></table>'
      $('#result').append(content);
    });
  }
});
$("#creaNuovo").click(function () {
  var data = {
    "username": $("#inputUsername").val(),
    "nome": $("#inputName").val(),
    "cognome": $("#inputSurname").val(),
    "email": $("#inputEmail").val()
  };
  console.log(data);
  $.ajax({
    method: 'POST',
    url: '../api/product/create.php',
    data: JSON.stringify(data)
  }).done(function () {
    alert("Utente creato");
  });
  $(':text').val('');
  $('#inputEmail').val('');
});