

$('button.open-default-modal').on('click', () => {
	modals.show(`defaultModal`)
})
const modal = {
	hello() {
		console.log('Hello')
	},
	goodbye() {
		console.log('bye')
	},
	html() {
		
		return modals.wrapModalHTML('defaultModal', /*html*/`
			<div class="default-modal horizontal">
				<div class="modal-body modal-lhs">
				<h6>Default</h6>

				<div class="modal-lhs-content">Lorem ipsum dolor sit amet</div>

				<div class="modal-confirm">
					<button class="btn-tertiary">Back</button>
					<button>Confirm</button>
				</div>
				</div>
				<div class="modal-rhs">

				</div>
			</div>
		`)
	}
}

modals.funcs.defaultModal = modal
