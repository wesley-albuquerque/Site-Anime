//Botões do menu lateral
var main = document.getElementById("main");

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
    var selectAutor = $('#autor');
    $(document).ready(function() {
        selectAutor.selectize({
            options: [
                { value: 1, text: "Item1" },
                { value: 2, text: "Item 2" },
                { value: 3, text: "Item 3" },
                // Adicione mais opções conforme necessário
            ],
            placeholder: 'Procurar pelo nome...',
            width: "30px",
            create: false, // Desabilita a criação de novos itens
        });
        var selectize = selectAutor[0].selectize;
        selectize.clear();
    });
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


