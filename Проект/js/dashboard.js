document.addEventListener("DOMContentLoaded", function () {
  updateTimezoneDisplay();
  setInterval(updateTimezoneDisplay, 1000);
  
  function updateTimezoneDisplay() {
    const timezoneItems = document.querySelectorAll('.timezone-item');
    
    if (timezoneItems.length >= 3) {
      const minskTimeElement = timezoneItems[0];
      const beijingTimeElement = timezoneItems[1];
      const warsawTimeElement = timezoneItems[2];
      
      const minskTime = getTimeInTimezone(3); 
      const beijingTime = getTimeInTimezone(8);
      const warsawTime = getTimeInTimezone(getCurrentWarsawOffset()); 
      
      updateTimeDisplay(minskTimeElement, minskTime);
      updateTimeDisplay(beijingTimeElement, beijingTime);
      updateTimeDisplay(warsawTimeElement, warsawTime);
    }
  }
  
  function updateTimeDisplay(element, timeString) {
    const [hours, minutes, seconds] = timeString.split(':');
    
    const hoursMinutes = element.querySelector('.hours-minutes');
    const secondsElement = element.querySelector('.seconds');
    
    if (hoursMinutes && secondsElement) {
      hoursMinutes.textContent = `${hours}:${minutes}`;
      secondsElement.textContent = `:${seconds}`;
      
      secondsElement.style.animation = 'none';
      secondsElement.offsetHeight; 
      secondsElement.style.animation = '';
    }
  }
  
  function getTimeInTimezone(offsetHours) {
    const date = new Date();
    
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    
    const tzTime = new Date(utc + (3600000 * offsetHours));
    
    const hours = tzTime.getHours().toString().padStart(2, '0');
    const minutes = tzTime.getMinutes().toString().padStart(2, '0');
    const seconds = tzTime.getSeconds().toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
  }
  
  function getCurrentWarsawOffset() {
    const date = new Date();
    
    const year = date.getFullYear();
    
    const dstStart = new Date(year, 2, 31); 
    dstStart.setDate(dstStart.getDate() - dstStart.getDay());
    
    const dstEnd = new Date(year, 9, 31); 
    dstEnd.setDate(dstEnd.getDate() - dstEnd.getDay()); 
    
    return (date >= dstStart && date < dstEnd) ? 2 : 1;
  }

  const copyToast = document.getElementById("copyToast");
  const toastMessage = copyToast ? copyToast.querySelector(".toast-message") : null;
  
  function showToast(message, copiedText = null) {
    if (!copyToast) return;
    
    toastMessage.textContent = message || "Текст скопирован!";
    
    if (copiedText) {
      copyToast.classList.add("address-copied");
      toastMessage.setAttribute("data-copied", copiedText);
    } else {
      copyToast.classList.remove("address-copied");
      toastMessage.removeAttribute("data-copied");
    }
    
    copyToast.classList.add("show");
    
    setTimeout(() => {
      copyToast.classList.remove("show");
    }, 3000);
  }

  const copyButtons = document.querySelectorAll(".copy-btn");

  copyButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const textToCopy = this.getAttribute("data-clipboard-text");
      
      const isContact = this.closest(".contact-item") !== null;
      const isAddress = this.closest(".address-item") !== null;
      
      let toastMsg = "Текст скопирован!";
      if (isContact) {
        const contactLabel = this.closest(".contact-item").querySelector(".contact-label");
        if (contactLabel) {
          toastMsg = contactLabel.textContent.replace(":", "") + " скопирован!";
        }
      } else if (isAddress) {
        toastMsg = "Адрес скопирован!";
      }

      if (textToCopy) {
        navigator.clipboard
          .writeText(textToCopy)
          .then(() => {
            const originalImg = this.querySelector("img").src;
            this.querySelector("img").src = "../img/check.svg";

            showToast(toastMsg, textToCopy);

            setTimeout(() => {
              this.querySelector("img").src = originalImg;
            }, 1500);
          })
          .catch((err) => {
            console.error("Could not copy text: ", err);
            showToast("Ошибка при копировании");
          });
      }
    });
  });

  let deliveryBalance = 0;
  let purchaseBalance = 0;
  let promoActivated = false;
  
  function updateBalanceDisplays() {
    const deliveryBalanceDisplay = document.querySelector(".user-dropdown .balance-account:first-child .balance-account-value");
    const purchaseBalanceDisplay = document.querySelector(".user-dropdown .balance-account:last-child .balance-account-value");
    
    const deliveryCardEl = document.querySelector(".delivery-balance .balance-card-amount");
    const purchaseCardEl = document.querySelector(".purchase-balance .balance-card-amount");
    
    if (deliveryBalanceDisplay) deliveryBalanceDisplay.textContent = deliveryBalance.toFixed(2) + "$";
    if (purchaseBalanceDisplay) purchaseBalanceDisplay.textContent = purchaseBalance.toFixed(2) + "$";
    if (deliveryCardEl) deliveryCardEl.textContent = "$" + deliveryBalance.toFixed(2);
    if (purchaseCardEl) purchaseCardEl.textContent = "$" + purchaseBalance.toFixed(2);
  }

  const userProfile = document.querySelector(".user-profile");
  const userDropdown = document.getElementById("userDropdown");

  if (userProfile && userDropdown) {
    userProfile.addEventListener("click", function (e) {
      e.preventDefault();
      userDropdown.classList.toggle("active");
    });

    document.addEventListener("click", function (e) {
      if (!userProfile.contains(e.target) && !userDropdown.contains(e.target)) {
        userDropdown.classList.remove("active");
      }
    });
  }

  const balanceBtn = document.querySelector(".balance-add-btn");
  if (balanceBtn) {
    balanceBtn.addEventListener("click", function() {
      console.log("Balance add button clicked");
    });
  }

  const supportForm = document.querySelector(".support-form");
  const supportNotification = document.getElementById("supportNotification");
  
  if (supportForm) {
    supportForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const telegramInput = document.querySelector(".telegram-input");

      if (telegramInput && telegramInput.value) {
        console.log(
          "Support request submitted with Telegram: ",
          telegramInput.value
        );
        
        telegramInput.value = "";
        
        showSupportNotification();
      } else {
        alert("Пожалуйста, введите ваш Telegram username.");
      }
    });

    const submitBtn = document.querySelector(".support-submit-btn");
    if (submitBtn) {
      submitBtn.addEventListener("click", function () {
        supportForm.dispatchEvent(new Event("submit"));
      });
    }
  }
  
  function showSupportNotification() {
    if (supportNotification) {
      supportNotification.classList.add("show");
      
      setTimeout(() => {
        supportNotification.classList.remove("show");
      }, 5000);
    }
  }

  const promoForm = document.querySelector(".promo-code-form");
  const promoSubmitBtn = document.querySelector(".promo-submit-btn");
  const promoNotification = document.getElementById("promoNotification");

  if (promoForm && promoSubmitBtn) {
    promoSubmitBtn.addEventListener("click", function () {
      const promoInput = document.querySelector(".promo-input");

      if (promoInput && promoInput.value) {
        console.log("Promo code submitted: ", promoInput.value);
        
        showPromoNotification();
        
        promoInput.value = "";
      } else {
        alert("Пожалуйста, введите промокод.");
      }
    });
  }
  
  function showPromoNotification() {
    if (promoNotification) {
      promoActivated = true;
      
      promoNotification.classList.add("show");
      
      setTimeout(() => {
        promoNotification.classList.remove("show");
      }, 5000);
    }
  }

  const paymentModal = document.getElementById("paymentModal");
  const balanceButtons = document.querySelectorAll(".balance-action .btn-primary, .balance-add-btn");
  const closeButton = document.querySelector(".payment-close-btn");
  const paymentMethodStep = document.getElementById("paymentMethodStep");
  const cardPaymentStep = document.getElementById("cardPaymentStep");
  const developmentStep = document.getElementById("developmentStep");
  const successStep = document.getElementById("successStep");
  const paymentMethods = document.querySelectorAll(".payment-method");
  const backButtons = document.querySelectorAll(".back-btn");
  const closeSuccessBtn = document.querySelector(".close-success-btn");
  const cardPaymentForm = document.getElementById("cardPaymentForm");
  
  const cardNumber = document.getElementById("cardNumber");
  const cardExpiry = document.getElementById("cardExpiry");
  const cardCvc = document.getElementById("cardCvc");
  const cardHolder = document.getElementById("cardHolder");
  const cardAmount = document.getElementById("cardAmount");
  const accountSelect = document.getElementById("accountSelect");
  const submitPaymentBtn = document.querySelector(".payment-submit-btn");
  
  if (accountSelect) {
    const purchaseOption = accountSelect.querySelector('option[value="purchase"]');
    if (purchaseOption) {
      purchaseOption.disabled = true;
      purchaseOption.style.display = 'none';
    }
  }
  
  const cardNumberError = document.getElementById("cardNumberError");
  const cardExpiryError = document.getElementById("cardExpiryError");
  const cardCvcError = document.getElementById("cardCvcError");
  const cardHolderError = document.getElementById("cardHolderError");
  
  function showPaymentStep(step) {
    paymentMethodStep.classList.remove("active");
    cardPaymentStep.classList.remove("active");
    developmentStep.classList.remove("active");
    successStep.classList.remove("active");
    
    step.classList.add("active");
  }
  
  balanceButtons.forEach(button => {
    button.addEventListener("click", function() {
      paymentModal.classList.add("active");
      showPaymentStep(paymentMethodStep);
    });
  });
  
  closeButton.addEventListener("click", function() {
    paymentModal.classList.remove("active");
  });
  
  paymentMethods.forEach(method => {
    method.addEventListener("click", function() {
      const paymentMethod = this.getAttribute("data-method");
      
      if (paymentMethod === "card") {
        showPaymentStep(cardPaymentStep);
      } else {
        showPaymentStep(developmentStep);
      }
    });
  });
  
  backButtons.forEach(button => {
    button.addEventListener("click", function() {
      showPaymentStep(paymentMethodStep);
    });
  });
  
  closeSuccessBtn.addEventListener("click", function() {
    paymentModal.classList.remove("active");
  });
  
  cardNumber.addEventListener("input", function() {
    let value = this.value.replace(/\D/g, "");
    let formattedValue = "";
    
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += " ";
      }
      formattedValue += value[i];
    }
    
    this.value = formattedValue;
    validateCardNumber();
  });
  
  cardExpiry.addEventListener("input", function() {
    let value = this.value.replace(/\D/g, "");
    let formattedValue = "";
    
    if (value.length > 0) {
      formattedValue = value.substring(0, 2);
      if (value.length > 2) {
        formattedValue += "/" + value.substring(2, 4);
      }
    }
    
    this.value = formattedValue;
    validateCardExpiry();
  });
  
  cardCvc.addEventListener("input", function() {
    this.value = this.value.replace(/\D/g, "");
    validateCardCvc();
  });
  
  cardHolder.addEventListener("input", function() {
    this.value = this.value.toUpperCase();
    validateCardHolder();
  });
  
  cardAmount.addEventListener("input", validateForm);
  accountSelect.addEventListener("change", validateForm);
  
  function validateCardNumber() {
    const value = cardNumber.value.replace(/\s/g, "");
    
    if (value.length === 0) {
      cardNumberError.textContent = "";
      return false;
    } else if (value.length !== 16) {
      cardNumberError.textContent = "Номер карты должен содержать 16 цифр";
      return false;
    } else {
      cardNumberError.textContent = "";
      return true;
    }
  }
  
  function validateCardExpiry() {
    const value = cardExpiry.value;
    
    if (value.length === 0) {
      cardExpiryError.textContent = "";
      return false;
    } else if (value.length !== 5) {
      cardExpiryError.textContent = "Укажите срок в формате ММ/ГГ";
      return false;
    } else {
      const month = parseInt(value.substring(0, 2));
      if (month < 1 || month > 12) {
        cardExpiryError.textContent = "Неверный месяц (01-12)";
        return false;
      } else {
        cardExpiryError.textContent = "";
        return true;
      }
    }
  }
  
  function validateCardCvc() {
    const value = cardCvc.value;
    
    if (value.length === 0) {
      cardCvcError.textContent = "";
      return false;
    } else if (value.length !== 3) {
      cardCvcError.textContent = "CVC должен содержать 3 цифры";
      return false;
    } else {
      cardCvcError.textContent = "";
      return true;
    }
  }
  
  function validateCardHolder() {
    const value = cardHolder.value;
    
    if (value.length === 0) {
      cardHolderError.textContent = "";
      return false;
    } else if (value.length < 5) {
      cardHolderError.textContent = "Укажите полное имя";
      return false;
    } else {
      cardHolderError.textContent = "";
      return true;
    }
  }
  
  function validateForm() {
    const isCardNumberValid = validateCardNumber();
    const isCardExpiryValid = validateCardExpiry();
    const isCardCvcValid = validateCardCvc();
    const isCardHolderValid = validateCardHolder();
    const isAmountValid = cardAmount.value > 0;
    const isAccountSelected = accountSelect.value !== "";
    
    submitPaymentBtn.disabled = !(
      isCardNumberValid && 
      isCardExpiryValid && 
      isCardCvcValid && 
      isCardHolderValid && 
      isAmountValid && 
      isAccountSelected
    );
  }
  
  const formInputs = [cardNumber, cardExpiry, cardCvc, cardHolder, cardAmount];
  formInputs.forEach(input => {
    input.addEventListener("input", validateForm);
    input.addEventListener("blur", validateForm);
  });
  
  cardPaymentForm.addEventListener("submit", function(e) {
    e.preventDefault();
    
    let amount = parseFloat(cardAmount.value);
    const account = accountSelect.value;
    let bonusApplied = false;
    
    if (promoActivated) {
      const originalAmount = amount;
      amount = amount * 1.1;
      promoActivated = false;
      bonusApplied = true;
      
      const bonusAmount = (amount - originalAmount).toFixed(2);
      document.querySelector("#successStep p").innerHTML = 
        `Ваш баланс был успешно пополнен на сумму $${amount.toFixed(2)}.<br>
        <span style="color: #00C853">Применен бонус: +$${bonusAmount}!</span>`;
    } else {
      document.querySelector("#successStep p").textContent = 
        "Ваш баланс был успешно пополнен.";
    }
    
    if (account === "delivery") {
      deliveryBalance += amount;
    } else if (account === "purchase") {
      purchaseBalance += amount;
    }
    
    updateBalanceDisplays();
    
    showPaymentStep(successStep);
    
    cardPaymentForm.reset();
    validateForm();
  });
  
  updateBalanceDisplays();
  validateForm();
});