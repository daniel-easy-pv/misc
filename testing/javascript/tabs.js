
  document.addEventListener("DOMContentLoaded", function () {
    function setupTabs() {
      const tabContainers = document.querySelectorAll(".gw-tab-and-page");
      
  
      tabContainers.forEach(tabContainer => {
        const tabs = tabContainer.querySelectorAll(".tab-container .tab");
        const contentTabs = tabContainer.querySelectorAll(".tab-content-container .tab-content");
  
        function showTab(tabNumber) {
          tabs.forEach(tab => tab.classList.remove("active"));
          contentTabs.forEach(contentTab => contentTab.classList.remove("active"));
  
          const activeTab = tabContainer.querySelector(`.tab-container #tab-${tabNumber}`);
          activeTab.classList.add("active");
  
          const activeContentTab = tabContainer.querySelector(`.tab-content-container #content-tab-${tabNumber}`);
          activeContentTab.classList.add("active");
        }
  
        function createTabButton(tabNumber) {
          const tab = tabContainer.querySelector(`.tab-container #tab-${tabNumber}`);
          tab.addEventListener("click", function () {
            showTab(tabNumber);
          });
        }
  
        tabs.forEach((tab, index) => {
          createTabButton(index + 1);
        });
  
        showTab(1);
      });
    }

    setupTabs();
  });
  
 
 
