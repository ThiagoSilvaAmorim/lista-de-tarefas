// Carrega as tarefas salvas no LocalStorage ao abrir a página
let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];

// Mostra as tarefas na tela ao carregar
renderizarTarefas();

// Função para cadastrar uma nova tarefa
function cadastrarTarefa() {
  // Pega os valores dos campos
  var titulo     = document.querySelector('#titulo').value.trim();
  var descricao  = document.querySelector('#descricao').value.trim();
  var prioridade = document.querySelector('#prioridade').value;

  // Validação: não permite tarefa sem título
  if (titulo === '') {
    alert('Por favor, informe o título da tarefa.');
    return;
  }

  // Cria o objeto da tarefa
  var novaTarefa = {
    id: Date.now(),
    titulo: titulo,
    descricao: descricao,
    prioridade: prioridade,
    status: 'pendente',
    dataCriacao: new Date().toLocaleDateString('pt-BR')
  };

  // Adiciona ao array e salva no LocalStorage
  tarefas.push(novaTarefa);
  salvarNoLocalStorage();

  // Limpa os campos do formulário
  document.querySelector('#titulo').value     = '';
  document.querySelector('#descricao').value  = '';
  document.querySelector('#prioridade').value = 'baixa';

  // Atualiza a lista na tela
  renderizarTarefas();
}

// Função para salvar o array de tarefas no LocalStorage
function salvarNoLocalStorage() {
  localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

// Função que desenha as tarefas na tela
function renderizarTarefas(filtro) {
  var lista    = document.querySelector('#listaTarefas');
  var mensagem = document.querySelector('#mensagemVazia');

  // Limpa a lista antes de redesenhar
  lista.innerHTML = '';

  // Filtra as tarefas se houver texto de busca
  var tarefasFiltradas = tarefas;
  if (filtro) {
    tarefasFiltradas = tarefas.filter(function(t) {
      return t.titulo.toLowerCase().indexOf(filtro.toLowerCase()) !== -1;
    });
  }

  // Mostra mensagem se não houver tarefas
  if (tarefasFiltradas.length === 0) {
    mensagem.style.display = 'block';
    return;
  } else {
    mensagem.style.display = 'none';
  }

  // Cria o card de cada tarefa com createElement
  tarefasFiltradas.forEach(function(tarefa) {

    // Div principal do card
    var div = document.createElement('div');
    div.className = 'tarefa ' + tarefa.prioridade;
    if (tarefa.status === 'concluida') {
      div.className += ' concluida';
    }

    // Título
    var h3 = document.createElement('h3');
    h3.textContent = tarefa.titulo;

    // Descrição
    var pDesc = document.createElement('p');
    pDesc.textContent = 'Descrição: ' + (tarefa.descricao || 'Sem descrição');

    // Prioridade, data e status
    var pInfo = document.createElement('p');
    pInfo.textContent = 'Prioridade: ' + tarefa.prioridade +
                        ' | Criada em: ' + tarefa.dataCriacao +
                        ' | Status: ' + tarefa.status;

    // Área dos botões
    var divAcoes = document.createElement('div');
    divAcoes.className = 'acoes';

    // Botão concluir
    var btnConcluir = document.createElement('button');
    btnConcluir.className   = 'btn-concluir';
    btnConcluir.textContent = tarefa.status === 'concluida' ? 'Reabrir' : 'Concluir';
    btnConcluir.addEventListener('click', function() {
      alternarStatus(tarefa.id);
    });

    // Botão editar
    var btnEditar = document.createElement('button');
    btnEditar.className   = 'btn-editar';
    btnEditar.textContent = 'Editar';
    btnEditar.addEventListener('click', function() {
      editarTarefa(tarefa.id);
    });

    // Botão excluir
    var btnExcluir = document.createElement('button');
    btnExcluir.className   = 'btn-excluir';
    btnExcluir.textContent = 'Excluir';
    btnExcluir.addEventListener('click', function() {
      excluirTarefa(tarefa.id);
    });

    // Monta o card com appendChild
    divAcoes.appendChild(btnConcluir);
    divAcoes.appendChild(btnEditar);
    divAcoes.appendChild(btnExcluir);

    div.appendChild(h3);
    div.appendChild(pDesc);
    div.appendChild(pInfo);
    div.appendChild(divAcoes);

    // Adiciona o card na lista
    lista.appendChild(div);
  });
}

// Função para marcar/desmarcar tarefa como concluída
function alternarStatus(id) {
  tarefas = tarefas.map(function(t) {
    if (t.id === id) {
      t.status = t.status === 'pendente' ? 'concluida' : 'pendente';
    }
    return t;
  });
  salvarNoLocalStorage();
  renderizarTarefas();
}

// Função para editar uma tarefa
function editarTarefa(id) {
  var tarefa = tarefas.find(function(t) { return t.id === id; });

  // Pede novo título e descrição via prompt
  var novoTitulo = prompt('Novo título:', tarefa.titulo);
  if (novoTitulo === null) return; // cancelou

  var novaDescricao = prompt('Nova descrição:', tarefa.descricao);
  if (novaDescricao === null) return;

  // Valida o título
  if (novoTitulo.trim() === '') {
    alert('O título não pode ficar vazio.');
    return;
  }

  // Atualiza os dados
  tarefa.titulo    = novoTitulo.trim();
  tarefa.descricao = novaDescricao.trim();

  salvarNoLocalStorage();
  renderizarTarefas();
}

// Função para excluir uma tarefa
function excluirTarefa(id) {
  var confirmar = confirm('Deseja excluir esta tarefa?');
  if (!confirmar) return;

  // Remove a tarefa do array pelo id
  tarefas = tarefas.filter(function(t) { return t.id !== id; });

  salvarNoLocalStorage();
  renderizarTarefas();
}

// Função de busca chamada ao digitar no campo
function buscarTarefas() {
  var termo = document.querySelector('#campoBusca').value;
  renderizarTarefas(termo);
}