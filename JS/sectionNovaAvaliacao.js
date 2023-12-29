//#region variáveis globais
var nomeAnimeInput;
const divAvaliacao = document.getElementById("divAvaliacao");
const popupAvaliacao = document.getElementById("popupAvaliacao");
//#endregion

//#region Funções de personalização
function personalizaSelectElements() {
    var selectElements = document.querySelectorAll("select");
    var options = [];
    selectElements.forEach(async function (selectElement) {
        switch (selectElement.name) {
            case "nomeAnime":
                options = await obterOpcoesSelectElment(nomeTabelaNomeAnime, "GET");
                break;
            case "autor":
                options = await obterOpcoesSelectElment(nomeTabelaAutor, "GET");
                break;
            case "genero":
                options = await obterOpcoesSelectElment(nomeTabelaGenero, "GET");
                break;
            case "status":
                options = await obterOpcoesSelectElment(nomeTabelaStatus, "GET");
                break;
            case "origem":
                options = await obterOpcoesSelectElment(nomeTabelaOrigem, "GET");
                break;
        };
        $(selectElement).selectize({
            options: options,
            placeholder: 'Procurar pelo nome ou id...',
            width: "30px",
            create: function (input) {
                return {
                    value: "inlusao",
                    text: input,
                };
            },
            //persist: true,
            render: {
                option_create: function (data, escape) {
                    return '<div class="create">Nome não encontrado. Clique aqui para cadastrar <strong>' + escape(data.input) + '</strong>&hellip;</div>';
                }
            },
            onOptionAdd: async function (value, data) {
                if (selectElement.name == "nomeAnime" || selectElement.name == "autor") {
                    if (value == "inlusao") {
                        var nomeTabela;
                        if (selectElement.name == "nomeAnime") {
                            nomeTabela = nomeTabelaNomeAnime;
                        } else {
                            nomeTabela = nomeTabelaAutor;
                        }
                        let result = await cadastraSelectOption(nomeTabela, selectElement.name, data.text);
                    }
                }
            },
            onDropdownClose: function () {
                nomeAnimeInput = this.lastValue;
            },
            onBlur: function () {
                this.$control_input.val(nomeAnimeInput);
            },
        });
        if (selectElement.name != "nomeAnime" && selectElement.name != "autor") {
            selectElement.selectize.settings.create = false;
        }
    });
};

async function obterOpcoesSelectElment(tabela, metodo) {
    let options = [];
    let arrayJson = JSON.parse(await consultaTodosRegistros(tabela, metodo));
    arrayJson.forEach(registro => {
        let option = { value: registro.Id, text: `${registro.Id} - ${registro.Nome}` };
        options.push(option);
    });
    return options;
};

async function cadastraSelectOption(nomeTabela, nomeSelectElement, nomeRegistro) {
    let result = await cadastraCadastroAuxiliar(nomeTabela, nomeRegistro);
    if (!result) {
        return;
    }
    let optionsAtualizadas = await obterOpcoesSelectElment(nomeTabela);
    var selectizeNomeAnime = $(`#${nomeSelectElement}`);
    selectizeNomeAnime[0].selectize.clearOptions();
    selectizeNomeAnime[0].selectize.clearOptions();
    selectizeNomeAnime[0].selectize.addOption(optionsAtualizadas);
    selectizeNomeAnime[0].selectize.setValue(optionsAtualizadas[optionsAtualizadas.length - 1].value.toString());
}

function abreFechaAdicionais(checado) {
    var divAdicionais = document.getElementById("divAdicionais");
    if (checado) {
        divAdicionais.style.display = "block";
    }
    else {
        divAdicionais.style.display = "none";
    }
};

function calcularNotaFinal(elementoChamada) {
    if (elementoChamada.value > 10 || elementoChamada.value < 0) {
        alert("Insira um valor entre 0 e 10!");
        calcularNotaFinal(elementoChamada.value = 0);
        elementoChamada.value = "";
        elementoChamada.focus();
    }
    else {
        var enredo = document.getElementById("enredo").value;
        var valorEnredo = enredo != null && enredo != "" ? enredo : 0;

        var enrolacao = document.getElementById("enrolacao").value;
        var valorEnrolacao = enrolacao != null && enrolacao != "" ? enrolacao : 0;

        var animacao = document.getElementById("animacao").value;
        var valorAnimacao = animacao != null && animacao != "" ? animacao : 0;

        var desenvolvimento = document.getElementById("desenvolvimento").value;
        var valorDesenv = desenvolvimento != null && desenvolvimento != "" ? desenvolvimento : 0;

        var notaFinal = ((parseFloat(valorEnredo) + parseFloat(valorEnrolacao) +
            parseFloat(valorAnimacao) + parseFloat(valorDesenv)) / 4).toFixed(2);
        document.getElementById("notaFinal").value = notaFinal;
    }
};

function fechaButtonPopUpAvaliacao() {
    popupAvaliacao.style.display = 'none';
};

window.addEventListener('click', (event) => {
    if (event.target === popupAvaliacao) {
        popupAvaliacao.style.display = 'none';
    }
});
//#endregion

//#region Funções auxiliares
function previneEnvioFormulario(event) {
    event.preventDefault(); // previne o envio automático do formulário
    cadastraNovaAvaliacao();
}
function alteraCamposObrigatorios(dropado) {
    var elementsInput = document.getElementsByTagName("input");
    var elementsSelect = document.getElementsByTagName("select");
    var elementsTextArea = document.getElementsByTagName("textarea");

    if (dropado.checked) {
        let elementosObrigatorios = [...elementsInput, ...elementsSelect, ...elementsTextArea];
        elementosObrigatorios.forEach(function (elemento) {
            if (elemento.id != "nomeAnime-selectized" && elemento.id != "temporadaAvaliacao") {
                elemento.required = false;
            }
        });
    }
    else {
        let elementosObrigatorios = [...elementsInput, ...elementsSelect, ...elementsTextArea];
        elementosObrigatorios.forEach(function (elemento) {
            if (elemento.id != "ovas" && elemento.id != "filmes") {
                elemento.required = true;
            }
        });
    }
}
async function ConsultaAvaliacao(id) {
    return fetch(`https://localhost:7026/api-anime/consulta-animes-avaliacao/${id ? id : ""}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        },
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (result) {
            console.log(result);
            return result;
        })
        .catch(function (error) {
            console.log("Erro ao chamar API: ", error);
            alert("Erro ao chamar API");
        });
}
function FormataDataMesAno(data) {
    const meses = [
        'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
        'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ];
    let partes = data.split("/");
    let partes2 = partes[2].split(" ");
    let mes = meses[parseInt(partes[1]) - 1];
    let ano = partes2[0];
    return `${mes}/${ano}`;
}
function FormataDataHora(data) {
    data = new Date(data);
    let dia = String(data.getUTCDate()).padStart(2, '0');
    let mes = String(data.getUTCMonth() + 1).padStart(2, '0');
    let ano = data.getUTCFullYear();
    let horas = String(data.getHours()).padStart(2, '0');
    let minutos = String(data.getMinutes()).padStart(2, '0');
    let segundos = String(data.getSeconds()).padStart(2, '0');
    return `${dia}/${mes}/${ano} ${horas}:${minutos}:${segundos}`;
}
function CapitalizarPalavras(frase) {
    var palavras = frase.split(' ');
    for (var i = 0; i < palavras.length; i++) {
        palavras[i] = palavras[i].charAt(0).toUpperCase() + palavras[i].slice(1);
    }
    var fraseCapitalizada = palavras.join(' ');
    return fraseCapitalizada;
}
//#endregion
function cadastraNovaAvaliacao() {
    var elementsInput = document.getElementsByTagName("input");
    var elementsSelect = document.getElementsByTagName("select");
    var elementsTextArea = document.getElementsByTagName("textarea");

    let data = JSON.stringify({
        nome_anime_id: parseInt(elementsSelect.nomeAnime.value),
        autor_id: parseInt(elementsSelect.autor.value),
        genero_id: parseInt(elementsSelect.genero.value),
        temporada_aval: parseInt(elementsInput.temporadaAvaliacao.value),
        episodios: parseInt(elementsInput.episodios.value),
        temporadas: parseInt(elementsInput.temporadas.value),
        lancamento_anime: elementsInput.lancamento.value ? elementsInput.lancamento.value + "-01" : null,
        status_anime_id: parseInt(elementsSelect.statusAnime.value),
        origem_id: parseInt(elementsSelect.origem.value),
        volumes: parseInt(elementsInput.volumes.value),
        lancamento_origem: elementsInput.lancamentoOrigem.value ? elementsInput.lancamentoOrigem.value : null,
        status_origem_id: parseInt(elementsSelect.statusOrigem.value),
        ovas: parseInt(elementsInput.ovas.value),
        filmes: parseInt(elementsInput.filmes.value),
        sinopse: elementsTextArea.sinopse.value,
        resumo: elementsTextArea.resumo.value,
        enredo: parseInt(elementsInput.enredo.value),
        enrolacao: parseInt(elementsInput.enrolacao.value),
        animacao: parseInt(elementsInput.animacao.value),
        desenvolvimento: parseInt(elementsInput.desenvolvimento.value),
        critica: elementsTextArea.critica.value,
        dropado: elementsInput.dropado.checked,
        nota_final: parseFloat(elementsInput.notaFinal.value),
    });

    fetch(`https://localhost:7026/api-anime/insere-animes`, {
        method: "POST",
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
            if (result == `Avaliação cadastrada com sucesso`) {
                alert(`${result}`);
            }
            else {
                alert(result);
            }
        })
        .catch(function (error) {
            alert("Erro ao chamar API: ", error);
        });
}
function OnloadConsultaAvalicao() {
    let tableAvaliacao = document.getElementById("tableAvaliacao");
    let trElements = tableAvaliacao.getElementsByTagName("tr");
    while (trElements.length > 1) {
        if (!tableAvaliacao.tBodies[1]) {
            tableAvaliacao.removeChild(trElements[1]);
        }
        else {
            tableAvaliacao.removeChild(tableAvaliacao.tBodies[1]);
        }
    }
    ConsultaAvaliacao().then(function (result) {
        if (result != "Nenhuma avaliação cadastrada") {
            divAvaliacao.style.display = "block";
            let jsonResponse = JSON.parse(result);
            jsonResponse.forEach(function (registro) {
                let trElement = document.createElement("tr");
                for (let propriedade in registro) {
                    if (propriedade.toLowerCase() != "dropado") {
                        let tdElement = document.createElement("td");
                        if (propriedade.toLowerCase() == "id") {
                            tdElement.classList.add("tdElement");
                            tdElement.addEventListener("click", function () {
                                VisualizaAvaliacao(this.innerText);
                            });
                        }
                        if (propriedade.toLowerCase() == "lancamento_anime") {
                            registro[propriedade] = FormataDataMesAno(registro[propriedade]);
                        }
                        if (propriedade.toLowerCase() == "data_criacao" || propriedade.toLowerCase() == "data_mod") {
                            registro[propriedade] = FormataDataHora(registro[propriedade]);
                        }
                        tdElement.innerText = registro[propriedade];
                        trElement.appendChild(tdElement);
                    }
                }
                tableAvaliacao.appendChild(trElement);
            })

        }
        else {
            divAvaliacao.style.display = "none";
        }
    })
        .catch(function (error) {
            console.log("Erro ao chamar API: ", error);
            alert("Erro ao chamar API");
        });
}
function VisualizaAvaliacao(id) {
    popupAvaliacao.style.display = "block";
    let closePopUpAvaliacao = document.getElementById("closePopUpAvaliacao");
    let divButtons = document.getElementById("divButtons");
    let divContentAvaliacao = document.getElementById("divContentAvaliacao");
    divContentAvaliacao.innerHTML = "";
    ConsultaAvaliacao(id).then(function (result) {
        let jsonResponse = JSON.parse(result);
        for (propriedade in jsonResponse[0]) {
            let p = document.createElement("p");
            if (propriedade.toLowerCase() == "lancamento_anime") {
                jsonResponse[0][propriedade] = FormataDataMesAno(jsonResponse[0][propriedade]);
            }
            if (propriedade.toLowerCase() == "data_criacao" || propriedade.toLowerCase() == "data_mod") {
                jsonResponse[0][propriedade] = FormataDataHora(jsonResponse[0][propriedade]);
            }
            let rotulo = CapitalizarPalavras(propriedade.replace("_", " "));
            let texto = jsonResponse[0][propriedade];
            p.innerHTML = `<strong>${rotulo}</strong>: ${texto}`;
            if (propriedade.toLowerCase() == "nome_anime_id" || propriedade.toLowerCase() == "autor_id" || propriedade.toLowerCase() == "genero_id" || propriedade.toLowerCase() == "dropado" || propriedade.toLowerCase() == "status_anime_id" || propriedade.toLowerCase() == "status_origem_id" || propriedade.toLowerCase() == "origem_id") {
                p.hidden = true;
            }
            divContentAvaliacao.appendChild(p);
        }
        divContentAvaliacao.appendChild(closePopUpAvaliacao);
        divContentAvaliacao.appendChild(divButtons);
    })
        .catch(function (error) {
            console.log("Erro ao chamar API: ", error);
            alert("Erro ao chamar API");
        });

}


