
function updateHeaderToTabName (){
    var selectedTabName = document.getElementById('selected-tab-name');
    var selectedTab = document.querySelector('.active-option');
    selectedTabName.textContent = selectedTab.textContent;
}

updateHeaderToTabName()

function toggleSidebarMobile() {
    var sidebar = document.querySelector('.sidebar');
    var selectedTabName = document.getElementById('selected-tab-name');
    var selectedTab = document.querySelector('.active-option');
    (sidebar.classList.contains('mobile-expanded')) ? sidebar.classList.remove('mobile-expanded') : (sidebar.classList.add('mobile-expanded'));

    selectedTabName.textContent = selectedTab.textContent;
}


function closeSidebarMobile() {
    var sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('mobile-expanded');
}

document.addEventListener("DOMContentLoaded", function () {
    var sidebarTabs = document.querySelectorAll('.sidebar-tab');

    sidebarTabs.forEach(function (tab) {
        tab.addEventListener('click', function () {
            closeSidebarMobile();
        });
    });

});

function changeSidebarTab(clickedTab) {
    var tabPages = document.querySelectorAll(".tab-page");
    var tabs = document.querySelectorAll(".sidebar-tab");
    var selectedTabPage = document.getElementById(clickedTab+"-content");
    var selectedTab = document.getElementById(clickedTab);
  
    tabPages.forEach(tabPage => {
        tabPage.classList.remove("active-tab-page");
    });
  
    tabs.forEach(tab => {
        tab.classList.remove("active-option");
    });
  
    selectedTabPage.classList.add("active-tab-page");
    selectedTab.classList.add("active-option");

    updateHeaderToTabName()
   // checkFirstTab()
    checkLastTab()
};

function sidebarBackTab() {
    var activeTab = document.querySelector(".active-option");

    var currentNumber = parseInt(activeTab.id.split('-')[1]);

    // Increment the number
    var newNumber = currentNumber - 1;
    changeSidebarTab('tab-'+newNumber)
}

function sidebarNextTab() {
    var activeTab = document.querySelector(".active-option");

    var currentNumber = parseInt(activeTab.id.split('-')[1]);

    // Increment the number
    var newNumber = currentNumber + 1;
    selectedTabId = 'tab-' + newNumber;

    changeSidebarTab(selectedTabId)
}

function checkLastTab() {
    var activeTab = document.querySelector(".active-option");
    var currentNumber = parseInt(activeTab.id.split('-')[1]);

    var nextTabBtn = document.getElementById('next-tab-button');
    var doneBtn = document.getElementById('done-tab-button');

    var PlusOne = currentNumber + 1;
    upcomingTabId = 'tab-' + PlusOne;
    var upcomingTab = document.getElementById(upcomingTabId);

    if (upcomingTab === null) {
        nextTabBtn.classList.add('hidden');
        doneBtn.classList.remove('hidden');
    } else if (nextTabBtn.classList.contains('hidden')) {
        nextTabBtn.classList.remove('hidden');
        doneBtn.classList.add('hidden');
    }

    var backTabBtn = document.getElementById('back-tab-button');
    var exitBtn = document.getElementById('exit-tab-button');

    var MinusOne = currentNumber - 1;
    upcomingBackTabId = 'tab-' + MinusOne;
    var upcomingBackTab = document.getElementById(upcomingBackTabId);

    console.log(upcomingTab);
    console.log(upcomingBackTab);

    if (upcomingBackTab === null) {
        backTabBtn.classList.add('hidden');
        exitBtn.classList.remove('hidden');
    } else  {
        backTabBtn.classList.remove('hidden');
        exitBtn.classList.add('hidden');
    }
}

function checkFirstTab() {
    var activeTab = document.querySelector(".active-option");
    var currentNumber = parseInt(activeTab.id.split('-')[1]);
    
}