
$('button.open-palette-selection-modal').on('click', () => {
	modals.show(`paletteSelection`)
})
const modal = {
	hello() {
		console.log('Hello')
		addListenersToDropdowns()
		closeAllDropdowns()
	},
	goodbye() {
		console.log('bye')
	},
	html() {
		return modals.wrapModalHTML('paletteSelection', /*html*/`
			<div class="x-large-modal horizontal palette-modal">
				<div class="modal-body modal-lhs">
					<div class='select-your-palette modal-page' id='select-palette-page'>
						<h6>Select your palette</h6>


						
						
						<div class="modal-lhs-content palette-library" onclick="selectCard(event)">
							<div class="palette-card palette-card-blank-project" data-card-id="1">	                           
								<div class="gw-tag tag-compact">No Presets</div>  
								<div class="palette-card-title">Blank project
								<p>Single use palette</p></div>
							</div>

						<div class="palette-card palette-card-heatpunk-palette" data-card-id="2">	                           
							<div class="gw-tag tag-compact">Heatpunk</div>  
							<div class="palette-card-title">Building Regs 2000-2006
							<p>12 Materials</p></div>
						</div>	

						<div class="palette-card palette-card-heatpunk-palette" data-card-id="3">	                           
							<div class="gw-tag tag-compact">Heatpunk</div>  
							<div class="palette-card-title">Building Regs 2006-2015
							<p>13 Materials</p></div>
						</div>	

						<div class="palette-card palette-card-user-palette" data-card-id="4">	                           
							<div class="gw-tag tag-compact">User</div>  
							<div class="palette-card-title">User palette 1
							<p>15 Materials</p></div>
						</div>	

						<div class="palette-card palette-card-new-palette" data-card-id="0">	                           
						<div class="new-palette-symbol"><img class="icon" src="/testing/icons/400/24/Add.svg" alt="icon" /></div>
						New Palette
						</div>
						</div>
						
						<div class="modal-confirm">
							<button class="gw-button btn-tertiary closeModal">Back</button>
							<button class="gw-button btn-secondary"  onclick="changePage('external-walls')" id='editMaterials' disabled>Edit Materials</button>
							<button class="gw-button" id='startProject' disabled>Start Project</button>
						</div>
					</div>

					<div class='modal-page material-page external-walls' id='external-walls-page'>
						<div class='modal-header-bar'>
							<h6>External Walls</h6>
							<button class="gw-button btn-small btn-secondary" onclick="changePage('internal-walls')">Internal Walls<img class="icon" src="/testing/icons/400/16/Right More.svg" alt="icon"/></button>
						</div>
						
						<div class='modal-lhs-content material-selection-content'>

							<div class='material-category-column'> 

								<div class="gw-textbox-container gw-searchbar-container gw-textbox-and-icon">
									<input class="searchbar gw-textbox with-leading-icon" type="text" placeholder="Search">
									<img class="textbox-icon textbox-leading-icon" src="/testing/icons/400/20/Search.svg" alt="icon" />
								</div>	

								<div class='material-folder-list'>
									<div class='material-folder folder-selected' id='base-walls-menu' onclick="changeFolder('base-walls')">Base Walls</div>
										
									<div class='material-folder' id='solid-walls-menu'>Solid Walls</div>
									<div class='material-folder' id='cavity-walls-menu'>Cavity Walls</div>
									<div class='material-folder' id='externally-rendered-menu'>Externally Rendered</div>
									<div class='material-folder' id='externally-clad-menu'>Externally Clad</div>
									<div class='material-folder' id='other-walls-menu'>Other Walls</div>
									<div class='material-folder' id='custom-walls-menu' onclick="changeFolder('custom-walls')">Custom Walls</div>
								</div>

							</div>

							<div class='material-column-separator'></div>

							<div class='material-column' id='base-walls-column'>

								<div class='material-subfolder'>
									<div class='subfolder-quantity'><img class='folder-icon' src="/testing/pages/heatpunk/palette/src/images/folder.svg" alt="folder-icon" /><p class='subfolder-quantity-text'>10</p></div>
									<div class='body-compact'>Folder Name</div>
								</div>

								<div class='material-row' onclick ="selectMaterial(id)" id='material-1'>
									<img class='material-layers-image' src="/testing/pages/heatpunk/palette/src/images/wall-graphic.svg" alt="wall-graphic" />
									<div class='material-details'>
										<p class='body-compact'>Material Name</p>
										<p class='caption'>Thickness 275mm</p>
										<p class='caption'>u: 000</p>
									</div>
									<button class="gw-button icon-only btn-tertiary icon-favorite"><img class="icon" src="/testing/icons/400/20/Star Filled.svg" alt="icon" /></button>
									<button class="gw-button icon-only btn-tertiary icon-more"><img class="icon" src="/testing/icons/400/20/More Horizontal.svg" alt="icon" /></button>
								</div>

								<div class='material-row' onclick ="selectMaterial(id)" id='material-2'>
									<img class='material-layers-image'>
									<div class='material-details'>
										<p class='body-compact'>Material Name</p>
										<p class='caption'>Thickness 275mm</p>
										<p class='caption'>u: 000</p>
									</div>
									<button class="gw-button icon-only btn-tertiary icon-favorite"><img class="icon" src="/testing/icons/400/20/Star Filled.svg" alt="icon" /></button>
									<button class="gw-button icon-only btn-tertiary icon-more"><img class="icon" src="/testing/icons/400/20/More Horizontal.svg" alt="icon" /></button>
								</div>

								<div class='material-row' onclick ="selectMaterial(id)" id='material-3'>
									<img class='material-layers-image'>
									<div class='material-details'>
										<p class='body-compact'>Material Name</p>
										<p class='caption'>Thickness 275mm</p>
										<p class='caption'>u: 000</p>
									</div>
									<button class="gw-button icon-only btn-tertiary icon-favorite"><img class="icon" src="/testing/icons/400/20/Star Filled.svg" alt="icon" /></button>
									<button class="gw-button icon-only btn-tertiary icon-more"><img class="icon" src="/testing/icons/400/20/More Horizontal.svg" alt="icon" /></button>
								</div>

							</div>

							
							<div class='material-column' id='custom-walls-column'>

								<div class='new-custom-material' onclick="changePage('custom-external-wall')">
									<div class='new-material-plus'><div class='new-material-plus-grey'><img class="icon" src="/testing/icons/400/24/Add.svg" alt="icon" /></div></div>
									<div class='body-compact'>New Material</div>
								</div>

								<div class='material-row' onclick ="selectMaterial(id)" id='material-4'>
									<img class='material-layers-image'>
									<div class='material-details'>
										<p class='body-compact'>Material Name</p>
										<p class='caption'>Thickness 275mm</p>
										<p class='caption'>u: 000</p>
									</div>
									<button class="gw-button icon-only btn-tertiary icon-favorite"><img class="icon" src="/testing/icons/400/20/Star Filled.svg" alt="icon" /></button>
									<button class="gw-button icon-only btn-tertiary icon-more"><img class="icon" src="/testing/icons/400/20/More Horizontal.svg" alt="icon" /></button>
								</div>

								

							</div>

						</div>

						<div class="modal-confirm">
						
						<button class="gw-button">Start Project</button>
					</div>
					</div>
				
					<div class='modal-page material-page custom-material-page custom-external-wall' id='custom-external-wall-page'>
						<div class='modal-header-bar'>
							<h6>New External Wall</h6>
						</div>

						<div class='modal-lhs-content custom-material-content'>
							<div class='material-image-builder-container'>
								<div class='material-image-builder'><img class='material-image' src="/testing/pages/heatpunk/palette/src/images/wall-graphic.svg" alt="wall-graphic" /></div>
								<div class='material-image-builder-details'>
									<span>U Value: 0.87</span>
									<span>Thickness: 267mm</span>
								</div>
							</div>
                            <div class="gw-textbox-container">
								<label class="gw-textbox-caption">Wall Name</label>
								<div  class="gw-textbox-and-icon">
									<input class="gw-textbox" type="text" placeholder="Brick wall">
									<img class="textbox-icon textbox-error-icon" src="/testing/icons/400/20/Error Failure.svg" alt="icon" />
									<label class="textbox-additional-text textbox-error-text">You must enter wall name</label>
								</div>
                            </div>
                                                

							<div class="wall-properties-header">Wall properties
								<button class="gw-button btn-tertiary" onclick ="changeCustomMode()" id='customMaterialSwitcher'><img class="icon" src="/testing/icons/400/20/Switch.svg" alt="icon"/>U-Value</button>
							</div>

							<table class="gw-textbox-table new-material-textbox-table" style='display:flex;' id='MaterialTable'>
							<thead>
								<tr class="textbox-table-row header-with-buttons">
									<th>Category</th>
									<th>Material</th>
									<th>Thickness</th>
									<th>K-factor</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>
										<div class="gw-dropdown table-element" tabindex="0">
											<div class="selected-option">category</div>
											<ul class="options wide-options" style="display: none;">
											<li data-value="option2">Walls</li>
											<li data-value="option3">Surface Finish</li>
											<li data-value="option3">Roofs</li>
											<li data-value="option3">etc.</li>
											</ul>
										</div>
									</td>
									<td>
										<div class="gw-dropdown table-element" tabindex="0">
											<div class="selected-option">wall type</div>
											<ul class="options wide-options" style="display: none;">
											<li data-value="option2">Asbestos cement sheet</li>
											<li data-value="option3">Autoclaved aerated concrete block</li>
											<li data-value="option3">brickwork &#40;inner leaf&#41;</li>
											<li data-value="option3">etc.</li>
											</ul>
										</div>
									</td>
									<td>             
										<div  class="gw-textbox-and-icon table-element">
											<input class="gw-textbox with-trailing-icon table-element" type="text" placeholder="00">
											<p class="textbox-trailing-unit">mm</p>
										</div>            
									</td>
									<td class='content-and-unit'>             
										<p class='content'>00</p>
										<p class="table-trailing-unit">λ</p>      
									</td>
									<td class='row-button'><button class="gw-button icon-only btn-tertiary remove-row"><img class="icon" src="/testing/icons/400/20/Remove.svg" alt="icon" /></button></td>
								</tr>
								
								<tr>
									<td>
										<div class="gw-dropdown table-element" tabindex="0">
											<div class="selected-option">category</div>
											<ul class="options wide-options" style="display: none;">
											<li data-value="option2">Walls</li>
											<li data-value="option3">Surface Finish</li>
											<li data-value="option3">Roofs</li>
											<li data-value="option3">etc.</li>
											</ul>
										</div>
									</td>
									<td>
										<div class="gw-dropdown table-element" tabindex="0">
											<div class="selected-option">wall type</div>
											<ul class="options wide-options" style="display: none;">
											<li data-value="option2">Asbestos cement sheet</li>
											<li data-value="option3">Autoclaved aerated concrete block</li>
											<li data-value="option3">brickwork &#40;inner leaf&#41;</li>
											<li data-value="option3">etc.</li>
											</ul>
										</div>
									</td>
									<td>             
										<div  class="gw-textbox-and-icon table-element">
											<input class="gw-textbox with-trailing-icon table-element" type="text" placeholder="00">
											<p class="textbox-trailing-unit">mm</p>
										</div>            
									</td>
									<td class='content-and-unit'>             
										<p class='content'>00</p>
										<p class="table-trailing-unit">λ</p>      
									</td>
									<td class='row-button'><button class="gw-button icon-only btn-tertiary remove-row"><img class="icon" src="/testing/icons/400/20/Remove.svg" alt="icon" /></button></td>
								</tr>

								<tr>
									<td>
										<div class="gw-dropdown table-element" tabindex="0">
											<div class="selected-option">category</div>
											<ul class="options wide-options" style="display: none;">
											<li data-value="option2">Walls</li>
											<li data-value="option3">Surface Finish</li>
											<li data-value="option3">Roofs</li>
											<li data-value="option3">etc.</li>
											</ul>
										</div>
									</td>
									<td>
										<div class="gw-dropdown table-element" tabindex="0">
											<div class="selected-option">wall type</div>
											<ul class="options wide-options" style="display: none;">
											<li data-value="option2">Asbestos cement sheet</li>
											<li data-value="option3">Autoclaved aerated concrete block</li>
											<li data-value="option3">brickwork &#40;inner leaf&#41;</li>
											<li data-value="option3">etc.</li>
											</ul>
										</div>
									</td>
									<td>             
										<div  class="gw-textbox-and-icon table-element">
											<input class="gw-textbox with-trailing-icon table-element" type="text" placeholder="00">
											<p class="textbox-trailing-unit">mm</p>
										</div>            
									</td>
									<td class='content-and-unit'>             
										<p class='content'>00</p>
										<p class="table-trailing-unit">λ</p>      
									</td>
									<td class='row-button'><button class="gw-button icon-only btn-tertiary remove-row"><img class="icon" src="/testing/icons/400/20/Remove.svg" alt="icon" /></button></td>
								</tr>


								<tr><td><button class="gw-button btn-tertiary btn-small" id="addRow"><img class="icon" src="/testing/icons/400/20/Add.svg" alt="icon" />Add Row</button></td></tr>
							</tbody>
							
						</table>
		

						<table class="gw-textbox-table new-material-textbox-table" style='display:none;' id='uValueTable'>
						<thead>
							<tr class="textbox-table-row">
								<th>Material Name</th>
								<th>U-value</th>
								<th>Thickness</th>
								<th>K-factor</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td><input class="gw-textbox table-element" type="text" placeholder="Placeholder"></td>
								<td>             
									<div  class="gw-textbox-and-icon table-element">
										<input class="gw-textbox with-trailing-icon table-element" type="text" placeholder="00">
										<p class="textbox-trailing-unit">W/m²K</p>
									</div>            
								</td>
								<td>             
									<div  class="gw-textbox-and-icon table-element">
										<input class="gw-textbox with-trailing-icon table-element" type="text" placeholder="00">
										<p class="textbox-trailing-unit">mm</p>
									</div>            
								</td>
								<td>             
									<div  class="gw-textbox-and-icon table-element">
										<input class="gw-textbox with-trailing-icon table-element" type="text" placeholder="00">
										<p class="textbox-trailing-unit">λ</p>
									</div>            
								</td>
							</tr>
							
						</tbody>
						
					</table>




						</div>


						<div class="modal-confirm">
							<div class='save-to-library'>          
								<input type="checkbox" class="gw-checkbox" id="Checkbox-label" checked>
								<label for="Checkbox-label"><img class="tickbox-tick icon icon-on-primary" src="/testing/icons/400/24/Tickbox Tick.svg" alt="icon"/>Save to library</label>
							</div>
							<button class='gw-button btn-tertiary' onclick="changePage('external-walls')">back</button>
							<button class="gw-button">Create Wall</button>
						</div>
					</div>

					<div class='modal-page material-page internal-walls' id='internal-walls-page'>
					<div class='modal-header-bar'>
						<h6>Internal Walls</h6>
						<button class="gw-button btn-small btn-secondary" onclick="changePage('floors')">Floors<img class="icon" src="/testing/icons/400/16/Right More.svg" alt="icon"/></button>
					</div>
					
					<div class='modal-lhs-content material-selection-content'>
	
						<div class='material-category-column'> 
	
							<div class="textbox-container gw-searchbar-container">
									<input class="searchbar with-leading-icon" type="text" placeholder="Search">
									<img class="textbox-icon textbox-leading-icon" src="/testing/icons/400/20/Search.svg" alt="icon" />
							</div>	
	
							<div class='material-folder-list'>
								<div class='material-folder'>-- Walls</div>
								<div class='material-folder'>-- Walls</div>
								<div class='material-folder'>-- Walls</div>
							</div>
	
						</div>
	
						<div class='material-column-separator'></div>
	
						<div class='material-column'>
	
							<div class='material-row' onclick ="selectMaterial(id)" id='material-1'>
								<img class='material-layers-image'>
								<div class='material-details'>
									<p class='body-compact'>Material Name</p>
									<p class='caption'>Thickness 275mm</p>
									<p class='caption'>u: 000</p>
								</div>
								<button class="gw-button icon-only btn-tertiary icon-favorite"><img class="icon" src="/testing/icons/400/20/Star Filled.svg" alt="icon" /></button>
								<button class="gw-button icon-only btn-tertiary icon-more"><img class="icon" src="/testing/icons/400/20/More Horizontal.svg" alt="icon" /></button>
							</div>
	
						</div>
					
					</div>
	
					<div class="modal-confirm">
					
					<button class="gw-button">Start Project</button>
				</div>
				</div>

				</div>





				<div class="modal-rhs modal-rhs-palette">
					<div class="modal-rhs-cover"></div>
					<div class="no-palette-selected" id='palettePlaceholder'>
						<img class="icon" src="/testing/icons/400/48/Colour.svg" alt="icon" />
						<h6>No Palette Selected</h6>
					</div>
					<div class='selected-palette' id='selectedPalette'>
						<div class="material-category-header">
						<div class="material-category-header-text">Palette Name
						<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Edit.svg" alt="icon" /></button>
						</div>
						<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark" onclick="changePage('select-palette')"><img class="icon" src="/testing/icons/400/16/List.svg" alt="icon" /></button>
						</div>


						<div class="material-category">
							<div class="material-dropdown" id="external-walls-dropdown" onclick="toggleSidebarDropdown('external-walls')">
							<div class="material-category-text" id="externalWallsDropdownTitle">External Walls (<div class="materials-selected-quantity">0</div>)</div>
							<button class="gw-button btn-small btn-tertiary btn-edit btn-tertiary-on-dark" onclick="changePage('external-walls')"><img class="icon" src="/testing/icons/400/16/Edit.svg" alt="icon" />Edit</button>
							<button class="gw-button btn-small icon-only btn-tertiary btn-dropdown btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Down More.svg" alt="icon" /></button>
							</div>
							<div id="external-walls-dropdown-body" class="dropdown-container">
								<div class="dropdown-content">

									<div class="selected-material">
										<div class="selected-material-text">No insulation, wet plaster</div>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Star Clear.svg" alt="icon" /></button>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Delete.svg" alt="icon" /></button>
									</div>

									<div class="selected-material">
										<div class="selected-material-text">No insulation, 100mm block, wet plaster</div>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Star Clear.svg" alt="icon" /></button>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Delete.svg" alt="icon" /></button>
									</div>

									<div class="selected-material">
										<div class="selected-material-text">No insulation, 125mm block</div>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Star Clear.svg" alt="icon" /></button>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Delete.svg" alt="icon" /></button>
									</div>

								</div>
							</div>
						</div>

						<div class="material-category">
							<div class="material-dropdown" id="internal-walls-dropdown" onclick="toggleSidebarDropdown('internal-walls')">
							<div class="material-category-text" id="internalWallsDropdownTitle">Internal Walls (<div class="materials-selected-quantity">0</div>)</div>
							<button class="gw-button btn-small btn-tertiary btn-edit btn-tertiary-on-dark" onclick="changePage('internal-walls')"><img class="icon" src="/testing/icons/400/16/Edit.svg" alt="icon" />Edit</button>
							<button class="gw-button btn-small icon-only btn-tertiary btn-dropdown btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Down More.svg" alt="icon" /></button>
							</div>
							<div id="internal-walls-dropdown-body" class="dropdown-container">
								<div class="dropdown-content">

									<div class="selected-material">
										<div class="selected-material-text">No insulation, wet plaster</div>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Star Clear.svg" alt="icon" /></button>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Delete.svg" alt="icon" /></button>
									</div>

									<div class="selected-material">
										<div class="selected-material-text">No insulation, 100mm block, wet plaster</div>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Star Clear.svg" alt="icon" /></button>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Delete.svg" alt="icon" /></button>
									</div>

									<div class="selected-material">
										<div class="selected-material-text">No insulation, 125mm block</div>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Star Clear.svg" alt="icon" /></button>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Delete.svg" alt="icon" /></button>
									</div>

								</div>
							</div>
						</div>

						<div class="material-category">
							<div class="material-dropdown" id="floor-dropdown" onclick="toggleSidebarDropdown('floor')">
								<div class="material-category-text" id="floorsDropdownTitle">Floors (<div class="materials-selected-quantity">0</div>)</div>
								<button class="gw-button btn-small btn-tertiary btn-edit btn-tertiary-on-dark" onclick="changePage('floors')"><img class="icon" src="/testing/icons/400/16/Edit.svg" alt="icon" />Edit</button>
								<button class="gw-button btn-small icon-only btn-tertiary btn-dropdown btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Down More.svg" alt="icon" /></button>
							</div>
							<div id="floor-dropdown-body" class="dropdown-container">
								<div class="dropdown-content">

									<div class="selected-material">
										<div class="selected-material-text">No insulation, wet plaster</div>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Star Clear.svg" alt="icon" /></button>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Delete.svg" alt="icon" /></button>
									</div>

									<div class="selected-material">
										<div class="selected-material-text">No insulation, 100mm block, wet plaster</div>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Star Clear.svg" alt="icon" /></button>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Delete.svg" alt="icon" /></button>
									</div>

									<div class="selected-material">
										<div class="selected-material-text">No insulation, 125mm block</div>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Star Clear.svg" alt="icon" /></button>
										<button class="gw-button btn-small icon-only btn-tertiary btn-tertiary-on-dark"><img class="icon" src="/testing/icons/400/16/Delete.svg" alt="icon" /></button>
									</div>

								</div>
							</div>
						</div>
					</div>


			</div>
		</div>
		`)
	}
}

modals.funcs.paletteSelection = modal