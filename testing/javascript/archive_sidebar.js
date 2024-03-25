var dropdownIcon = document.getElementById('dropdown-icon');


function showTab(tabName) {

    // Hide all tabs
    var tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(function(tab) {
        tab.classList.remove('active');
    });

    // Show the selected tab
    var selectedTab = document.getElementById(tabName);
    selectedTab.classList.add('active');

    // Highlight the corresponding sidebar link
    var sidebarLinks = document.querySelectorAll('#sidebar ul a');
    sidebarLinks.forEach(function(link) {
        link.classList.remove('selected');
    });

    var correspondingLink = document.querySelector(`#sidebar a[href="#"][onclick*="${tabName}"]`);
    if (correspondingLink) {
        correspondingLink.classList.add('selected');
    }

    // Toggle the class for flipping the image
    dropdownIcon.classList.toggle('rotate', componentsSubmenu.classList.contains('active'));

    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('mobile-expanded')
}


document.addEventListener('DOMContentLoaded', function() {
    // Initially collapse all submenus
    var allSubmenus = document.querySelectorAll('.submenu');
    allSubmenus.forEach(function(submenu) {
        submenu.classList.remove('active');
    });

    // Check if a submenu should be active on page load
    var activeSubmenu = document.querySelector('.submenu.active');
    if (activeSubmenu) {
        showTab(activeSubmenu.dataset.submenuId);
    }
});


function toggleSubmenu(submenuId) {
    var submenu = document.getElementById(submenuId + '-submenu');
    var dropdownIcon = document.querySelector(`#${submenuId}-btn .ds-dropdown-icon`);

    if (submenu && dropdownIcon) {
        var isActive = submenu.classList.toggle('active');
        dropdownIcon.classList.toggle('rotate', isActive);

        // Collapse other submenus
        var allSubmenus = document.querySelectorAll('.submenu');
        allSubmenus.forEach(function (otherSubmenu) {
            var otherSubmenuId = otherSubmenu.id.replace('-submenu', '');
            if (otherSubmenuId !== submenuId) {
                otherSubmenu.classList.remove('active');
                var otherDropdownIcon = document.querySelector(`#${otherSubmenuId}-btn .ds-dropdown-icon`);
                if (otherDropdownIcon) {
                    otherDropdownIcon.classList.remove('rotate');
                }
            }
        });
    }
}
