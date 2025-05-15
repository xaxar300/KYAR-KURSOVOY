class TariffRenderer {
    /**
      @param {string} containerId
    */
    static async init(containerId) {
        try {
            if (!window.XMLLoader) {
                throw new Error('XMLLoader не найден. Убедитесь, что xml-loader.js загружен до tariff-renderer.js');
            }

            const tariffs = await XMLLoader.loadTariffs();
            if (tariffs.length === 0) {
                console.warn('Тарифы не найдены в XML-файле');
                return;
            }

            const container = document.getElementById(containerId);
            if (!container) {
                throw new Error(`Контейнер с ID "${containerId}" не найден`);
            }

            container.innerHTML = '';

            tariffs.forEach(tariff => {
                const tariffCard = this.createTariffCard(tariff);
                container.appendChild(tariffCard);
            });
        } catch (error) {
            console.error('Ошибка при инициализации отображения тарифов:', error);
        }
    }

    /**
     @param {Object} tariff
     @returns {HTMLElement}
     */
    static createTariffCard(tariff) {
        const card = document.createElement('div');
        card.className = 'tariff-card';
        card.classList.add(`tariff-${tariff.id}`);
        
        if (tariff.color_scheme && tariff.color_scheme.background) {
            card.style.background = tariff.color_scheme.background;
        }

        card.innerHTML = `
            <h3 class="tariff-name">${tariff.name}</h3>
            <p class="tariff-delivery-time">Доставка до Минска ${tariff.delivery_time}*</p>
            <div class="tariff-price">
                <span class="price-value">${tariff.price} ${tariff.price_unit}</span>
                <span class="price-unit">/${tariff.unit_weight}</span>
            </div>
            <div class="tariff-description">
                ${tariff.description}
            </div>
            <div class="tariff-actions">
                <a href="register.html" class="btn btn-primary">Зарегистрироваться</a>
                <a href="#" class="btn btn-secondary calculate-price-btn" data-tariff-id="${tariff.id}">Рассчитать стоимость</a>
            </div>
        `;

        setTimeout(() => {
            const calculateBtn = card.querySelector('.calculate-price-btn');
            if (calculateBtn) {
                calculateBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert(`Калькулятор для тарифа "${tariff.name}" находится в разработке. Для уточнения стоимости, пожалуйста, напишите в личные сообщения.`);
                });
            }
        }, 0);

        return card;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.tariffs-cards')) {
        TariffRenderer.init('tariffs-cards-container');
    }
}); 