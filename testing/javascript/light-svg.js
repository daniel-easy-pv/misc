

  function invertIconsIfOnPrimaryIsWhite() {
    const onPrimaryColor = getComputedStyle(document.documentElement).getPropertyValue('--on-primary').trim();
    const icons = document.querySelectorAll('.icon-on-primary');
    
  
    if (onPrimaryColor === '#FFFFFF') {
      // Invert icons if --on-primary is white
      icons.forEach(icon => {
        icon.style.filter = 'invert(1)';
      });
    } else if (onPrimaryColor === '#000000' || onPrimaryColor === '#151515') {
      // Revert inversion if --on-primary is black or a dark color
      icons.forEach(icon => {
        icon.style.filter = 'invert(0)';
      });
    }
  }
