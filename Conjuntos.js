function formatarInput(campo) {
    let valor = campo.value;
    valor = valor.replace(/\s+/g, "");
    valor = valor.replace(/;([^ ])/g, "; $1");
    campo.value = valor;
}

function removerOpcaoPadrao() {
    const operacao = document.getElementById('operacao').value;
    const opcao = document.getElementById('opcao');
    if (operacao) {
        opcao.options[0].disabled = true;
        opcao.disabled = false;
    } else {
        opcao.options[0].disabled = false;
        opcao.disabled = true;
        opcao.selectedIndex = 0;
    }
}

function ordenarLista(lista) {
    let numeros = lista.filter(item => /^-?\d+([,\.]\d+)?$/.test(item))
        .map(item => item.replace(",", "."))
        .map(Number)
        .sort((a, b) => a - b)
        .map(item => item.toString().replace(".", ","));

    let letras = lista.filter(item => /^[a-zA-Z]$/.test(item)).sort();
    let palavras = lista.filter(item => !/^(-?\d+([,\.]\d+)?)$/.test(item) && !/^[a-zA-Z]$/.test(item));

    return [...numeros, ...letras, ...palavras];
}

function contarElementos(array) {
    let elementos = 0;
    for (let item of array) {
        if (/\d/.test(item) || /^[a-zA-Z]+$/.test(item) || item.trim() !== "") {
            elementos++;
        }
    }
    return elementos;
}

function uniao(a, b) {
    let conjunto = new Set([...a.map(item => item.trim()), ...b.map(item => item.trim())]);

    let numeros = [...conjunto].filter(item => /^-?\d+([,\.]\d+)?$/.test(item))
        .map(item => item.replace(",", "."))
        .map(Number)
        .sort((a, b) => a - b)
        .map(item => item.toString().replace(".", ","));

    let letras = [...conjunto].filter(item => /^[a-zA-Z]$/.test(item)).sort();
    let palavras = [...conjunto].filter(item => !/^(-?\d+([,\.]\d+)?)$/.test(item) && !/^[a-zA-Z]$/.test(item));

    return [...numeros, ...letras, ...palavras];
}

function intersecao(a, b) {
    return ordenarLista(a.filter(item => b.includes(item)));
}

function diferenca(a, b) {
    let resultado = a.filter(item => !b.includes(item));
    return ordenarLista(resultado);
}

function exibirEscolha() {
    let params = new URLSearchParams(window.location.search);
    let operacao = params.get("operacao");
    let opcao = params.get("opcao");
    let campo1 = params.get("campo1");
    let campo2 = params.get("campo2");
    let campo3 = params.get("campo3");

    if (!operacao) {
        document.title = "Selecione uma Operação";
    } else {
        document.title = "" + operacao.charAt(0).toUpperCase() + operacao.slice(1);
    }

    if (!operacao || !opcao) {
        document.getElementById("opcaoEscolhida").innerText = "Nenhuma escolha foi feita.";
        return;
    }

    let campo1Array = campo1 ? campo1.split(';').map(item => item.trim()) : [];
    let campo2Array = campo2 ? campo2.split(';').map(item => item.trim()) : [];
    let campo3Array = campo3 ? campo3.split(';').map(item => item.trim()) : [];

    let resultado = "";

    if (opcao === "#A") {
        resultado = contarElementos(campo1Array);
    } else if (opcao === "#B") {
        resultado = contarElementos(campo2Array);
    } else if (opcao === "#C") {
        resultado = contarElementos(campo3Array);
    } else if (opcao === "#A + #B") {
        resultado = contarElementos(campo1Array) + contarElementos(campo2Array);
    } else if (opcao === "#B + #C") {
        resultado = contarElementos(campo2Array) + contarElementos(campo3Array);
    } else if (opcao === "#A + #C") {
        resultado = contarElementos(campo1Array) + contarElementos(campo3Array);
    } else if (opcao === "#A + #B + #C") {
        resultado = contarElementos(campo1Array) + contarElementos(campo2Array) + contarElementos(campo3Array);
    } else if (opcao === "A ∪ B") {
        resultado = uniao(campo1Array, campo2Array);
    } else if (opcao === "B ∪ C") {
        resultado = uniao(campo2Array, campo3Array);
    } else if (opcao === "A ∪ C") {
        resultado = uniao(campo1Array, campo3Array);
    } else if (opcao === "A ∪ B ∪ C") {
        resultado = uniao(uniao(campo1Array, campo2Array), campo3Array);
    } else if (opcao === "A ∩ B") {
        resultado = intersecao(campo1Array, campo2Array);
    } else if (opcao === "B ∩ C") {
        resultado = intersecao(campo2Array, campo3Array);
    } else if (opcao === "A ∩ C") {
        resultado = intersecao(campo1Array, campo3Array);
    } else if (opcao === "A ∩ B ∩ C") {
        resultado = intersecao(intersecao(campo1Array, campo2Array), campo3Array);
    } else if (opcao === "A e B") {
        resultado = [...diferenca(campo1Array, campo2Array), ...diferenca(campo2Array, campo1Array)];
    } else if (opcao === "B e C") {
        resultado = [...diferenca(campo2Array, campo3Array), ...diferenca(campo3Array, campo2Array)];
    } else if (opcao === "A e C") {
        resultado = [...diferenca(campo1Array, campo3Array), ...diferenca(campo3Array, campo1Array)];
    } else if (opcao === "A, B e C") {
        let soA = diferenca(campo1Array, [...campo2Array, ...campo3Array]);
        let soB = diferenca(campo2Array, [...campo1Array, ...campo3Array]);
        let soC = diferenca(campo3Array, [...campo1Array, ...campo2Array]);
        resultado = [...soA, ...soB, ...soC];
    }

    document.getElementById("opcaoEscolhida").innerText = `${opcao} → { ${Array.isArray(resultado) ? resultado.join("; ") : resultado} }`;
}