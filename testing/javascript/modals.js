
modals.generateDOM = function(){
    $.each(modals.funcs, (modalName, modal) => {
      if (modal.html){
        modals.domObjects[modalName] = modal.html();
      }
    });
  };

  modals.wrapModalHTML = function(modalName, html, classes=[]){
    let modalHTML = `
    <div modal="${modalName}" id="${modalName}Modal" class="modal-class, ${classes.join(' ')}">
      <div class="modal-content" >
        <div class='closeModal exit-modal-button'></div>`;
    modalHTML += html;
    modalHTML += '</div></div>';
    return modalHTML;
  };
  modals.generateDOM()
  