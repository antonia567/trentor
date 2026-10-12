  //===Menu Hamburger===//
  const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu-principal');

function alternarMenu(abrir) {
  menu.classList.toggle('aberto', abrir);
  hamburger.classList.toggle('ativo', abrir);
  hamburger.setAttribute('aria-expanded', abrir);
}

hamburger.addEventListener('click', () => {
  alternarMenu(!menu.classList.contains('aberto'));
});


// Fecha o menu ao clicar num link
menu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => alternarMenu(false));
});

// Fecha os menus ao clicar fora
document.addEventListener('click', (e) => {
  const wrapperContato = document.querySelector('.input-contato-wrapper');
  const menuContato = document.getElementById('menuContato');
  if (wrapperContato && !wrapperContato.contains(e.target)) {
    menuContato.classList.add('hidden');
  }
  
  const wrapperPS = document.querySelector('.input-produtoservico-wrapper');
  const menuPS = document.getElementById('menuProdutoServico');
  if (wrapperPS && !wrapperPS.contains(e.target)) {
    menuPS.classList.add('hidden');
  }
});

// ===== Método de contacto =====
function toggleMenuContacto() {
  document.getElementById('menuContato').classList.toggle('hidden');
}

function escolherContacto(opcao) {
  document.getElementById('menuContato').classList.add('hidden');
  document.getElementById('metodoContato').value = opcao;

  const badge = document.getElementById('badgeContato');
  const campoExtra = document.getElementById('campoExtra');
  const labelExtra = document.getElementById('labelExtra');
  const inputExtra = document.getElementById('inputExtra');
  const inputTelemovel = document.getElementById('inumero');

  campoExtra.classList.remove('hidden');
  badge.classList.remove('hidden');
  inputTelemovel.classList.add('preenchido');
  inputTelemovel.classList.remove('campo-invalido');

  inputTelemovel.value = opcao;
  inputTelemovel.readOnly = true;

  if (opcao === 'email') {
    badge.textContent = '✓ Email selected';
    badge.className = 'badge-contato badge-email';
    labelExtra.textContent = 'Email Address';
    inputExtra.type = 'email';
    inputExtra.placeholder = 'Enter your email';
    inputExtra.value = '';
  } else if (opcao === 'whatsapp') {
    badge.textContent = '✓ WhatsApp selected';
    badge.className = 'badge-contato badge-whatsapp';
    labelExtra.textContent = 'WhatsApp Number';
    inputExtra.type = 'tel';
    inputExtra.placeholder = 'Insert WhatsApp number';
    inputExtra.value = '';
  }
}

// ===== Serviço =====
const SERVICOS = ['Logística', 'Automação com IA'];

function toggleMenuProdutoServico() {
  document.getElementById('menuProdutoServico').classList.toggle('hidden');
}

function escolherProdutoServico(opcao) {
  document.getElementById('menuProdutoServico').classList.add('hidden');
  document.getElementById('tipoProdutoServico').value = opcao;

  const badge = document.getElementById('badgeProdServ');
  const campoExtra = document.getElementById('campoExtraProdServ');
  const labelExtra = document.getElementById('labelExtraProdServ');
  const inputProdServ = document.getElementById('iProdutoServico');

  campoExtra.classList.remove('hidden');
  badge.classList.remove('hidden');
  inputProdServ.classList.add('preenchido');
  inputProdServ.classList.remove('campo-invalido');

  inputProdServ.value = 'Service';
  badge.textContent = '✓ Service selected';
  badge.className = 'badge-contato badge-servico';
  labelExtra.textContent = 'Which service?';
  popularSelectProdutoServico(SERVICOS);
}

function popularSelectProdutoServico(lista) {
  const select = document.getElementById('inputExtraProdServ');
  select.innerHTML = '<option value="" disabled selected>Select an option</option>';
  lista.forEach(item => {
    const opt = document.createElement('option');
    opt.value = item;
    opt.textContent = item;
    select.appendChild(opt);
  });
}

// ===== Validação e envio =====
const formLogin = document.querySelector('.login-form');
const erroFormulario = document.getElementById('erroFormulario');

if (formLogin) {
  formLogin.addEventListener('submit', (e) => {
    e.preventDefault();

    const camposObrigatorios = [
  { id: 'inome', label: 'Nome e Sobrenome' },
  { id: 'metodoContato', visual: 'inumero', label: 'Método de contato (Email ou WhatsApp)' },
  { id: 'inputExtra', label: 'Email ou número do WhatsApp' },
  { id: 'inputExtraProdServ', label: 'Qual serviço' }
];

    let camposFaltando = [];

    camposObrigatorios.forEach(campo => {
      const elemento = document.getElementById(campo.id);
      const visual = document.getElementById(campo.visual || campo.id);
      const vazio = !elemento || elemento.value.trim() === '';

      if (vazio) {
        camposFaltando.push(campo.label);
        visual?.classList.add('campo-invalido');
        visual?.classList.remove('preenchido');
      } else {
        visual?.classList.remove('campo-invalido');
      }
    });

    if (camposFaltando.length > 0) {
      erroFormulario.textContent = `Por favor, preencha: ${camposFaltando.join(', ')}.`;
      erroFormulario.classList.remove('hidden');
      return;
    }

    erroFormulario.classList.add('hidden');

    const dados = {
      nome: document.getElementById('inome').value,
      metodoContato: document.getElementById('metodoContato').value,
      contato: document.getElementById('inputExtra').value,
      servico: document.getElementById('inputExtraProdServ').value
    };

    const btnEnviar = document.getElementById('btnEnviar');
    btnEnviar.disabled = true;
    btnEnviar.textContent = 'Enviando...';

    fetch('https://formspree.io/f/xeeyybev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(dados)
    })
    .then(response => {
      if (response.ok) {
        if (dados.metodoContato === 'whatsapp') {
          const msg = `Nome: ${dados.nome}.\n Serviço: ${dados.servico}.\n WhatsApp: ${dados.contato}`;
          window.open(`https://wa.me/244945784743?text=${encodeURIComponent(msg)}`, '_blank');
        }
        alert('Enviado com sucesso!');
        window.location.reload();
      } else {
        erroFormulario.textContent = 'Erro ao enviar. Tente novamente.';
        erroFormulario.classList.remove('hidden');
      }
    })
    .catch(() => {
      erroFormulario.textContent = 'Erro de conexão. Tente novamente.';
      erroFormulario.classList.remove('hidden');
    })
    .finally(() => {
      btnEnviar.disabled = false;
      btnEnviar.textContent = 'Enviar';
    });
  });
}