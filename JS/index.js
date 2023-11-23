var main = document.getElementById("main");

//#region Botões do menu lateral
function AbrirFecharSideBar() {
    var divSideBar = document.getElementById("divSideBar");
    let hamburguerButton = document.getElementById("hamburguerButton");
    var menuLateral = document.getElementById("menuLateral");
    var body = document.getElementById("body");
    if (divSideBar.style.display == "none") {
        divSideBar.style.display = "block";
        menuLateral.style.width = "100px";
        body.style.marginLeft = "150px";
        hamburguerButton.style.marginLeft = "27px"
    }
    else {
        divSideBar.style.display = "none";
        menuLateral.style.width = "50px";
        body.style.marginLeft = "100px";
        hamburguerButton.style.marginLeft = "0px"

    }
};

function carregaPaginaInicial() {
    var sectionPaginaInicial = document.getElementById("sectionPaginaInicial");
    main.innerHTML = sectionPaginaInicial.innerHTML;
};

function carregaNovaAvaliacao() {
    var sectionMain = document.getElementById("sectionNovaAvaliacao");
    main.innerHTML = sectionMain.innerHTML;
    personalizaSelectElements();
};

function abreFechaCadastrosAuxiliares() {
    var divCadastrosAuxiliares = document.getElementById("divCadastrosAuxiliares");
    if (divCadastrosAuxiliares.style.display == "none") {
        divCadastrosAuxiliares.style.display = "block";
    }
    else {
        divCadastrosAuxiliares.style.display = "none";
    }
};

function carregaGenero() {
    sectionGenero = document.getElementById("sectionGenero");
    main.innerHTML = sectionGenero.innerHTML;
    consultaGenero();
    pesquisarGeneroPorNomeId();
};

function carregaAutor() {
    sectionGenero = document.getElementById("sectionAutor");
    main.innerHTML = sectionGenero.innerHTML;
    consultaAutor();
    pesquisarAutorPorNomeId();
};

function carregaOrigem() {
    sectionGenero = document.getElementById("sectionOrigem");
    main.innerHTML = sectionGenero.innerHTML;
    consultaOrigem();
    pesquisarOrigemPorNomeId();
};

function carregaStatus() {
    sectionGenero = document.getElementById("sectionStatus");
    main.innerHTML = sectionGenero.innerHTML;
    consultaStatus();
    pesquisarStatusPorNomeId();
};

function carregaCadastrosAuxiliares(nomeTabelaCadastroAuxiliar) {
    let nomeCamelCase = formataNomeCadastroAuxiliar(nomeTabelaCadastroAuxiliar, true);
    sectionGenero = document.getElementById(`section${nomeCamelCase}`);
    main.innerHTML = sectionGenero.innerHTML;
    consultaCadastroAuxiliar(nomeTabelaCadastroAuxiliar);
    pesquisarCadastroAuxiliarPorNomeId(nomeTabelaCadastroAuxiliar);
};
//#endregion

function personalizaSelectElements() {
    var selectElements = document.querySelectorAll("select");
    var options = [];
    selectElements.forEach(async function (selectElement) {
        switch (selectElement.name) {
            case "nomeAnime":
                options = await obterOpcoesSelectElment("nome_anime", "GET");
                break;
            case "autor":
                options = await obterOpcoesSelectElment("autor", "GET");
                break;
            case "genero":
                options = await obterOpcoesSelectElment("genero", "GET");
                break;
            case "status":
                options = await obterOpcoesSelectElment("status", "GET");
                break;
            case "origem":
                options = await obterOpcoesSelectElment("origem", "GET");
                break;
        };
        $(selectElement).selectize({
            options: options,
            placeholder: 'Procurar pelo nome...',
            width: "30px",
            loadingClass: "select",
        });
        // var selectize = selectElement.selectize;
        // selectize.clear();
    });
    document.getElementById("statusAnime").style.display = "inline";
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
        var valorEnredo = enredo != null && enredo !=""? enredo: 0;

        var enrolacao = document.getElementById("enrolacao").value;
        var valorEnrolacao = enrolacao != null && enrolacao !=""? enrolacao: 0;

        var animacao = document.getElementById("animacao").value;
        var valorAnimacao = animacao != null && animacao !=""? animacao: 0;

        var desenvolvimento = document.getElementById("desenvolvimento").value;
        var valorDesenv = desenvolvimento != null && desenvolvimento !=""? desenvolvimento: 0;

        var notaFinal =((parseFloat(valorEnredo) + parseFloat(valorEnrolacao) + 
                        parseFloat(valorAnimacao) + parseFloat(valorDesenv))/4).toFixed(2);
        document.getElementById("notaFinal").value = notaFinal;
    }
};

//#region funções globais de consulta

async function consultaTodosRegistros(tabela, metodo) {
    return fetch(`https://localhost:7026/api-anime/consulta-${tabela}`, {
        method: metodo,
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then(function (response) {
            return response.text();
        })
        .then(function (result) {
            console.log(result);
            return (result);
        })
        .catch(function (error) {
            console.log(error);
            alert("Erro ao chamar API: " + error);
        });
};

//#endregion
