//Variáveis globais
const popup = document.getElementById('popup');
const h2PopUp = document.getElementById("h2PopUp");
const idPopUp = document.getElementById("idPopUp");
const labelNomePopUp = document.getElementById("labelNomePopUp");
const buttonSalvarPopUp = document.getElementById("buttonSalvarPopUp");
const buttonDeletePopUp = document.getElementById("buttonDeletePopUp");
const nomePopUp = document.getElementById("nomePopUp");

//Botões
function abreNovoGenero() {
    popup.style.display = "block";
    h2PopUp.innerText = "Novo Gênero";
    idPopUp.innerText = "";
    labelNomePopUp.innerText = "Nome do Gênero";
    nomePopUp.value = "";
    buttonSalvarPopUp.innerText = "Cadastrar";
    buttonSalvarPopUp.onclick = function(){
        cadastraGenero();
    };
    buttonDeletePopUp.style.display = "none";
};

function fechaButtonPopUp() {
    popup.style.display = 'none';
};

window.addEventListener('click', (event) => {
    if (event.target === popup) {
        popup.style.display = 'none';
    }
});

//CRUD
function cadastraGenero() {
    let nomeGenero = nomePopUp.value;
    let data = JSON.stringify({
        Nome: nomeGenero
    });

    fetch("https://localhost:7026/api-anime/insere-genero", {
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
            consultaGenero();
        })
        .catch(function (error) {
            console.log("Erro ao chamar API:", error);
            alert("Erro ao chamar API:", error);
        })
};

function consultaGenero() {
    let divConsultaGenero = document.getElementById("divConsultaGenero");
    let tableGenero = document.getElementById("tableGenero");
    let trElements = tableGenero.getElementsByTagName("tr");
    while (trElements.length > 1) {
        tableGenero.removeChild(trElements[1]);
    }
    fetch("https://localhost:7026/api-anime/consulta-genero", {
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
            if (result != "Nenhum genero cadastrado") {
                divConsultaGenero.style.display = "block";
                let jsonResponse = JSON.parse(result);
                jsonResponse.forEach(function (registro) {
                    let trElement = document.createElement("tr");
                    for (let propriedade in registro) {
                        let tdElement = document.createElement("td");
                        if (propriedade.toLowerCase() == "id") {
                            tdElement.classList.add("tdElement");
                            tdElement.addEventListener("click", function () {
                                abreEdicaoGenero(this.innerText);
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

function pesquisarGeneroPorNomeId(){
    document.getElementById("pesquisarGenero").addEventListener("input", function(){
        let pesquisa = this.value.toLowerCase();
        let table = document.getElementById("tableGenero");
    
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


function abreEdicaoGenero(id) {
    popup.style.display = 'block';
    h2PopUp.innerText = "Edição de Gênero";
    idPopUp.innerText = "Id: " + id;
    labelNomePopUp.innerText = "Nome do Gênero";
    buttonSalvarPopUp.innerText = "Salvar";
    buttonSalvarPopUp.onclick = function(){
        atualizaGenero(id);
    };
    buttonDeletePopUp.style.display = "inline";
    buttonDeletePopUp.onclick = function(){
        deleteGenero(id);
    };

    fetch("https://localhost:7026/api-anime/consulta-genero/" + id, {
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
function atualizaGenero(id) {
    let nomeGenero = document.getElementById("nomePopUp").value;
    var data = JSON.stringify({
        Id: id,
        Nome: nomeGenero
    });

    fetch("https://localhost:7026/api-anime/atualiza-genero/",{
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
        if(result == "genero atualizado com sucesso"){
            popup.style.display = "none";
            consultaGenero();
        }
    })
    .catch(function(error){
        console.log("Erro ao chamar API: ", error);
        alert("Erro ao chamar API");
    })
};

function deleteGenero(id){
    let data = JSON.stringify({
        id: id
    });
    fetch("https://localhost:7026/api-anime/delete-genero/" + id, {
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
        if(result == "genero excluído com sucesso"){
            popup.style.display = "none";
            consultaGenero();
        }
    })
    .catch(function(error){
        alert("Erro ao chamar API: ", error);
    });
};