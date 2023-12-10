//#region variáveis globais
var nomeAnimeInput;
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
//#endregion

// document.querySelector('form').addEventListener('submit', previneEnvioFormulario);
function previneEnvioFormulario(event) {
    event.preventDefault(); // previne o envio automático do formulário
    cadastraNovaAvaliacao();
}
// document.getElementById("cadastraNovaAvalicao").addEventListener('submit', previneEnvioFormulario);
// function previneEnvioFormulario(event) {
//     event.preventDefault(); // previne o envio automático do formulário
//     cadastraNovaAvaliacao();
// }

function alteraCamposObrigatorios(dropado){
    var elementsInput = document.getElementsByTagName("input");
    var elementsSelect = document.getElementsByTagName("select");
    var elementsTextArea = document.getElementsByTagName("textarea");

    if (dropado.checked) {
        let elementosObrigatorios = [...elementsInput, ...elementsSelect, ...elementsTextArea];
        elementosObrigatorios.forEach(function (elemento) {
            if (elemento.id != "nomeAnime-selectized") {
                elemento.required = false;
            }
        });
    }
}

function cadastraNovaAvaliacao() {
    var elementsInput = document.getElementsByTagName("input");
    var elementsSelect = document.getElementsByTagName("select");
    var elementsTextArea = document.getElementsByTagName("textarea");

    if (elementsInput.dropado.checked) {
        let elementosObrigatorios = [...elementsInput, ...elementsSelect, ...elementsTextArea];
        elementosObrigatorios.forEach(function (elemento) {
            if (elemento.id != "nomeAnime-selectized") {
                elemento.required = false;
            }
        });
    }
}