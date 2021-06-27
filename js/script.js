/////variables globales
var editor;
var cont = 0;
var baseDatos = [];
var idSearch;
var colorFont;

function $(id) {
    return document.getElementById(id);
}

//validar URL
function validURL(str) {
    let pattern = new RegExp('((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))', 'i');
    return !!pattern.test(str);
}


//validar Url youtube
function getYoutubeVideoId(url) {
    let video_id = -1;

    if (url.indexOf('youtu.be') != -1) {
        url = url.split('/');
        video_id = url[url.length - 1];
    } else if (url.indexOf('youtube') != -1) {
        video_id = url.split('v=')[1];
    }

    if (video_id != -1) {
        let ampersandPosition = video_id.indexOf('&');

        if (ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
    }

    return video_id;
}

////validar archivo a subir
function handleFileSelect(evt) {
    file = evt.target.files[0];

    let reader = new FileReader();

    reader.onload = (function (file) {
        return function (e) {
            let str = e.target.result;
            let res = str.replace("script", "div");
            window.editor.body.innerHTML = res;
        };
    })(file);

    reader.readAsText(file);
}

///subir archivo
function UploadFile() {
    let form = document.createElement("FORM");
    let input = document.createElement("INPUT");

    form.setAttribute('enctype', 'multipart/form-data');

    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'text/plain');
    input.setAttribute('name', 'file');
    input.addEventListener('change', handleFileSelect);

    form.appendChild(input);

    document.body.appendChild(form);

    input.click();

    form.remove();

}

///descargar archivo
function DownloadFile() {

    DataCapture();
    let text = window.editor.body.innerHTML;
    let a = document.createElement("a");
    let blob = new Blob([text], {
        type: "text/plain;charset=utf-8"
    });
    let url = window.URL.createObjectURL(blob);
    let d = new Date();
    let n = d.getTime();

    document.body.appendChild(a);


    a.style = "display: none";
    a.href = url;
    a.download = `${NewDocument.title}-${n}.txt`;
    a.click();
    a.remove();

    window.URL.revokeObjectURL(url);

}


//quitar formato
function Unformat() {
    editor.execCommand("RemoveFormat", false, null);
}

//Deshacer
function Undo() {
    editor.execCommand("undo", false, null);
}

//Rehacer
function Redo() {
    editor.execCommand("redo", false, null);
}

//ALinear a la izquierda
function AlignLeft() {
    editor.execCommand("justifyLeft", false, null);
}

//centrar
function AlignCenter() {
    editor.execCommand("justifyCenter", false, null);
}

//alinear a la derecha 
function AlignRight() {
    editor.execCommand("justifyRight", false, null);
}

//justificar
function Justify() {
    editor.execCommand("justifyFull", false, null);
}

//texto Negrita
function Bold() {
    editor.execCommand("bold", false, null);
}

///texto italico
function Italic() {
    editor.execCommand("italic", false, null);
}

///texto subrayado
function UnderLine() {
    editor.execCommand("underline", false, null);
}

//texto tachado
function StrikeThrough() {
    editor.execCommand("strikeThrough", false, null);
}

//cortar texto
function Cut() {
    editor.execCommand("cut", false, null);
}

//copiar texto
function Copy() {
    editor.execCommand("copy", false, null);
}

//pegar texto
function Paste() {
    editor.execCommand("paste", false, null);
}

///insertar vineta
function insertUnordered() {
    editor.execCommand("insertUnorderedList");
}

//insertar lista
function insertOrdered() {
    editor.execCommand("insertOrderedList");
}

//formato de vinetas html
function rev(t) {
    return t.split("<").join("&lt;").split(">").join("&gt;").split("\"").join("&quot;");
}

//insertar imagen
function insertImage() {
    var u;
    if (!(u = prompt('ingresar url', 'http://'))) return;
    editor.body.focus();
    editor.execCommand("InsertImage", false, u);
}

///insertar video de youtube
function InsertVideo() {
    var url = prompt("URL del video de Youtube:");

    if (validURL(url)) {
        let video_id = getYoutubeVideoId(url);

        if (video_id != -1) {
            url = `https://www.youtube.com/embed/${video_id}`;

            var youtube_html = `<iframe style="width: 100%; height: 285px;" src="${url}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            editor.execCommand("inserthtml", false, youtube_html);
        } else {
            alert("Invalid URL!");
        }
    }
}

///cambiar tamano de fuente
function alterFont(size) {
    editor.execCommand("fontSize", false, parseInt(size));
}

//insertar link
function Link() {
    var u;
    if (!(u = prompt('ingresar url', 'http://'))) return;
    editor.execCommand("CreateLink", false, u);
}

//quitar link
function unLink() {
    editor.execCommand("Unlink", false, null);
}

///funcion para camabiar color de fuente esta funcion detecta el cambio de valor 
///en el div type color y se lo pasa a la funcion fontColor como parametro 
///y la funcion font Color hace el respectivo cambio
function ChangeColorFont() {
    colorFont = document.getElementById("colorFont").value;

    Fontcolor(colorFont);
}

function Fontcolor(c) {
    editor.execCommand("forecolor", false, c);
}

///funcion para camabiar color de fondo esta funcion detecta el cambio de valor 
///en el div type color y se lo pasa a la funcion FontcolorBg como parametro 
///y la funcion FontcolorBg hace el respectivo cambio
function ChangeFontBackgroundColor() {
    colorFontBg = document.getElementById("colorFontBg").value;

    FontcolorBg(colorFontBg);
}

function FontcolorBg(c) {
    console.log();
    editor.execCommand("backcolor", false, c);
    //var h=window.ActiveXObject?'backcolor':'hilitecolor';
    //editor.execCommand(h,false,c);
}

///Limpiar los controladores para un nuevo documento
function NewDoc() {
    DocumentName.innerHTML = "";
    DocumentName.innerHTML += "Nuevo Documento";
    editor.body.innerHTML = "";
    document.getElementById("doc").selectedIndex = 0;

}



///craar tabla
const table = document.querySelector(".icon-table")

table.addEventListener("click", () => {
    let fila = +prompt('Inserte Numero de filas?')
    let columna = +prompt('Inserte Numero de Columnas?')

    if (fila && columna) {
        let t = document.createElement("table")
        t.border = "4"
        t.style.borderCollapse = "collapse"
        t.style.border = "2px solid #ccc"
        t.style.margin = "auto"

        for (let l = 0; l < fila; l++) {
            let tr = document.createElement("tr")
            tr.style.border = "2px solid #ccc"

            for (let c = 0; c < columna; c++) {
                let td = document.createElement("td")
                td.style.border = "2px solid #ccc"
                td.innerHTML = " Insert Text "
                tr.appendChild(td)
            }
            t.appendChild(tr)
        }
        editor.body.appendChild(t)
    }
})

////insertar texto en html
function inHTML() {
    var u, u2;
    if (!(u = prompt('ingresar html', ''))) return;
    try {
        editor.execCommand("inserthtml", false, u);
    } catch (e) {
        try {
            editor.body.focus();
            u2 = editor.selection.createRange();
            u2.pasteHTML(u);
        } catch (E) {
            alert('nop');
        }
    }
}

///mostrar el texto en html
function htmlOEditor(e) {
    e = e || window.event;
    ob = e.target || e.srcElement
    $('edit').style.display = (ob.value == 'html') ? 'none' : 'block';
    $('ht').style.display = (ob.value != 'html') ? 'none' : 'block';
    $('ht').innerHTML = rev(editor.body.innerHTML);
    ob.value = (ob.value == 'html') ? 'editor' : 'html';
}

///opcion para editar el iframe q hara las veces de pantalla
window.onload = function () {
    editor = $('edit').contentDocument || $('edit').contentWindow.document;
    editor.designMode = 'on';
}

///funcion para capturar los datos del formulario y crear el objeto document
function DataCapture() {

    cont++;
    title = prompt("Ingrese un Nombre para el documento");

    if (title != null && title != "") {
        function Document(id, title, body) {
            this.id = id;
            this.title = title;
            this.body = body;
        }

        textDocument = editor.body.innerHTML;
        NewDocument = new Document(cont, title, textDocument);
        console.log(NewDocument);
        SaveDataBase();
    }
}

////funcion para guardar la informacion en areglo
function SaveDataBase() {
    baseDatos.push(NewDocument);
    //console.log(baseDatos);
    DocumentName.innerHTML = "";
    DocumentName.innerHTML += NewDocument.title;
    document.getElementById("doc").innerHTML += '<option value="' + NewDocument.id + '"><a class="far fa-file-word"> ' + NewDocument.id + ' -------[' + NewDocument.title + ']-------</a></option>'
};

///funcion para mostrar la informacion guardada en el arreglo
function ShowSelected() {
    var cod = document.getElementById("doc").value;
    if (cod == 0) {
        DocumentName.innerHTML = "";
        DocumentName.innerHTML += "Nuevo Documento";
        editor.body.innerHTML = "";
    }
    idSearch = baseDatos.find(element => element.id == cod);
    editor.body.innerHTML = "";
    editor.body.innerHTML += idSearch.body;
    DocumentName.innerHTML = "";
    DocumentName.innerHTML += idSearch.title;
    // console.log(idSearch.id);
}


function ChangeFont() {
    var font = document.getElementById("font").value;
    console.log(font);

    switch (font) {
        case "0":
            editor.body.style.fontFamily = "'Times New Roman'";
            break;
        case "1":
            editor.body.style.fontFamily = "Arial, Helvetica, sans-serif";
            break;
        case "2":
            editor.body.style.fontFamily = "'Courier New', Courier, monospace";
            break;
        default:
            break;
    }


}
function estiloTitulo(size) {
    editor.execCommand("fontSize", false, parseInt(size));
    editor.execCommand( "foreColor", false, "navy" )   ;  
}