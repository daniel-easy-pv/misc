document.addEventListener('DOMContentLoaded', function () {
    // Get all context menu triggers
    const contextMenuTriggers = document.querySelectorAll('.context-menu-trigger');
  
    contextMenuTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (event) {
        const menuId = trigger.dataset.menuId;
        const dropdown = document.getElementById(menuId);
  
        // Close all other open menus
        document.querySelectorAll('.context-menu-dropdown').forEach(function (menu) {
          if (menu !== dropdown) {
            menu.style.display = 'none';
          }
        });
  
        // Toggle the selected menu
        dropdown.style.display = (dropdown.style.display === 'flex') ? 'none' : 'flex';
  
        // Prevent the click event from propagating, which would trigger the document click event
        event.stopPropagation();
      });
    });
  
    // Add this line to close all menus on page load
    document.querySelectorAll('.context-menu-dropdown').forEach(function (menu) {
      menu.style.display = 'none';
    });
  
    // Add event listeners to close the menu when an option is selected
    document.querySelectorAll('.context-menu-option').forEach(function (option) {
      option.addEventListener('click', function () {
        const dropdown = option.closest('.context-menu-dropdown');
        dropdown.style.display = 'none';
      });
    });
  
    // Add an event listener to the document to close the menu on a click outside any menu
    document.addEventListener('click', function (event) {
      document.querySelectorAll('.context-menu-dropdown').forEach(function (menu) {
        if (!menu.contains(event.target)) {
          menu.style.display = 'none';
        }
      });
    });
  });
  