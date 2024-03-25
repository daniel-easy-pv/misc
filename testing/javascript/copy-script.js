// Function to copy code to clipboard
function copyCode(event) {
    // Get the code snippet from the current component
    var component = event.currentTarget.closest('.ds-component-container');
    var codeContainer = component.querySelector('.code-container');
    var codeSnippet = codeContainer.querySelector('pre').innerText;

    // Create a textarea element to hold the code
    var textarea = document.createElement('textarea');
    textarea.value = codeSnippet;
    document.body.appendChild(textarea);

    // Select and copy the text
    textarea.select();
    document.execCommand('copy');

    // Remove the textarea
    document.body.removeChild(textarea);

    // Optionally provide feedback to the user
    showToast('Code copied to clipboard!');
}

// Function to show a toast message
function showToast(message) {
    // Create a toast element
    var toast = document.createElement('div');
    toast.className = 'ds-toast';
    toast.innerText = message;

    // Append the toast to the body
    document.body.appendChild(toast);

    // Show the toast
    toast.style.display = 'block';

    // Hide the toast after a delay (e.g., 3 seconds)
    setTimeout(function() {
        toast.style.display = 'none';
        // Remove the toast element from the DOM
        document.body.removeChild(toast);
    }, 3000);
}

// Function to show the copy code button
function showCopyButton(event) {
    var copyButton = event.currentTarget.querySelector('.copy-code-button');
    copyButton.style.display = 'inline-block';
}

// Function to hide the copy code button
function hideCopyButton(event) {
    var copyButton = event.currentTarget.querySelector('.copy-code-button');
    copyButton.style.display = 'none';
}
