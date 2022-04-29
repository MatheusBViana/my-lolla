function bolinhas(){
    let size = document.getElementById("tamanho").innerHTML;
    size = parseInt(size);

    if (size < 5){
        document.getElementById("aviso").style.display = "block";
    }else{
        
        let linha1 = 0;
        let linha2 = 0;
        let soma = 0;

        for (let i = 0; i < 2; i++){
            linha1 += document.getElementById("i"+i).clientWidth;
            linha2 = document.getElementById("i"+1).clientWidth;

            soma = linha1 + linha2;
            console.log(soma);
            soma += 45;
            console.log(soma);
            document.getElementById("top"+i).innerHTML += document.getElementById("i"+i).innerHTML;
      
            if(soma < 413){
                document.getElementById("top"+i).innerHTML +=  " ı"
            }
        }
        altura_anterior = 102;
        altura_atual = 102;
      
        let text = document.getElementById("tapete");
        
        for (let i = 2; i < size; i++){

            let aux = document.getElementById("i"+i).innerHTML;
            text.innerHTML += aux;
            if (i != size - 1){
                text.innerHTML +="ı";
            }
        }
        if (text.clientHeight > 392){
            text.style.fontSize = "15px";
        }

        document.getElementById("referencia").style.display = "none";
        document.getElementById("loading").style.display = "none";
    }
}
            

document.getElementById("download").addEventListener("click", function() {
    
    let window_width = window.innerWidth;
    if (window_width >= 1024){
        html2canvas(document.getElementById("salvar"),{logging: true, letterRendering: 1, allowTaint: true, useCORS: true, backgroundColor: 'black', height: 792}).then(function(canvas) {
            saveAs(canvas.toDataURL(), 'file-name.png');
        });
    } else{
        html2canvas(document.getElementById("salvar"),{logging: true, letterRendering: 1, allowTaint: true, useCORS: true, backgroundColor: 'black', height: 1000}).then(function(canvas) {
        saveAs(canvas.toDataURL(), 'file-name.png');
        });
    }
});


function saveAs(uri, filename) {

    var link = document.createElement('a');

    if (typeof link.download === 'string') {

        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);

    } else {

        window.open(uri);

    }
}
