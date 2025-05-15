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

  const form = document.getElementById('loginForm');
  const submitButton = document.getElementById('submitButton');
  const cancelButton = document.getElementById('cancelButton');
  
  const errorMessages = {
    required: 'Это поле обязательно для заполнения',
    email: 'Пожалуйста, введите корректный email',
    passwordLength: 'Пароль должен быть не менее 6 символов'
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
    
    if (fieldName === 'password' && value !== '') {
      if (value.length < 6) {
        errorElement.textContent = errorMessages.passwordLength;
        return false;
      }
    }
    
    errorElement.textContent = '';
    return true;
  }

  const inputs = form.querySelectorAll('input[type="email"], input[type="password"]');
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
      alert('Вход выполнен успешно!');
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
    
    window.location.href = "main.html";
  });
});