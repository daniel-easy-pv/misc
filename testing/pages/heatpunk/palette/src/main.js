modals.generateDOM = function() {
    $.each(modals.funcs, (modalName, modal) => {
        if (modal.html) {
            modals.domObjects[modalName] = modal.html()
        }
    })
}

modals.wrapModalHTML = function(modalName, html, classes=[]) {
    let modalHTML = `
    <div modal="${modalName}" id="${modalName}Modal" class="modal-class ${classes.join(' ')}">
      <div class="modal-content">
        <div class='closeModal exit-modal-button'></div>`
    modalHTML += html
    modalHTML += '</div></div>'
    return modalHTML
}
modals.generateDOM()

function selectCard(event) {
    const clickedCard = event.target.closest('.palette-card')

    if (clickedCard) {
        // Remove 'selected' class from all cards
        document.querySelectorAll('.palette-card').forEach(card => {
            card.classList.remove('selected')
            setSelectedPalette()
        })

        // Add 'selected' class to the clicked card
        clickedCard.classList.add('selected')
    }
}

function setSelectedPalette() {
    console.log('up to here')
    const palettePlaceholder = document.getElementById('palettePlaceholder')
    const selectedPalette = document.getElementById('selectedPalette')
    palettePlaceholder.style.display = 'none'
    selectedPalette.style.display = 'flex'

    const editMaterials = document.getElementById('editMaterials')
    const startProject = document.getElementById('startProject')
    editMaterials.disabled = false
    startProject.disabled = false
}

function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-container')
    dropdowns.forEach(function(item) {
        item.style.display = 'none'
    })
}

function toggleSidebarDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId+'-dropdown-body')
    const dropdowns = document.querySelectorAll('.dropdown-container')
    const materialHeader = document.getElementById(dropdownId+'-dropdown')

    if (dropdown.style.display === 'block') {
    
        dropdown.style.display = 'none'

        var btnDropdown = materialHeader.querySelector('.btn-dropdown')
        btnDropdown.classList.remove('flipped')
    } else {
        dropdowns.forEach(function(item) {
            if (item.id !== dropdownId) {
                item.style.display = 'none'

            }
        })

        dropdown.style.display = 'block'

        const btnDropdownAll = document.querySelectorAll('.btn-dropdown')
        btnDropdownAll.forEach(function(btnDropdownItem) {
            btnDropdownItem.classList.remove('flipped')
        })

        var btnDropdown = materialHeader.querySelector('.btn-dropdown')
        btnDropdown.classList.add('flipped')
    }
}


function changePage(pageName) {
  
    document.querySelectorAll('.modal-page').forEach(card => {
        card.style.display = 'none'
    })

    const selectedPage = document.getElementById(pageName+'-page')
    selectedPage.style.display = 'flex'
  
    const dropdown = document.getElementById(pageName+'-dropdown-body')

    if (dropdown.style.display === 'block') {
        toggleSidebarDropdown(pageName)
    }
 
}

function selectMaterial(material) {
    const selectedMaterial = document.getElementById(material)


    if (selectedMaterial.classList.contains('material-selected')) {
        selectedMaterial.classList.remove('material-selected')
    } else {
        selectedMaterial.classList.add('material-selected')
    }
}

function changeFolder(folder) {
    const selectedInMenu = document.getElementById(folder+'-menu')
    const selectedFolder = document.getElementById(folder+'-column')

    document.querySelectorAll('.material-folder').forEach(menu => {
        menu.classList.remove('folder-selected')
    })

    document.querySelectorAll('.material-column').forEach(menu => {
        menu.style.display = 'none'
    })

    selectedInMenu.classList.add('folder-selected')
    selectedFolder.style.display = 'flex'
}

function changeCustomMode() {
    const uValueTable = document.getElementById('uValueTable')
    const MaterialTable = document.getElementById('MaterialTable')
    const button = document.getElementById('customMaterialSwitcher')
  
    if (uValueTable.style.display === 'none') {
        uValueTable.style.display = 'flex'
        MaterialTable.style.display = 'none'
        button.innerHTML = '<img class="icon" src="/testing/icons/400/20/Switch.svg" alt="icon"/>Set Layers'
    } else {
        MaterialTable.style.display = 'flex'
        uValueTable.style.display = 'none'
        button.innerHTML = '<img class="icon" src="/testing/icons/400/20/Switch.svg" alt="icon"/>U-Value'
    }


}