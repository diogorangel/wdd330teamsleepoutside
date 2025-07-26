// src/js/Alert.js

// Exporta a classe Alert como padrão
export default class Alert {
  constructor() {
    this.alerts = []; // Array para armazenar os dados dos alertas
    this.alertContainer = null; // Elemento HTML que conterá todos os alertas
  }

  // Método assíncrono para inicializar o sistema de alertas
  async init() {
    await this.loadAlerts(); // Carrega os alertas do arquivo JSON
    this.renderAlerts(); // Renderiza os alertas na página
  }

  // Método assíncrono para carregar os alertas do arquivo JSON
  async loadAlerts() {
    try {
      // Faz uma requisição para o arquivo alerts.json
      // Certifique-se de que o caminho está correto em relação ao seu servidor web
      const response = await fetch('../json/alerts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.alerts = await response.json(); // Converte a resposta para JSON
    } catch (error) {
      console.error('Error loading alerts:', error);
      this.alerts = []; // Garante que alerts seja um array vazio em caso de erro
    }
  }

  // Método para renderizar os alertas na página
  renderAlerts() {
    // Verifica se há alertas para exibir
    if (this.alerts.length === 0) {
      return; // Não faz nada se não houver alertas
    }

    // Cria o elemento <section class="alert-list">
    this.alertContainer = document.createElement('section');
    this.alertContainer.classList.add('alert-list');

    // Itera sobre cada alerta e cria um <p> para ele
    this.alerts.forEach(alert => {
      const alertParagraph = document.createElement('p');
      alertParagraph.textContent = alert.message; // Define o texto da mensagem

      // Aplica as cores de fundo e de texto especificadas
      if (alert.background) {
        alertParagraph.style.backgroundColor = alert.background;
      }
      if (alert.color) {
        alertParagraph.style.color = alert.color;
      }

      this.alertContainer.appendChild(alertParagraph); // Adiciona o parágrafo ao container
    });

    // Prepend o container de alertas ao elemento <main> na página index.html
    const mainElement = document.querySelector('main');
    if (mainElement) {
      mainElement.prepend(this.alertContainer);
    } else {
      console.warn('Main element not found. Alerts cannot be prepended.');
    }
  }
}

// Opcional: Instanciar e inicializar a classe Alert imediatamente se este módulo for importado
// const alertManager = new Alert();
// alertManager.init();
