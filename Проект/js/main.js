document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    
    initTrackingSystem();
    
    initCompanyInfo();
    
    initFaqAccordion();
    
    initLegalModals();
});

function initMobileMenu() {
    console.log('Инициализация мобильного меню...');
    
    const burgerMenu = document.querySelector('.burger-menu');
    const mobileNav = document.querySelector('.mobile-nav');
    
    console.log('Найден элемент бургер-меню:', burgerMenu);
    console.log('Найден элемент мобильной навигации:', mobileNav);
    
    if (!burgerMenu || !mobileNav) {
        console.error('Не найдены элементы бургер-меню или мобильной навигации');
        return;
    }
    
    burgerMenu.setAttribute('role', 'button');
    burgerMenu.setAttribute('aria-expanded', 'false');
    burgerMenu.setAttribute('aria-label', 'Открыть меню');
    
    burgerMenu.addEventListener('click', function(e) {
        e.preventDefault();
        console.log('Клик по бургер-меню');
        
        mobileNav.classList.toggle('active');
        burgerMenu.classList.toggle('active');
        
        const isExpanded = mobileNav.classList.contains('active');
        burgerMenu.setAttribute('aria-expanded', isExpanded);
        burgerMenu.setAttribute('aria-label', isExpanded ? 'Закрыть меню' : 'Открыть меню');
    });
    
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', function() {
            console.log('Клик по ссылке в мобильном меню');
            mobileNav.classList.remove('active');
            burgerMenu.classList.remove('active');
            burgerMenu.setAttribute('aria-expanded', 'false');
        });
    });
    
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.burger-menu') && 
            !e.target.closest('.mobile-nav') && 
            mobileNav.classList.contains('active')) {
            
            console.log('Клик вне меню, закрываем');
            mobileNav.classList.remove('active');
            burgerMenu.classList.remove('active');
            burgerMenu.setAttribute('aria-expanded', 'false');
        }
    });
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            console.log('Нажата клавиша Escape, закрываем меню');
            mobileNav.classList.remove('active');
            burgerMenu.classList.remove('active');
            burgerMenu.setAttribute('aria-expanded', 'false');
        }
    });
}

function initTrackingSystem() {
    console.log('Инициализация системы отслеживания...');
    
    const trackButton = document.getElementById('track-package-button');
    const trackInput = document.getElementById('track-package-input');
    const trackingSection = document.querySelector('.track-package-section');
    
    if (!trackButton) {
        console.error('Кнопка отслеживания не найдена на странице');
        return;
    }
    
    if (!trackInput) {
        console.error('Поле ввода трек-номера не найдено на странице');
        return;
    }
    
    if (!trackingSection) {
        console.error('Секция отслеживания не найдена на странице');
        return;
    }
    
    console.log('Все необходимые элементы найдены');
    
    let trackingContainer = document.getElementById('tracking-container');
    
    if (!trackingContainer) {
        console.log('Создаю новый контейнер отслеживания');
        trackingContainer = document.createElement('div');
        trackingContainer.id = 'tracking-container';
        trackingContainer.className = 'tracking-results';
        trackingContainer.style.display = 'none';
        trackingSection.appendChild(trackingContainer);
    }
    
    addTrackingStyles();
    
    trackButton.addEventListener('click', function() {
        console.log('Кнопка отслеживания нажата');
        
        const trackNumber = trackInput.value.trim();
        const trackPattern = /^IMP24-\d{6}$/i;
        
        if (!trackPattern.test(trackNumber)) {
            alert('Пожалуйста, введите трек-номер в формате IMP24-000000');
            trackInput.focus();
            return;
        }
        
        console.log('Трек-номер валиден:', trackNumber);
        
        showTrackingResults(trackNumber, trackingContainer);
    });
    
    trackInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            trackButton.click();
        }
    });
}

function addTrackingStyles() {
    console.log('Добавление стилей для отслеживания');
    
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .tracking-results {
            background-color: #f8f9fa;
            border-radius: 10px;
            border: 2px solid #e9ecef;
            padding: 25px;
            margin-top: 20px;
            font-family: 'Geist Mono', monospace;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            max-width: 100%;
            overflow: hidden;
        }
        
        .tracking-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #e9ecef;
            padding-bottom: 15px;
        }
        
        .tracking-title {
            font-size: 1.5rem;
            font-weight: 700;
            color: #212529;
            margin: 0;
        }
        
        .tracking-close {
            font-size: 1.5rem;
            font-weight: 700;
            color: #212529;
            cursor: pointer;
            transition: color 0.3s ease;
        }
        
        .tracking-close:hover {
            color: #64fcd9;
        }
        
        .tracking-info {
            padding: 10px 0;
        }
        
        .tracking-number {
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 20px;
            color: #333;
        }
        
        .tracking-status-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 30px 0;
            position: relative;
        }
        
        .tracking-status-bar::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 4px;
            background-color: #e9ecef;
            transform: translateY(-50%);
            z-index: 1;
        }
        
        .status-step {
            display: flex;
            flex-direction: column;
            align-items: center;
            position: relative;
            z-index: 2;
            width: 20%;
        }
        
        .status-circle {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: #dee2e6;
            margin-bottom: 8px;
            transition: background-color 0.3s ease;
            border: 2px solid #fff;
        }
        
        .status-step.active .status-circle {
            background-color: #64fcd9;
        }
        
        .status-label {
            font-size: 0.85rem;
            text-align: center;
            color: #6c757d;
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .status-step.active .status-label {
            color: #212529;
            font-weight: 600;
        }
        
        .tracking-timeline {
            margin-top: 30px;
            border-top: 1px solid #e9ecef;
            padding-top: 20px;
        }
        
        .tracking-table {
            width: 100%;
            border-collapse: collapse;
        }
        
        .tracking-table th {
            text-align: left;
            padding: 12px 15px;
            background-color: #f1f3f5;
            font-weight: 600;
            color: #212529;
            border-bottom: 1px solid #e9ecef;
        }
        
        .tracking-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #e9ecef;
            color: #495057;
        }
        
        .tracking-table tr:last-child td {
            border-bottom: none;
        }
        
        @media (max-width: 768px) {
            .tracking-results {
                padding: 15px;
            }
            
            .tracking-title {
                font-size: 1.3rem;
            }
            
            .status-label {
                font-size: 0.7rem;
            }
            
            .tracking-table th,
            .tracking-table td {
                padding: 8px 10px;
                font-size: 0.9rem;
            }
        }
        
        @media (max-width: 576px) {
            .status-circle {
                width: 20px;
                height: 20px;
            }
            
            .status-label {
                font-size: 0.6rem;
            }
            
            .tracking-table th,
            .tracking-table td {
                padding: 6px 8px;
                font-size: 0.8rem;
            }
        }
    `;
    
    document.head.appendChild(styleElement);
}

function showTrackingResults(trackNumber, container) {
    console.log('Отображение результатов отслеживания для:', trackNumber);
    
    const statuses = ['order', 'processing', 'shipped', 'customs', 'delivered'];
    const statusLabels = ['Заказ оформлен', 'В обработке', 'Отправлено', 'Таможня', 'Доставлено'];
    const currentStatusIndex = Math.floor(Math.random() * 5);
    
    console.log('Текущий статус индекс:', currentStatusIndex);
    
    const events = [];
    const today = new Date();
    
    for (let i = 0; i <= currentStatusIndex; i++) {
        const daysAgo = (currentStatusIndex - i) * 3;
        const eventDate = new Date(today);
        eventDate.setDate(today.getDate() - daysAgo);
        
        const locations = ['Минск, Беларусь', 'Пекин, Китай', 'Шанхай, Китай', 'Таможня Беларуси', 'Минск, Беларусь'];
        
        events.push({
            date: eventDate.toLocaleDateString(),
            status: statusLabels[i],
            location: locations[i]
        });
    }
    
    container.innerHTML = `
        <div class="tracking-header">
            <h3 class="tracking-title">Информация о посылке</h3>
            <span class="tracking-close">&times;</span>
        </div>
        <div class="tracking-info">
            <div class="tracking-number">Трек-номер: <strong>${trackNumber}</strong></div>
            <div class="tracking-status-bar">
                ${statuses.map((status, index) => `
                    <div class="status-step ${index <= currentStatusIndex ? 'active' : ''}">
                        <div class="status-circle"></div>
                        <div class="status-label">${statusLabels[index]}</div>
                    </div>
                `).join('')}
            </div>
            <div class="tracking-timeline">
                <table class="tracking-table">
                    <thead>
                        <tr>
                            <th>Дата</th>
                            <th>Статус</th>
                            <th>Местоположение</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${events.map(event => `
                            <tr>
                                <td>${event.date}</td>
                                <td>${event.status}</td>
                                <td>${event.location}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
    
    container.style.display = 'block';
    
    const closeButton = container.querySelector('.tracking-close');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            container.style.display = 'none';
        });
    }
    
    console.log('Результаты отслеживания успешно отображены');
    
    container.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function initCompanyInfo() {
    const learnMoreBtn = document.querySelector('.learn-more-btn');
    if (learnMoreBtn) {
      const modal = document.createElement('div');
      modal.className = 'info-modal';
      modal.innerHTML = `
        <div class="info-modal-content">
          <span class="info-modal-close">&times;</span>
          <h2>О компании Import24</h2>
          <p>Компания Import24 основана в 2023 году группой энтузиастов международной логистики. Наша миссия — сделать процесс доставки товаров из разных точек мира в Беларусь максимально простым, быстрым и надежным.</p>
          <p>Мы специализируемся на доставке товаров с популярных маркетплейсов Китая и Европы, таких как Poizon, TaoBao, Vinted, Grailed и многих других. Благодаря налаженным партнерским отношениям с логистическими компаниями, мы обеспечиваем оптимальные маршруты доставки и конкурентные цены.</p>
          <p>Наши преимущества:</p>
          <ul>
            <li>Официальная доставка с соблюдением всех таможенных требований</li>
            <li>Прозрачная система отслеживания заказов</li>
            <li>Гибкие тарифы для разных типов грузов</li>
            <li>Персональный подход к каждому клиенту</li>
            <li>Опытная команда специалистов по логистике</li>
          </ul>
          <p>Более 15 000 клиентов уже доверили нам свои заказы. Присоединяйтесь к Import24 — вашему надежному партнеру в мире международной доставки!</p>
        </div>
      `;
      document.body.appendChild(modal);
      
      const style = document.createElement('style');
      style.textContent = `
        .info-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.7);
          z-index: 1000;
          overflow: auto;
        }
        
        .info-modal-content {
          background-color: white;
          margin: 5% auto;
          padding: 30px;
          width: 80%;
          max-width: 800px;
          border-radius: 20px;
          border: 2px solid #000;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          font-family: 'Geist Mono', monospace;
        }
        
        .info-modal-content h2 {
          color: #000;
          font-size: 32px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        
        .info-modal-content p {
          font-size: 18px;
          line-height: 1.5;
          margin-bottom: 15px;
        }
        
        .info-modal-content ul {
          margin-bottom: 20px;
          padding-left: 20px;
        }
        
        .info-modal-content li {
          margin-bottom: 8px;
          font-size: 16px;
        }
        
        .info-modal-close {
          color: #000;
          float: right;
          font-size: 32px;
          font-weight: bold;
          cursor: pointer;
          margin-top: -10px;
        }
        
        .info-modal-close:hover {
          color: #64fcd9;
        }
        
        @media (max-width: 768px) {
          .info-modal-content {
            width: 90%;
            padding: 20px;
            margin: 10% auto;
          }
          
          .info-modal-content h2 {
            font-size: 24px;
          }
          
          .info-modal-content p, .info-modal-content li {
            font-size: 14px;
          }
        }
      `;
      document.head.appendChild(style);
      
      learnMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
      });
      
      const closeButton = modal.querySelector('.info-modal-close');
      closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
      });
      
      window.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      });
    }
}

function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
      const question = item.querySelector('.faq-question');
      
      question.addEventListener('click', () => {
        faqItems.forEach(otherItem => {
          if (otherItem !== item && otherItem.classList.contains('active')) {
            otherItem.classList.remove('active');
          }
        });
        
        item.classList.toggle('active');
      });
    });
}

function initLegalModals() {
    const termsLink = document.getElementById('terms-link');
    const privacyLink = document.getElementById('privacy-link');
    const termsModal = document.getElementById('terms-modal');
    const privacyModal = document.getElementById('privacy-modal');
    const closeButtons = document.querySelectorAll('.legal-modal-close');
    
    function openModal(modal) {
      if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; 
      }
    }
    
    function closeModal(modal) {
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; 
      }
    }
    
    if (termsLink) {
      termsLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(termsModal);
      });
    }
    
    if (privacyLink) {
      privacyLink.addEventListener('click', function(e) {
        e.preventDefault();
        openModal(privacyModal);
      });
    }
    
    closeButtons.forEach(button => {
      button.addEventListener('click', function() {
        const modal = this.closest('.legal-modal');
        closeModal(modal);
      });
    });
    
    window.addEventListener('click', function(e) {
      if (e.target.classList.contains('legal-modal')) {
        closeModal(e.target);
      }
    });
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const openModals = document.querySelectorAll('.legal-modal[style="display: block;"]');
        openModals.forEach(modal => {
          closeModal(modal);
        });
      }
    });
}