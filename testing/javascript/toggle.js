document.addEventListener('DOMContentLoaded', function() {
    // Get all toggle switch containers on the page
    const parentContainers = document.querySelectorAll('.gw-toggle-switch-container');

    parentContainers.forEach(function(parentContainer) {
        const checkbox = parentContainer.querySelector('.toggle-switch-checkbox');

        // Check if the checkbox is disabled
        if (checkbox.disabled) {
            // Apply the disabled style to the parent container
            parentContainer.classList.add('disabled-style');
        }

        // Optional: Add an event listener to dynamically handle changes to the disabled state
        checkbox.addEventListener('change', function() {
            if (checkbox.disabled) {
                parentContainer.classList.add('disabled-style');
            } else {
                parentContainer.classList.remove('disabled-style');
            }
        });
    });
});
