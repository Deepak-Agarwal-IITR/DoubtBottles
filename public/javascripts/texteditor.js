function format(command, value) {
    document.execCommand(command, false, value);
}

function sendData(e){
    console.log(e);
    let textarea = document.getElementById("text"+e);
    let texteditor = document.getElementById("texteditor"+e);
    textarea.value = texteditor.innerHTML;
}