# 🌤️ MoodDay

O **MoodDay** é uma aplicação interativa de registro diário de humor e notas pessoais. O sistema permite ao usuário monitorar seu bem-estar ao longo do tempo, gerando estatísticas visuais através de gráficos e permitindo a exportação dos dados em formato PDF, com integração em tempo real com dados climáticos locais.

---

## 🔗 Link da Aplicação Online
🚀 [Clique aqui para acessar o MoodDay na Vercel](https://moodday-react.vercel.app/)

---

## ⚙️ Tecnologias Utilizadas
* **React.js** (com Vite) - Biblioteca principal para construção da interface reativa e componentização.
* **JavaScript (ES6+)** - Lógica de manipulação de estados e consumo de APIs.
* **CSS3** - Estilização moderna utilizando variáveis, efeitos de Glassmorphism (`backdrop-filter`) e design responsivo.
* **Chart.js** - Biblioteca utilizada para renderização dinâmica do gráfico de barras com o resumo semanal de emoções.
* **jsPDF** - Biblioteca para geração e paginação automatizada do relatório de registros em formato PDF.
* **OpenWeatherMap API** - Integração de API externa para capturar o clima atual em tempo real da cidade de Recife-PE.

---

## 💡 Funcionalidades
* **Registro de Humor:** Seleção intuitiva de estados emocionais por meio de emojis.
* **Notas Diárias:** Campo de texto livre para detalhar os acontecimentos do dia.
* **Clima em Tempo Real:** Captura automática da temperatura e condições climáticas de Recife no momento do registro.
* **Histórico Persistente:** Armazenamento local dos dados utilizando `LocalStorage` (os dados não somem ao fechar o navegador).
* **Edição e Exclusão:** Gerenciamento completo das notas direto na linha do tempo.
* **Filtro Avançado:** Filtragem de histórico por emoções específicas.
* **Gráfico Estatístico:** Gráfico de barras que exibe o somatório e a frequência de cada humor registrado.
* **Exportação em PDF:** Download de um relatório formatado com as datas, notas e climas salvos, com sistema de quebra de página inteligente.

---

## 🧠 Principais Aprendizados
* **Migração de Ecossistema:** Transição prática de uma aplicação construída em JavaScript Vanilla (DOM estruturado manualmente) para o modelo declarativo do **React.js**.
* **Gerenciamento de Estado Global do Componente:** Uso estratégico dos Hooks `useState` para controle de inputs, listas e filtros, e `useEffect` para ciclos de vida e persistência de dados.
* **Manipulação de Bibliotecas Complexas no React:** Integração e limpeza de instâncias do *Chart.js* usando referências do DOM (`useRef`) para evitar vazamentos de memória (memory leaks) e sobreposição de gráficos.
* **Consumo de APIs Assíncronas:** Uso avançado de `Async/Await` e `Fetch API` para comunicação com serviços externos de previsão do tempo, tratando fallbacks de erros de forma amigável para o usuário.
