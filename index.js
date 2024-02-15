const main = document.getElementById("main");
const novaAval = document.getElementById("sectionNovaAvaliacao").innerHTML;
const hostApi = "https://192.168.18.86:88";

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
    OnloadConsultaAvalicao();
};

function carregaNovaAvaliacao() {
    main.innerHTML = novaAval;
    document.getElementById("sectionNovaAvaliacao").innerHTML = "";
    personalizaSelectElements();
    document.querySelector('form').addEventListener('submit', previneEnvioFormulario);
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

function carregaCadastrosAuxiliares(nomeTabelaCadastroAuxiliar) {
    let nomeCamelCase = formataNomeCadastroAuxiliar(nomeTabelaCadastroAuxiliar, true);
    sectionCadastrosAuxiliares = document.getElementById(`section${nomeCamelCase}`);
    main.innerHTML = sectionCadastrosAuxiliares.innerHTML;

    consultaCadastroAuxiliar(nomeTabelaCadastroAuxiliar);
    pesquisarCadastroAuxiliarPorNomeId(nomeTabelaCadastroAuxiliar);
};
//#endregion

//#region funções globais de consulta

async function consultaTodosRegistros(tabela, metodo) {
    return fetch(`${hostApi}/api-anime/consulta-${tabela}`, {
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
            return result;
        })
        .catch(function (error) {
            console.log(error);
            alert("Erro ao chamar API: " + error);
        });
};

function validaTexto(texto){
    if (texto == null || texto == "") {
        return false;
    }
    else {
        let textoSemEspaços = texto.replace(/\s/g, "");
        if (textoSemEspaços == "") {
            return false;
        }
        else{
            return true;
        }
    }
};

//#endregion
