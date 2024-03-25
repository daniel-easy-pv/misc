modals.generateDOM = function(){
  $.each(modals.funcs, (modalName, modal) => {
    if (modal.html){
      modals.domObjects[modalName] = modal.html();
    }
  });
};

modals.wrapModalHTML = function(modalName, html, classes=[]){
  let modalHTML = `
  <div modal="${modalName}" id="${modalName}Modal" class="modal-class ${classes.join(' ')}">
    <div class="modal-content">
      <div class='closeModal exit-modal-button'></div>`;
  modalHTML += html;
  modalHTML += '</div></div>';
  return modalHTML;
};
modals.generateDOM()


function changeHelpTab(clickedTab) {
  var tabs = document.querySelectorAll(".help-tab");
  var tabOptions = document.querySelectorAll(".sidebar-tab");
  var selectedTab = document.getElementById(clickedTab);
  var selectedTabOption = document.getElementById(clickedTab+"-option");

  tabs.forEach(tab => {
    tab.classList.remove("active-tab");
  });

  tabOptions.forEach(tabOption => {
    tabOption.classList.remove("active-option");
  });

  selectedTab.classList.add("active-tab");
  selectedTabOption.classList.add("active-option");

  backToGuides();
  backToLibrary();
  closeAllDropdowns();
};

document.addEventListener('DOMContentLoaded', faqDropdown);
var listenerAdded = false;
function faqDropdown() {
  var faqQuestions = document.querySelectorAll('.faq-question');

  console.log(listenerAdded);

  if (listenerAdded === false) {
    faqQuestions.forEach(function (question) {
      question.addEventListener('click', function () {
        var parentDropdown = question.closest('.faq-dropdown');

        if(parentDropdown.classList.contains('collapsed')) {
          parentDropdown.classList.remove('collapsed');
        } else {
          parentDropdown.classList.add('collapsed');
        }

        listenerAdded = true;
      });
    });
  }
}

function closeAllDropdowns() {
  var faqQuestions = document.querySelectorAll('.faq-question');
  
  faqQuestions.forEach(function (question) {
    var parentDropdown = question.closest('.faq-dropdown');

    if (parentDropdown) {
      parentDropdown.classList.add('collapsed');
    }
  });
}

function expandVideo(selectedVideo) {
  var allVideos = document.querySelectorAll('.video-library-item');
  var selectedVideo = document.getElementById(selectedVideo);
  var title = document.getElementById('video-library-title');
  var back = document.getElementById('video-library-back');

  allVideos.forEach(allVideo => {
    allVideo.classList.add('hidden');
  });

  selectedVideo.classList.remove('hidden');
  selectedVideo.classList.add('expanded');

  title.classList.add('title-hidden');
  back.classList.remove('title-hidden');
}

function backToLibrary() {
  var allVideos = document.querySelectorAll('.video-library-item');
  var selectedVideo = document.getElementById(selectedVideo);
  var title = document.getElementById('video-library-title');
  var back = document.getElementById('video-library-back');

  allVideos.forEach(allVideo => {
    allVideo.classList.remove('hidden');
    allVideo.classList.remove('expanded');
  });

  title.classList.remove('title-hidden');
  back.classList.add('title-hidden');

}

function copyEmail() {
  // Get the text to copy
  var textToCopy = document.getElementById('textToCopy').innerText;

  var textarea = document.createElement('textarea');
  textarea.value = textToCopy;
  document.body.appendChild(textarea);

  textarea.select();
  textarea.setSelectionRange(0, 99999); // For mobile devices
  document.execCommand('copy');
  document.body.removeChild(textarea);

  //Add toast notification to inform user copied to clipboard when integrated
}

function showArticle(selectedArticle) {
  var articles = document.querySelectorAll('.article');
  var selectedArticle = document.getElementById(selectedArticle);
  var title = document.getElementById('guide-title');
  var back = document.getElementById('guide-back');

  articles.forEach(article => {
    article.classList.add('hidden');
  });

  selectedArticle.classList.add('active');

  title.classList.add('title-hidden');
  back.classList.remove('title-hidden');
}

function backToGuides() {
  var articles = document.querySelectorAll('.article');
  var fullArticles = document.querySelectorAll('.article-content');
  var title = document.getElementById('guide-title');
  var back = document.getElementById('guide-back');

  articles.forEach(article => {
    article.classList.remove('hidden');
  });

  fullArticles.forEach(fullArticle => {
    fullArticle.classList.remove('active');
  });

  title.classList.remove('title-hidden');
  back.classList.add('title-hidden');
}