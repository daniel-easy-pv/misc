document.addEventListener('DOMContentLoaded', function() {
    const input = document.querySelector('.textbox-and-icon input');
    const errorText = document.querySelector('.textbox-error-text');
  
    input.addEventListener('input', function() {
      if (input.validity.valid) {
        errorText.style.display = 'none';
      } else {
        errorText.style.display = 'block';
      }
    });
  });
  