document.addEventListener('DOMContentLoaded', function() {
  const togglePasswordButtons = document.querySelectorAll('.password-toggle');
  togglePasswordButtons.forEach(button => {
    button.addEventListener('click', function() {
      const passwordInput = this.parentElement.querySelector('input');
      const eyeIcon = this.querySelector('.eye-icon');
      
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.src = '../img/eye-off0.svg';
      } else {
        passwordInput.type = 'password';
        eyeIcon.src = '../img/eye-off1.svg';
      }
    });
  });

  const phoneInput = document.getElementById('phone');
  phoneInput.addEventListener('input', function() {
    let value = this.value.replace(/\D/g, '');
    
    if (value.length > 0) {
      if (value.length <= 2) {
        value = `(${value}`;
      } else if (value.length <= 5) {
        value = `(${value.substring(0, 2)})${value.substring(2)}`;
      } else if (value.length <= 7) {
        value = `(${value.substring(0, 2)})${value.substring(2, 5)}-${value.substring(5)}`;
      } else {
        value = `(${value.substring(0, 2)})${value.substring(2, 5)}-${value.substring(5, 7)}-${value.substring(7, 9)}`;
      }
    }
    
    this.value = value;
  });

  const form = document.getElementById('registrationForm');
  const submitButton = document.getElementById('submitButton');
  const cancelButton = document.getElementById('cancelButton');
  
  const errorMessages = {
    required: 'Это поле обязательно для заполнения',
    email: 'Пожалуйста, введите корректный email',
    phone: 'Пожалуйста, введите корректный номер телефона',
    passwordMatch: 'Пароли не совпадают',
    passwordLength: 'Пароль должен быть не менее 6 символов',
    terms: 'Вы должны согласиться с условиями'
  };

  function validateInput(field) {
    const fieldName = field.name;
    const value = field.value.trim();
    const errorElement = document.getElementById(`${fieldName}Error`);
    
    if (field.required && value === '') {
      errorElement.textContent = errorMessages.required;
      return false;
    }
    
    if (fieldName === 'email' && value !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorElement.textContent = errorMessages.email;
        return false;
      }
    }
    
    if (fieldName === 'phone' && value !== '') {
      if (value.replace(/\D/g, '').length !== 9) {
        errorElement.textContent = errorMessages.phone;
        return false;
      }
    }
    
    if (fieldName === 'password' && value !== '') {
      if (value.length < 6) {
        errorElement.textContent = errorMessages.passwordLength;
        return false;
      }
    }
    
    if (fieldName === 'confirmPassword' && value !== '') {
      const password = document.getElementById('password').value;
      if (value !== password) {
        errorElement.textContent = errorMessages.passwordMatch;
        return false;
      }
    }
    
    if (fieldName === 'termsCheckbox') {
      const termsError = document.getElementById('termsError');
      if (!field.checked) {
        termsError.textContent = errorMessages.terms;
        return false;
      } else {
        termsError.textContent = '';
      }
      return field.checked;
    }
    
    errorElement.textContent = '';
    return true;
  }

  const inputs = form.querySelectorAll('input');
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateInput(input);
    });
    
    input.addEventListener('input', () => {
      if (input.value.trim() !== '') {
        validateInput(input);
      }
    });
  });

  submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    
    let isValid = true;
    
    inputs.forEach(input => {
      if (!validateInput(input)) {
        isValid = false;
      }
    });
    
    if (isValid) {
      alert('Форма успешно отправлена!');
    } else {
      const firstError = document.querySelector('.error-message:not(:empty)');
      if (firstError) {
        firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  cancelButton.addEventListener('click', function() {
    form.reset();
    
    document.querySelectorAll('.error-message').forEach(error => {
      error.textContent = '';
    });
  });
});