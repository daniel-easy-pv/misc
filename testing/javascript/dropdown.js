// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', addListenersToDropdowns);

function addListenersToDropdowns () {
  // Find the dropdown elements inside the modal
  const dropdowns = document.querySelectorAll('.gw-dropdown');

  dropdowns.forEach(function (dropdown) {
    const optionsList = dropdown.querySelector('.options');
    const selectedOption = dropdown.querySelector('.selected-option');

    dropdown.addEventListener('click', function (e) {
      const isOptionClicked = e.target.tagName === 'LI';
      const isDropdownClicked = e.target === dropdown && dropdown.classList.contains('open');

      if (isOptionClicked || isDropdownClicked) {
        handleOptionSelection(e.target);
        collapseDropdown();
      } else {
        toggleDropdown();
      }
    });

    // Close the dropdown when clicking outside
    document.addEventListener('click', function (e) {
      if (!dropdown.contains(e.target)) {
        collapseDropdown();
      }
    });

    function handleOptionSelection(selectedItem) {
      const selectedText = selectedItem.textContent;
      // Update selected option text
      selectedOption.textContent = selectedText;

      // Remove 'selected' class from previously selected option
      const previousSelectedOption = optionsList.querySelector('.selected');
      if (previousSelectedOption) {
        previousSelectedOption.classList.remove('selected');
      }

      // Add 'selected' class to the newly selected option
      selectedItem.classList.add('selected');

      // Update text color immediately
      selectedOption.style.color = selectedText === 'Placeholder' ?
        'var(--neutral-400, #C6C6C6)' : 'black';
    }

    function collapseDropdown() {
      dropdown.classList.remove('open');
      optionsList.style.display = 'none';

      // Remove focus from the dropdown
      dropdown.blur();
    }

    function toggleDropdown() {
      dropdown.classList.toggle('open');
      optionsList.style.display = dropdown.classList.contains('open') ? 'block' : 'none';

      // Update text color immediately
      selectedOption.style.color = selectedOption.textContent === 'Placeholder' ?
        'var(--neutral-400, #C6C6C6)' : 'black';
    }
  });
}