class XMLLoader {
    /**
      @param {string} url
      @returns {Promise<Document>}
    */
    static async loadXML(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Не удалось загрузить XML-файл: ${response.status}`);
            }
            const text = await response.text();
            const parser = new DOMParser();
            return parser.parseFromString(text, 'application/xml');
        } catch (error) {
            console.error('Ошибка при загрузке XML:', error);
            throw error;
        }
    }

    /**
      @param {Element} element
      @returns {Object}
     */
    static xmlElementToObject(element) {
        const obj = {};
        
        for (const attr of element.attributes) {
            obj[`@${attr.name}`] = attr.value;
        }
        
        for (const child of element.children) {
            const name = child.tagName;
            
            if (child.children.length === 0) {
                const value = child.textContent.trim();
                
                if (obj[name] !== undefined) {
                    if (!Array.isArray(obj[name])) {
                        obj[name] = [obj[name]];
                    }
                    obj[name].push(value);
                } else {
                    obj[name] = value;
                }
            } else {
                const childObj = this.xmlElementToObject(child);
                
                if (obj[name] !== undefined) {
                    if (!Array.isArray(obj[name])) {
                        obj[name] = [obj[name]];
                    }
                    obj[name].push(childObj);
                } else {
                    obj[name] = childObj;
                }
            }
        }
        
        return obj;
    }

    /**
      @param {string} url
      @returns {Promise<Object>}
     */
    static async loadXMLAsObject(url) {
        const xmlDoc = await this.loadXML(url);
        return this.xmlElementToObject(xmlDoc.documentElement);
    }

    /**
      @returns {Promise<Array>}
     */
    static async loadTariffs() {
        try {
            const tariffsObj = await this.loadXMLAsObject('../data/tariffs.xml');
            return Array.isArray(tariffsObj.tariff) 
                ? tariffsObj.tariff 
                : [tariffsObj.tariff];
        } catch (error) {
            console.error('Ошибка при загрузке тарифов:', error);
            return [];
        }
    }

    /**
      @returns {Promise<Array>}
     */
    static async loadCountries() {
        try {
            const countriesObj = await this.loadXMLAsObject('../data/countries.xml');
            return Array.isArray(countriesObj.country) 
                ? countriesObj.country 
                : [countriesObj.country];
        } catch (error) {
            console.error('Ошибка при загрузке стран:', error);
            return [];
        }
    }

    /**
      @returns {Promise<Object>}
     */
    static async loadTrackingStatuses() {
        try {
            const trackingObj = await this.loadXMLAsObject('../data/tracking_statuses.xml');
            const statuses = Array.isArray(trackingObj.statuses.status) 
                ? trackingObj.statuses.status 
                : [trackingObj.statuses.status];
            
            const sampleTracking = Array.isArray(trackingObj.sample_tracking) 
                ? trackingObj.sample_tracking 
                : [trackingObj.sample_tracking];
                
            return {
                statuses,
                sampleTracking
            };
        } catch (error) {
            console.error('Ошибка при загрузке статусов отслеживания:', error);
            return { statuses: [], sampleTracking: [] };
        }
    }

    /**
      @returns {Promise<Array>}
     */
    static async loadServices() {
        try {
            const servicesObj = await this.loadXMLAsObject('../data/services.xml');
            return Array.isArray(servicesObj.service) 
                ? servicesObj.service 
                : [servicesObj.service];
        } catch (error) {
            console.error('Ошибка при загрузке информации об услугах:', error);
            return [];
        }
    }

    /**
      @returns {Promise<Array>}
     */
    static async loadFAQ() {
        try {
            const faqObj = await this.loadXMLAsObject('../data/faq.xml');
            return Array.isArray(faqObj.category) 
                ? faqObj.category 
                : [faqObj.category];
        } catch (error) {
            console.error('Ошибка при загрузке FAQ:', error);
            return [];
        }
    }

    /**
      @param {string} trackingNumber
      @returns {Promise<Object|null>}
     */
    static async findPackageTracking(trackingNumber) {
        try {
            const { sampleTracking } = await this.loadTrackingStatuses();
            const tracking = sampleTracking.find(t => 
                t.tracking_number.toLowerCase() === trackingNumber.toLowerCase()
            );
            return tracking || null;
        } catch (error) {
            console.error('Ошибка при поиске трек-номера:', error);
            return null;
        }
    }
}

window.XMLLoader = XMLLoader; 