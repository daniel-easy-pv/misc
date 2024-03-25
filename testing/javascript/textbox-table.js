document.addEventListener('DOMContentLoaded', function () {
  const table = document.querySelector('.gw-textbox-table');
  const addRowButton = document.getElementById('addRow');

  // Add Row Button Click Event
  addRowButton.addEventListener('click', function () {
    addRow();
  });

  // Remove Row Button Click Event
  const removeButtons = document.querySelectorAll('.remove-row');
  removeButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      removeRow(button.closest('tr'));
    });
  });

  // Function to add a new row to the table by duplicating the last row
  // Function to add a new row to the table by duplicating the last row
  function addRow() {
    const tbody = table.querySelector('tbody');
    const lastRow = tbody.rows[tbody.rows.length - 2]; // Get the last row (excluding the Add Row button)

    if (lastRow) {
      const newRow = lastRow.cloneNode(true); // Clone the last row
      tbody.insertBefore(newRow, tbody.lastElementChild); // Insert the cloned row above the Add Row button
      
      // Reattach the event listener to the Remove Row button in the new row
      const removeButton = newRow.querySelector('.remove-row');
      removeButton.addEventListener('click', function () {
        removeRow(newRow);
      });

      updateRemoveButtons();
    }
}


  // Function to remove a row from the table
  function removeRow(row) {
    const tbody = table.querySelector('tbody');
    if (tbody.rows.length > 2) {
      row.remove();
    }

    updateRemoveButtons();
  }

  // Function to update the state of Remove buttons
  function updateRemoveButtons() {
    const tbody = table.querySelector('tbody');
    var removeButtons = document.querySelectorAll('.remove-row');

    if (tbody.rows.length <= 2) {
      removeButtons.forEach(function (button) {
        button.disabled = true;
      });
    } else {
      removeButtons.forEach(function (button) {
        button.disabled = false;
      });
    }
  }
});
