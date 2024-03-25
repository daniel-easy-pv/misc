function updateClasses(element) {
    // Get the position and size of the div relative to the viewport
    var rect = element.getBoundingClientRect();

    // Check if the element has the 'small' or 'x-large' class
    var isSmall = element.classList.contains('small');
    var isXLarge = element.classList.contains('x-large');

    // Set the default width
    var defaultWidth = 25 * 16; // Default width

    // Adjust width based on classes
    var width = isSmall ? 15 * 16 : (isXLarge ? 35 * 15 : defaultWidth);

    // Calculate distances from each edge of the viewport
    var distanceFromTop = rect.top - 64;
    var distanceFromLeft = rect.left;
    var distanceFromRight = window.innerWidth - (rect.left + width);
    var distanceFromBottom = window.innerHeight - (rect.top + rect.height);

    // Check conditions and add/remove classes accordingly
    if (distanceFromRight < 0) {
        element.classList.add('left');
        element.classList.remove('right');
    } else if (distanceFromLeft < 0) {
        element.classList.add('right');
        element.classList.remove('left');
    } else {
        element.classList.remove('left');
        element.classList.remove('right');
    }

    if (distanceFromTop < rect.height) {
        element.classList.add('below');
        element.classList.remove('above');
    } else if (distanceFromBottom < rect.height) {
        element.classList.remove('below');
        element.classList.add('above');
    } else {
        element.classList.remove('below');
        element.classList.add('above');
    }

    if (!element.classList.contains('right') && !element.classList.contains('left') && !element.classList.contains('above') && !element.classList.contains('below')) {
        element.classList.add('above');
    }
    
}

// Attach event listener for hover on elements with class 'gw-tooltip-container'
document.querySelectorAll('.gw-tooltip-container').forEach(function (container) {
    var tooltip = container.querySelector('.gw-tooltip.adaptable');

    container.addEventListener('mouseenter', function () {
        tooltip.classList.remove('left', 'right', 'above', 'below');
        updateClasses(tooltip);
    });

    container.addEventListener('mouseover', function () {
        tooltip.style.display = 'flex';
    });

    container.addEventListener('mouseleave', function () {
        tooltip.style.display = 'none'; 
    });
});


// Function to toggle tooltip visibility
function toggleTooltip(element) {
    var tooltip = element.querySelector('.gw-tooltip.adaptable');
    tooltip.style.display = (tooltip.style.display === 'flex') ? 'none' : 'flex';
}

function hideTooltipOnClickOutside(event, container) {
    var tooltip = container.querySelector('.gw-tooltip.adaptable');
    
    if (!container.contains(event.target) && tooltip.style.display === 'flex') {
        tooltip.style.display = 'none';
    }
}


// Attach click event listener for touch devices
document.querySelectorAll('.gw-tooltip-container').forEach(function (container) {
    container.addEventListener('click', function (event) {
        // Check if the clicked element is the container or its descendant
        if (container.contains(event.target)) {
            toggleTooltip(container);
        }
    });

    // Attach hover event listeners for non-touch devices
    container.addEventListener('mouseenter', function () {
        tooltip.classList.remove('left', 'right', 'above', 'below');
        updateClasses(container);
    });

    container.addEventListener('mouseleave', function () {
        var tooltip = container.querySelector('.gw-tooltip.adaptable');

    });

    document.addEventListener('click', function (event) {
        hideTooltipOnClickOutside(event, container);
    });
});
