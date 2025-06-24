async function carregarUsuarios() {
  const resposta = await fetch('http://localhost:3001/api/users');
  const usuarios = await resposta.json();

  const tabela = document.getElementById('tabela-usuarios');
  tabela.innerHTML = '';

  usuarios.forEach(usuario => {
    const linha = `<tr>
      <td data-label="ID">${usuario.id}</td>
      <td data-label="Nome">${usuario.nome}</td>
      <td data-label="Email">${usuario.email}</td>
      <td data-label="Ações">
        <button onclick="editarUsuario(${usuario.id}, '${usuario.nome}', '${usuario.email}')">Editar</button>
        <button onclick="deletarUsuario(${usuario.id})">Excluir</button>
      </td>
    </tr>`;
    tabela.innerHTML += linha;
  });
}

async function adicionarUsuario() {
  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  if (!nome || !email) {
    alert('Preencha todos os campos!');
    return;
  }

  const response = await fetch('http://localhost:3001/api/users', { 
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    // CORREÇÃO: Enviando 'nome' em vez de 'name'
    body: JSON.stringify({nome: nome, email: email})
  });

  if (!response.ok) {
    const errorData = await response.json();
    alert(`Erro ao salvar: ${errorData.error || response.statusText}`);
    return;
  }

  document.getElementById('nome').value = '';
  document.getElementById('email').value = '';

  carregarUsuarios();
}

async function deletarUsuario(id) {
  const response = await fetch(`http://localhost:3001/api/users/${id}`, { 
    method: 'DELETE'
  });

  if (!response.ok && response.status !== 204) { // 204 No Content para deleção bem-sucedida
    const errorData = await response.json();
    alert(`Erro ao excluir: ${errorData.error || response.statusText}`);
    return;
  }

  carregarUsuarios();
}

function editarUsuario(id, nome, email) {
  document.getElementById('nome').value = nome;
  document.getElementById('email').value = email;

  const botao = document.getElementById('botao-salvar');
  botao.textContent = 'Atualizar';
  botao.onclick = async function() {
    const response = await fetch(`http://localhost:3001/api/users/${id}`, { 
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      // CORREÇÃO: Enviando 'nome' em vez de 'name'
      body: JSON.stringify({nome: document.getElementById('nome').value, email: document.getElementById('email').value})
    });

    if (!response.ok) {
        const errorData = await response.json();
        alert(`Erro ao atualizar: ${errorData.error || response.statusText}`);
        return;
    }

    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    botao.textContent = 'Salvar';
    botao.onclick = adicionarUsuario;

    carregarUsuarios();
  }
}

document.addEventListener('DOMContentLoaded', carregarUsuarios);
