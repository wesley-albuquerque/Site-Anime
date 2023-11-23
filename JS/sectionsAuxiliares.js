//Sections neste código: Gênero, Autor, Origem, Status e Nome do Anime

//#region Variáveis globais
//Div PopUp
const popup = document.getElementById('popup');
const h2PopUp = document.getElementById("h2PopUp");
const idPopUp = document.getElementById("idPopUp");
const labelNomePopUp = document.getElementById("labelNomePopUp");
const buttonSalvarPopUp = document.getElementById("buttonSalvarPopUp");
const buttonDeletePopUp = document.getElementById("buttonDeletePopUp");
const nomePopUp = document.getElementById("nomePopUp");

//Nomes das tabelas do banco de dados
const nomeTabelaGenero = "animes_genero";
const nomeTabelaAutor = "animes_autor";
const nomeTabelaOrigem = "animes_origem";
const nomeTabelaStatus = "animes_status";
const nomeTabelaNomeAnime = "animes_nome_anime";
//#endregion

//Botões
function abreNovoCadastroAuxiliar(nomeTabelaCadastroAuxiliar) {
    let nomeFormatado = formataNomeCadastroAuxiliar(nomeTabelaCadastroAuxiliar, false);
    popup.style.display = "block";
    h2PopUp.innerText = `Novo ${nomeFormatado}`;
    idPopUp.innerText = "";
    labelNomePopUp.innerText = "Nome do Anime";
    nomePopUp.value = "";
    buttonSalvarPopUp.innerText = "Cadastrar";
    buttonSalvarPopUp.onclick = function () {
        cadastraCadastroAuxiliar(nomeTabelaCadastroAuxiliar);
    };
    buttonDeletePopUp.style.display = "none";
};

//CRUD
function cadastraCadastroAuxiliar(nomeTabelaCadastroAuxiliar) {
    let nomeFormatado = formataNomeCadastroAuxiliar(nomeTabelaCadastroAuxiliar, false);
    let data = JSON.stringify({
        Nome: nomePopUp.value
    });

    fetch(`https://localhost:7026/api-anime/insere-${nomeTabelaCadastroAuxiliar}`, {
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
            alert(`${nomeFormatado} cadastrado com sucesso`);
            popup.style.display = "none";
            consultaCadastroAuxiliar(nomeTabelaCadastroAuxiliar);
        })
        .catch(function (error) {
            console.log("Erro ao chamar API:", error);
            alert("Erro ao chamar API:", error);
        })
};

function consultaCadastroAuxiliar(nomeTabelaCadastroAuxiliar) {
    let nomeCamelCase = formataNomeCadastroAuxiliar(nomeTabelaCadastroAuxiliar, true);
    let divConsultaCadastroAuxiliar = document.getElementById(`divConsulta${nomeCamelCase}`);
    let tableGenero = document.getElementById(`table${nomeCamelCase}`);
    let trElements = tableGenero.getElementsByTagName("tr");
    while (trElements.length > 1) {
        tableGenero.removeChild(trElements[1]);
    }
    consultaTodosRegistros(nomeTabelaCadastroAuxiliar, "GET").then(function (result) {
        console.log(result);
        if (result != `Nenhum ${nomeTabelaCadastroAuxiliar} cadastrado`) {
            divConsultaCadastroAuxiliar.style.display = "block";
            let jsonResponse = JSON.parse(result);
            jsonResponse.forEach(function (registro) {
                let trElement = document.createElement("tr");
                for (let propriedade in registro) {
                    let tdElement = document.createElement("td");
                    if (propriedade.toLowerCase() == "id") {
                        tdElement.classList.add("tdElement");
                        tdElement.addEventListener("click", function () {
                            abreEdicaoCadastroAuxiliar(this.innerText, nomeTabelaCadastroAuxiliar);
                        });
                    }
                    tdElement.innerText = registro[propriedade];
                    trElement.appendChild(tdElement);
                }
                tableGenero.appendChild(trElement);
            })
        }
        else {
            divConsultaCadastroAuxiliar.style.display = "none";
        }
    })
        .catch(function (error) {
            console.log("Erro ao chamar API: ", error);
            alert("Erro ao chamar API");
        })
};

function pesquisarCadastroAuxiliarPorNomeId(nomeTabelaCadastroAuxiliar) {
    let nomeFormatadoCamelCase = formataNomeCadastroAuxiliar(nomeTabelaCadastroAuxiliar, true);
    document.getElementById(`pesquisar${nomeFormatadoCamelCase}`).addEventListener("input", function () {
        let pesquisa = this.value.toLowerCase();
        let table = document.getElementById(`table${nomeFormatadoCamelCase}`);

        for (let i = 1; i < table.rows.length; i++) {
            let linha = table.rows[i];
            let textoLinha = linha.textContent.toLowerCase();

            if (textoLinha.includes(pesquisa)) {
                linha.style.display = "table-row";
            }
            else {
                linha.style.display = "none";
            }
        }
    });
}


function abreEdicaoCadastroAuxiliar(id, nomeTabelaCadastroAuxiliar) {
    nomeFormatado = formataNomeCadastroAuxiliar(nomeTabelaCadastroAuxiliar);
    popup.style.display = 'block';
    h2PopUp.innerText = `Edição do ${nomeFormatado}`;
    idPopUp.innerText = "Id: " + id;
    labelNomePopUp.innerText = `${nomeFormatado}`;
    buttonSalvarPopUp.innerText = "Salvar";
    buttonSalvarPopUp.onclick = function () {
        atualizaCadastrosAuxiliares(id, nomeTabelaCadastroAuxiliar);
    };
    buttonDeletePopUp.style.display = "inline";
    buttonDeletePopUp.onclick = function () {
        deleteCadastrosAuxiliares(id, nomeTabelaCadastroAuxiliar);
    };

    fetch(`https://localhost:7026/api-anime/consulta-${nomeTabelaCadastroAuxiliar}/${id}`, {
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
            let jsonResponse = JSON.parse(result);
            nomePopUp.value = jsonResponse[0].Nome;
        })
        .catch(function (error) {
            console.log("Erro ao chamar API: ", error);
            alert("Erro ao chamar API");
        })


};
function atualizaCadastrosAuxiliares(id, nomeTabelaCadastroAuxiliar) {
    let nomeFormatado = formataNomeCadastroAuxiliar(nomeTabelaCadastroAuxiliar, false);
    var data = JSON.stringify({
        Id: id,
        Nome: nomePopUp.value
    });

    fetch(`https://localhost:7026/api-anime/atualiza-${nomeTabelaCadastroAuxiliar}/`, {
        method: "Post",
        headers: {
            "Content-Type": "application/json"
        },
        body: data
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (result) {
            console.log(result);
            if (result == `${nomeTabelaCadastroAuxiliar} atualizado com sucesso`) {
                alert(`${nomeFormatado} atualizado com sucesso`);
                popup.style.display = "none";
                consultaCadastroAuxiliar(nomeTabelaCadastroAuxiliar);
            }
        })
        .catch(function (error) {
            console.log("Erro ao chamar API: ", error);
            alert("Erro ao chamar API");
        })
};

function deleteCadastrosAuxiliares(id, nomeTabelaCadastroAuxiliar) {
    let nomeFormatado = formataNomeCadastroAuxiliar(nomeTabelaCadastroAuxiliar, false)
    fetch(`https://localhost:7026/api-anime/delete-${nomeTabelaCadastroAuxiliar}/${id}`, {
        method: "Delete",
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (result) {
            if (result == `${nomeTabelaCadastroAuxiliar} excluído com sucesso`) {
                alert(`${nomeFormatado} excluído com sucesso`);
                popup.style.display = "none";
                consultaCadastroAuxiliar(nomeTabelaCadastroAuxiliar);
            }
        })
        .catch(function (error) {
            alert("Erro ao chamar API: ", error);
        });
};

function formataNomeCadastroAuxiliar(nome, camelCase) {
    switch (nome) {
        case nomeTabelaGenero:
            return camelCase ? "Genero" : "Gênero";
        case nomeTabelaAutor:
            return "Autor";
        case nomeTabelaOrigem:
            return "Origem";
        case nomeTabelaStatus:
            return "Status";
        case nomeTabelaNomeAnime:
            return camelCase ? "NomeAnime" : "Nome do Anime";
        default:
            return "Nome não reconhecido";
    };
}