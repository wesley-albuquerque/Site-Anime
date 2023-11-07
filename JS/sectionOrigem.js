//Botões
function abreNovoOrigem() {
    popup.style.display = "block";
    h2PopUp.innerText = "Nova Origem";
    idPopUp.innerText = "";
    labelNomePopUp.innerText = "Nome da Origem";
    nomePopUp.value = "";
    buttonSalvarPopUp.innerText = "Cadastrar";
    buttonSalvarPopUp.onclick = function(){
        cadastraOrigem();
    };
    buttonDeletePopUp.style.display = "none";
};

//CRUD
function cadastraOrigem() {
    let data = JSON.stringify({
        Nome: nomePopUp.value
    });

    fetch("https://localhost:7026/api-anime/insere-origem", {
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
            consultaOrigem();
        })
        .catch(function (error) {
            console.log("Erro ao chamar API:", error);
            alert("Erro ao chamar API:", error);
        })
};

function consultaOrigem() {
    let divConsultaGenero = document.getElementById("divConsultaOrigem");
    let tableGenero = document.getElementById("tableOrigem");
    let trElements = tableGenero.getElementsByTagName("tr");
    while (trElements.length > 1) {
        tableGenero.removeChild(trElements[1]);
    }
    fetch("https://localhost:7026/api-anime/consulta-origem", {
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
            if (result != "Nenhum origem cadastrado") {
                divConsultaGenero.style.display = "block";
                let jsonResponse = JSON.parse(result);
                jsonResponse.forEach(function (registro) {
                    let trElement = document.createElement("tr");
                    for (let propriedade in registro) {
                        let tdElement = document.createElement("td");
                        if (propriedade.toLowerCase() == "id") {
                            tdElement.classList.add("tdElement");
                            tdElement.addEventListener("click", function () {
                                abreEdicaoOrigem(this.innerText);
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

function pesquisarOrigemPorNomeId(){
    document.getElementById("pesquisarOrigem").addEventListener("input", function(){
        let pesquisa = this.value.toLowerCase();
        let table = document.getElementById("tableOrigem");
    
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


function abreEdicaoOrigem(id) {
    popup.style.display = 'block';
    h2PopUp.innerText = "Edição de Origem";
    idPopUp.innerText = "Id: " + id;
    labelNomePopUp.innerText = "Nome da Origem";
    buttonSalvarPopUp.innerText = "Salvar";
    buttonSalvarPopUp.onclick = function(){
        atualizaOrigem(id);
    };
    buttonDeletePopUp.style.display = "inline";
    buttonDeletePopUp.onclick = function(){
        deleteOrigem(id);
    };

    fetch("https://localhost:7026/api-anime/consulta-origem/" + id, {
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
function atualizaOrigem(id) {
    var data = JSON.stringify({
        Id: id,
        Nome: nomePopUp.value
    });

    fetch("https://localhost:7026/api-anime/atualiza-origem/",{
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
        if(result == "origem atualizado com sucesso"){
            popup.style.display = "none";
            consultaOrigem();
        }
    })
    .catch(function(error){
        console.log("Erro ao chamar API: ", error);
        alert("Erro ao chamar API");
    })
};

function deleteOrigem(id){
    fetch("https://localhost:7026/api-anime/delete-origem/" + id, {
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
        if(result == "origem excluído com sucesso"){
            popup.style.display = "none";
            consultaOrigem();
        }
    })
    .catch(function(error){
        alert("Erro ao chamar API: ", error);
    });
};