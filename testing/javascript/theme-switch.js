
    function changeTheme(themeName) {
    const linkElement = document.getElementById('theme-stylesheet');
    linkElement.href = `/testing/src/themes/${themeName}.css`;

    // Delay the inversion of icons by a short interval (e.g., 100 milliseconds)
    setTimeout(() => {
        invertIconsIfOnPrimaryIsWhite();
    }, 200);
    document.getElementById('themeDropdown').style.display = 'none';
    }

    function changeThemeStyle(themeStyleName) {
        const linkElement = document.getElementById('theme-style-stylesheet');
        linkElement.href = `/testing/src/themes/theme-styles/${themeStyleName}.css`;
        setTimeout(function() {
            setLogoWidth();
        }, 50); 

    }

    function toggleThemeDropdown() {
        const dropdown = document.getElementById('themeDropdown');
        dropdown.style.display = (dropdown.style.display === 'flex') ? 'none' : 'flex';
        }

                // Fetch the background image dynamically
    const logoContainer = document.getElementById('dynamiclogoContainer');
    const backgroundImageUrl = getComputedStyle(document.querySelector('.theme-logo')).backgroundImage;
    const logoContainerOuter = document.getElementsByClassName('logo-container');



    function setLogoWidth() {
        // Get all elements with the class 'main-logo'
        const logoElements = document.getElementsByClassName('main-logo');
    
        // Iterate through each element with the class 'main-logo'
        Array.from(logoElements).forEach(logoContainer => {
            const logoContainerOuter = logoContainer.parentElement; // Assuming it's a child of a 'logo-container'
            const backgroundImageUrl = getComputedStyle(logoContainer).backgroundImage;
    
            // Extract the URL from the "url('...')" format
            const imageUrl = backgroundImageUrl.replace(/url\(['"]?(.*?)['"]?\)/, '$1');
    
            console.log('Image URL:', imageUrl);
    
            const img = new Image();
    
            img.onload = function () {
                const aspectRatio = img.width / img.height;
                const computedStyle = window.getComputedStyle(logoContainerOuter);
                const containerHeight = logoContainerOuter.clientHeight - parseFloat(computedStyle.paddingTop) - parseFloat(computedStyle.paddingBottom);
                 // Use clientHeight directly
    
                // Calculate the width based on the aspect ratio
                const containerWidth = aspectRatio * containerHeight;
    
                console.log('Container Width:', containerWidth, 'pixels');
    
                // Set the background image and calculated width
                // logoContainer.style.backgroundImage = `url(${imageUrl})`;
                logoContainer.style.width = `${containerWidth}px`;



            };
    
            img.src = imageUrl;
        });
        

        const navText = document.getElementById('navLogo');
        const computedStyleNavText = window.getComputedStyle(navText);
        const textColor = computedStyleNavText.color.trim().toLowerCase();
        const navUnderline = document.querySelector('.nav-underline');
        
        if (textColor === 'rgb(255, 255, 255)') {
            // Add the 'theme-logo-light' class to the theme-logo element
            const themeLogo = document.getElementById('themeLogo');
            themeLogo.classList.add('theme-logo-light');
            navUnderline.style.display = 'block';
        } else {
            // Remove the 'theme-logo-light' class if present
            themeLogo.classList.remove('theme-logo-light');
            console.log('Color is not white');
            navUnderline.style.display = 'none';
        }
    }
    
    // Call the function when the page has fully loaded
    document.addEventListener('DOMContentLoaded', setLogoWidth);

    

    document.addEventListener("DOMContentLoaded", function () {
        // Replace 'https://example.com/other-page' with the URL of the other page you want to fetch content from
        fetch('/testing/gigawatt.html')
            .then(response => response.text())
            .then(data => {
                // Assuming the content you want is in a specific element with an ID, replace 'specificElementId' with the actual ID
                var parser = new DOMParser();
                var doc = parser.parseFromString(data, 'text/html');
                var content = doc.getElementById('themeSwitcher').innerHTML;
                
                // Display the extracted content
                document.getElementById('themeSwitcherImport').innerHTML = content;
            })
            .catch(error => console.error('Error fetching content:', error));
    });
