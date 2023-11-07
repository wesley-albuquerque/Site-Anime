//Botões
function abreNovoAutor() {
    popup.style.display = "block";
    h2PopUp.innerText = "Novo Autor";
    idPopUp.innerText = "";
    labelNomePopUp.innerText = "Nome do Autor";
    nomePopUp.value = "";
    buttonSalvarPopUp.innerText = "Cadastrar";
    buttonSalvarPopUp.onclick = function(){
        cadastraAutor();
    };
    buttonDeletePopUp.style.display = "none";
};

//CRUD
function cadastraAutor() {
    let data = JSON.stringify({
        Nome: nomePopUp.value
    });

    fetch("https://localhost:7026/api-anime/insere-autor", {
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
        .then(function (response) {
            return response.text()
        })
        .then(function (result) {
            console.log(result);
            alert(result);
            popup.style.display = "none";
            consultaAutor();
        })
        .catch(function (error) {
            console.log("Erro ao chamar API:", error);
            alert("Erro ao chamar API:", error);
        })
};

function consultaAutor() {
    let divConsultaGenero = document.getElementById("divConsultaAutor");
    let tableGenero = document.getElementById("tableAutor");
    let trElements = tableGenero.getElementsByTagName("tr");
    while (trElements.length > 1) {
        tableGenero.removeChild(trElements[1]);
    }
    fetch("https://localhost:7026/api-anime/consulta-autor", {
        method: "Get",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (result) {
            console.log(result);
            if (result != "Nenhum autor cadastrado") {
                divConsultaGenero.style.display = "block";
                let jsonResponse = JSON.parse(result);
                jsonResponse.forEach(function (registro) {
                    let trElement = document.createElement("tr");
                    for (let propriedade in registro) {
                        let tdElement = document.createElement("td");
                        if (propriedade.toLowerCase() == "id") {
                            tdElement.classList.add("tdElement");
                            tdElement.addEventListener("click", function () {
                                abreEdicaoAutor(this.innerText);
                            });
                        }
                        tdElement.innerText = registro[propriedade];
                        trElement.appendChild(tdElement);
                    }
                    tableGenero.appendChild(trElement);
                })
            }
            else {
                divConsultaGenero.style.display = "none";
            }
        })
        .catch(function (error) {
            console.log("Erro ao chamar API: ", error);
            alert("Erro ao chamar API");
        })
};

function pesquisarAutorPorNomeId(){
    document.getElementById("pesquisarAutor").addEventListener("input", function(){
        let pesquisa = this.value.toLowerCase();
        let table = document.getElementById("tableAutor");
    
        for(let i = 1; i < table.rows.length; i++){
            let linha = table.rows[i];
            let textoLinha = linha.textContent.toLowerCase();
    
            if (textoLinha.includes(pesquisa)){
                linha.style.display = "table-row";
            }
            else{
                linha.style.display = "none";
            }
        }
    });
}


function abreEdicaoAutor(id) {
    popup.style.display = 'block';
    h2PopUp.innerText = "Edição de Autor";
    idPopUp.innerText = "Id: " + id;
    labelNomePopUp.innerText = "Nome do Autor";
    buttonSalvarPopUp.innerText = "Salvar";
    buttonSalvarPopUp.onclick = function(){
        atualizaAutor(id);
    };
    buttonDeletePopUp.style.display = "inline";
    buttonDeletePopUp.onclick = function(){
        deleteAutor(id);
    };

    fetch("https://localhost:7026/api-anime/consulta-autor/" + id, {
        method: "Get",
        headers:{
            "Content-Type": "application/json"
        }
    })
    .then(function(response){
        return response.text();
    })
    .then(function(result){
        console.log(result);
        let jsonResponse = JSON.parse(result);
        nomePopUp.value = jsonResponse[0].Nome;
    })
    .catch(function(error){
        console.log("Erro ao chamar API: ", error);
        alert("Erro ao chamar API");
    })
    

};
function atualizaAutor(id) {
    var data = JSON.stringify({
        Id: id,
        Nome: nomePopUp.value
    });

    fetch("https://localhost:7026/api-anime/atualiza-autor/",{
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
    .then(function(response){
        return response.text();
    })
    .then(function (result){
        console.log(result);
        alert(result);
        if(result == "autor atualizado com sucesso"){
            popup.style.display = "none";
            consultaAutor();
        }
    })
    .catch(function(error){
        console.log("Erro ao chamar API: ", error);
        alert("Erro ao chamar API");
    })
};

function deleteAutor(id){
    fetch("https://localhost:7026/api-anime/delete-autor/" + id, {
        method: "Delete",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(function(response){
        return response.text();
    })
    .then(function(result){
        alert(result);
        if(result == "autor excluído com sucesso"){
            popup.style.display = "none";
            consultaAutor();
        }
    })
    .catch(function(error){
        alert("Erro ao chamar API: ", error);
    });
};