  class TrackingService {
    /**
      @param {string} trackInputId
      @param {string} trackButtonId
      @param {string} trackContainerId 
     */
    static init(trackInputId, trackButtonId, trackContainerId) {
        try {
            this.trackInput = document.getElementById(trackInputId);
            this.trackButton = document.getElementById(trackButtonId);
            this.trackContainer = document.getElementById(trackContainerId);
            
            if (!this.trackInput || !this.trackButton) {
                console.warn('Элементы отслеживания не найдены на странице');
                return;
            }
            
            this.trackButton.addEventListener('click', () => this.trackPackage());
            
            this.trackInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.trackPackage();
                }
            });
        } catch (error) {
            console.error('Ошибка при инициализации сервиса отслеживания:', error);
        }
    }
    
    static async trackPackage() {
        try {
            if (!window.XMLLoader) {
                throw new Error('XMLLoader не найден. Убедитесь, что xml-loader.js загружен до tracking-service.js');
            }
            
            const trackNumber = this.trackInput.value.trim();
            const trackPattern = /^IMP24-\d{6}$/i;
            
            if (!trackPattern.test(trackNumber)) {
                alert('Пожалуйста, введите трек-номер в формате IMP24-000000');
                this.trackInput.focus();
                return;
            }
            
            this.showLoading();
            
            const trackingData = await XMLLoader.findPackageTracking(trackNumber);
            
            if (!trackingData) {
                this.showNotFound(trackNumber);
                return;
            }
            
            const { statuses } = await XMLLoader.loadTrackingStatuses();
            
            this.showTrackingResults(trackingData, statuses);
        } catch (error) {
            console.error('Ошибка при отслеживании посылки:', error);
            this.showError();
        }
    }
    
    static showLoading() {
        if (!this.trackContainer) return;
        
        this.trackContainer.innerHTML = `
            <div class="tracking-loading">
                <div class="loading-spinner"></div>
                <p>Загрузка информации о посылке...</p>
            </div>
        `;
        
        this.trackContainer.style.display = 'block';
    }
    
    /**
      @param {string} trackNumber
     */
    static showNotFound(trackNumber) {
        if (!this.trackContainer) return;
        
        this.trackContainer.innerHTML = `
            <div class="tracking-not-found">
                <h3>Посылка не найдена</h3>
                <p>Посылка с трек-номером ${trackNumber} не найдена в системе.</p>
                <p>Пожалуйста, проверьте правильность введенного номера или свяжитесь с службой поддержки.</p>
            </div>
        `;
    }
    
    static showError() {
        if (!this.trackContainer) return;
        
        this.trackContainer.innerHTML = `
            <div class="tracking-error">
                <h3>Ошибка отслеживания</h3>
                <p>Произошла ошибка при отслеживании посылки. Пожалуйста, попробуйте позже.</p>
            </div>
        `;
    }
    
    /**
      @param {Object} trackingData 
      @param {Array} statusesData
     */
    static showTrackingResults(trackingData, statusesData) {
        if (!this.trackContainer) return;
        
        const statusMap = {};
        statusesData.forEach(status => {
            statusMap[status.id] = status;
        });
        
        const currentStatus = trackingData.current_status;
        
        let statusBarHTML = '';
        const statuses = ['order', 'processing', 'shipped', 'customs', 'delivered'];
        
        statuses.forEach(statusId => {
            const isActive = this.isStatusActive(statusId, currentStatus, statuses);
            const statusName = statusMap[statusId]?.name || statusId;
            
            statusBarHTML += `
                <div class="status-item ${isActive ? 'active' : ''}" data-status="${statusId}">
                    <div class="status-icon"></div>
                    <div class="status-text">${statusName}</div>
                </div>
            `;
        });
        
        let eventsHTML = '';
        if (trackingData.events && trackingData.events.event) {
            const events = Array.isArray(trackingData.events.event)
                ? trackingData.events.event
                : [trackingData.events.event];
                
            events.reverse().forEach(event => {
                eventsHTML += `
                    <tr>
                        <td>${event.date}</td>
                        <td>${statusMap[event.status]?.name || event.status}</td>
                        <td>${event.location}</td>
                    </tr>
                `;
            });
        }
        
        this.trackContainer.innerHTML = `
            <div class="tracking-panel-content">
                <div class="tracking-header">
                    <h3 class="tracking-title">Информация о посылке</h3>
                    <span class="tracking-close">&times;</span>
                </div>
                <div class="tracking-info">
                    <div class="tracking-number-display">Трек-номер: <span id="display-track-number">${trackingData.tracking_number}</span></div>
                    <div class="tracking-status-bar">
                        ${statusBarHTML}
                    </div>
                    <div class="tracking-details">
                        <table class="tracking-table">
                            <thead>
                                <tr>
                                    <th>Дата</th>
                                    <th>Статус</th>
                                    <th>Местоположение</th>
                                </tr>
                            </thead>
                            <tbody id="tracking-timeline">
                                ${eventsHTML}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        
        const closeButton = this.trackContainer.querySelector('.tracking-close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.trackContainer.style.display = 'none';
            });
        }
    }
    
    /**
      @param {string} statusId 
      @param {string} currentStatus
      @param {Array} statusOrder
      @returns {boolean} 
     */
    static isStatusActive(statusId, currentStatus, statusOrder) {
        const currentIndex = statusOrder.indexOf(currentStatus);
        const statusIndex = statusOrder.indexOf(statusId);
        
        return statusIndex <= currentIndex;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.track-package-input') && 
        document.querySelector('.track-package-button')) {
        
        let trackingContainer = document.getElementById('tracking-results-container');
        if (!trackingContainer) {
            trackingContainer = document.createElement('div');
            trackingContainer.id = 'tracking-results-container';
            trackingContainer.className = 'tracking-panel';
            
            const style = document.createElement('style');
            style.textContent = `
                .tracking-panel {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.5s ease;
                    background: #f5f5f5;
                    border-radius: 0 0 15px 15px;
                    width: 100%;
                    margin-top: -15px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                    display: none;
                }
                
                .tracking-panel.active {
                    max-height: 800px;
                    margin-bottom: 30px;
                }
                
                .tracking-panel-content {
                    padding: 25px;
                    font-family: 'Geist Mono', monospace;
                }
                
                .tracking-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }
                
                .tracking-title {
                    font-size: 24px;
                    font-weight: 700;
                    margin: 0;
                }
                
                .tracking-close {
                    font-size: 28px;
                    cursor: pointer;
                    color: #000;
                }
                
                .tracking-close:hover {
                    color: #64fcd9;
                }
                
                .tracking-number-display {
                    font-size: 18px;
                    font-weight: 600;
                    margin-bottom: 25px;
                }
                
                .tracking-status-bar {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 30px;
                    position: relative;
                }
                
                .tracking-status-bar:before {
                    content: '';
                    position: absolute;
                    top: 15px;
                    left: 0;
                    width: 100%;
                    height: 4px;
                    background: #d9d9d9;
                    z-index: 1;
                }
                
                .status-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    position: relative;
                    z-index: 2;
                    width: 20%;
                }
                
                .status-icon {
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    background: #d9d9d9;
                    margin-bottom: 10px;
                    border: 3px solid #f5f5f5;
                    box-sizing: border-box;
                }
                
                .status-item.active .status-icon {
                    background: #64fcd9;
                }
                
                .status-text {
                    font-size: 14px;
                    text-align: center;
                    color: #555;
                }
                
                .status-item.active .status-text {
                    color: #000;
                    font-weight: 600;
                }
                
                .tracking-details {
                    margin-top: 20px;
                }
                
                .tracking-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 15px;
                }
                
                .tracking-table th, .tracking-table td {
                    padding: 12px 15px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                
                .tracking-table th {
                    background-color: #f0f0f0;
                    font-weight: 600;
                }
                
                .tracking-table tr:last-child td {
                    border-bottom: none;
                }
                
                .tracking-loading, .tracking-not-found, .tracking-error {
                    padding: 40px 20px;
                    text-align: center;
                }
                
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid #f3f3f3;
                    border-top: 4px solid #64fcd9;
                    border-radius: 50%;
                    margin: 0 auto 20px;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                @media (max-width: 768px) {
                    .tracking-panel-content {
                        padding: 20px 15px;
                    }
                    
                    .tracking-title {
                        font-size: 20px;
                    }
                    
                    .tracking-status-bar {
                        overflow-x: auto;
                        padding-bottom: 5px;
                        margin-bottom: 20px;
                    }
                    
                    .status-text {
                        font-size: 12px;
                    }
                    
                    .tracking-table th, .tracking-table td {
                        padding: 10px;
                        font-size: 14px;
                    }
                }
                
                @media (max-width: 576px) {
                    .tracking-status-bar:before {
                        top: 12px;
                    }
                    
                    .status-icon {
                        width: 24px;
                        height: 24px;
                    }
                    
                    .status-text {
                        font-size: 10px;
                    }
                    
                    .tracking-table th, .tracking-table td {
                        padding: 8px;
                        font-size: 12px;
                    }
                }
            `;
            document.head.appendChild(style);
            
            const trackSection = document.querySelector('.track-package-section');
            if (trackSection) {
                trackSection.appendChild(trackingContainer);
            }
        }
        
        TrackingService.init(
            'track-package-input', 
            'track-package-button', 
            'tracking-results-container'
        );
    }
}); 