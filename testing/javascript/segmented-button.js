function selectSegment(index, containerId) {
    const buttons = document.querySelectorAll(`#${containerId} .segmented-button-item`);
    
    buttons.forEach((button, i) => {
        if (i === index) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}


function clearSegmentSelect(containerId) {
    const buttons = document.querySelectorAll(`#${containerId} .segmented-button-item`);

    buttons.forEach((button, i) => {
        button.classList.remove('active');
    });
}