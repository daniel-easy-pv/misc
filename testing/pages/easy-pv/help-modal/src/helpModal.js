
$('button.open-help-modal').on('click', () => {
	modals.show(`helpModal`)
})
const modal = {
	hello() {
		console.log('Hello');
		changeHelpTab('faqs');
		faqDropdown()
	},
	goodbye() {
		console.log('bye');
		
	},
	html() {
		return modals.wrapModalHTML('helpModal', /*html*/`
		<div class="x-large-modal horizontal help-modal">
			<div class="modal-body modal-lhs">
				<div class="help-tab" id="faqs">
					<h5>Frequently Asked Questions</h5>
					<div class="faq-dropdown-list">

						<h6>Getting Started</h6>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Which design mode should I use?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>Each design mode has benefits depending on the type of project or design you are working on:<br><br>1. Quick Roof: Create a 2D roof using the roof dimensions, pitch, orientation, and material type of the roof you’re working on. This is a great mode to use for new builds or if the satellite image is too blurry!<br><br>2. Roof Outline: Create a 2D roof model by outlining the roof from a satellite image. <br><br>3. 3D Model: Create a 3D property model by designing the roof from a satellite image. This mode is key for analysing shading on the array and it offers you (and your customer) a really nice visual of what the array will look like on the property.</p></div>
						</div>
							
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I pay Easy PV to design a project for me?
							</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer">This is not a service we offer at Easy PV, but if you’re struggling to use the software, you can always come to one or more of our free training sessions!</div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">How do I link my Midsummer Account to pull over my trade prices?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer">To link a Midsummer trade account to your Easy PV account please navigate to My Account in the top right of the Easy PV home page and click on Preferences. Add your Midsummer login credentials and click Connect. This will then link the account and pull over discounted trade prices.</div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">How do I attach my logo/branding to the customer proposal or Easy PV project report?
							</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer">To attach your Logo to the Easy PV Project Report please navigate to My Account in the top right of the Easy PV home page and click on Preferences. Once in this menu, scroll down to the Company Logo section and click on the current logo image. You can then upload an image from your computer.  <br><br>Please note that the logo will only appear on the quote page of the customer proposal report.</div>
						</div>
						
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I add a custom cover page or custom branding to the customer proposal report?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer">Custom cover pages and branding of the customer proposal report are only available for our enterprise customers.</div>
						</div>

						<h6 class="faq-header">Easy PV Pro Features</h6>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I share projects with other people in my team?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>This isn’t available for free accounts. If you would like to be able to share projects with your colleagues you’ll need to upgrade to a Pro subscription.</p>							</p></div>
						</div>
											
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I send emails directly from Easy PV? If so can they come from my email address, not an Easy PV email address?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>With Easy PV Pro, you gain access to our email management feature which will allow you to send emails and document attachments directly from Easy PV! These emails come from an Easy PV email address which CCs your email address in. <br><br>Enterprise customers have the option to have Easy PV emails sent from an email address they choose. </p></div>
						</div>
											
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I add default services in the financial task so they are added to all of my projects?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>You can add default services, as well as scaffolding, electrical, roofing, and much more with our automatic financial calculator on Easy PV Pro.</p></div>
						</div>

						<h6 class="faq-header">Design Queries</h6>
											
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I do a retrofit project in Easy PV?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>To create a quote for a retrofit project, recreate the existing system in Easy PV with the new additions. Set the price of all existing components to £0.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I do commercial or industrial designs in Easy PV?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>You certainly can. Please note that Easy PV is currently optimised for domestic installs, but you can use it for larger projects. We are working on adding more accurate estimations for larger designs so bear with us while we develop this.							</p></div>
						</div>

						
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">How can I adjust roof measurements in the Roof task?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>To see the roof dimensions, click on the corner of the roof. This will show you the dimensions of the two adjoining sides. You can click on either of these figures to enter a new figure. It’s the same process for checking and adjusting the dimensions of chimneys, vents, etc.</p></div>
						</div>
						
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">I’ve done a 3D design, can I include the 3D preview in the customer proposal document?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>You can take screenshots of the 3D model to show your customer. To do this go to 3D Model under Tasks and click the camera button. The screenshot will download to your computer.</p></div>
						</div>
						
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">If I add more than one type of battery to a project, it seems the consumption task doesn’t include all the batteries in the calculations. Am I missing something?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>At the moment, this is not yet a supported feature. However, our developers are hard at work and constantly adding new features! </p></div>
						</div>
						
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I do a battery-only project?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>At the moment, this is not yet a supported feature. However, our developers are hard at work and constantly adding new features! </p></div>
						</div>
						
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I upload a cad file or design PDF to use when doing a design?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>At the moment, this is not yet a supported feature. However, our developers are hard at work and constantly adding new features! </p></div>
						</div>
						
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">My report isn't loading - why?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>If your report is not loading it is likely because Easy PV is missing some information it needs to generate it. Try looking through your tasks to make sure that there isn’t any information missing.</p></div>
						</div>
						
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">I can’t allocate my panels to an inverter - all the options are red.</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>When all of the allocation options are red, Easy PV has determined the panel/inverter combination is not electrically viable. This means that either the panels’ or inverter’s technical specifications are out of the range of the other. Easy PV will outline any electrical issues in red text to make you aware of why it is not compatible.</p></div>
						</div>
						
						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">How do I create a ground-mounted PV system in Easy PV?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>To create a ground-mounted system in Easy PV using the Quick roof design mode you can start by creating a new project. When you have entered all the necessary information, click Go. This brings up a Roof Details screen. On the left side, there are various roof-type options. The last option is Ground mounted. Once you select that option, it will allow you to create a ground-mounted project in Easy PV. <br><br>You can also create a flat roof in the Roof Outline mode. After drawing the area on the satellite image, navigate to the Panels task, where you can click the edit roof button. You can now specify that the roof is ground-mounted. <br><br>To create a ground-mounted system in 3D, you will select a Flat roof type from the menu options. Then you’ll choose Ground from the drop-down menu for roof material. You’ll also want to make sure you change the elevation to 0 in the Elevations view.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">The MCS self-consumption calculator doesn’t work for my project.</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>The MCS self-consumption calculator won’t work for projects with an annual generation greater than 6000 kWh or with battery storage over 15.1kWh. For these situations, we recommend using the Easy PV consumption task to determine a solar self-consumption figure. If you do this, make sure you also change the self-consumption calculation method on the financial task so the correct figures will be shown in the customer proposal report.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Why won’t the structural calculations work for my project?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>Please note that not all combinations of roof material types and mounting systems have structural calculations in Easy PV. If you are unable to complete structural calculations you will need to get in touch with a structural engineer.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Easy PV automatically sets the direction in which the panels are angled when placed on flat roofs or when ground-mounted. Can I change this?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>Horizontal and portrait panels will automatically be angled toward the “bottom” or “gutter line” of the roof whether flat or ground-mounted. In roof outline mode, the “bottom” of the roof is the first side you draw. In quick roof mode and 3D design mode, the “bottom” of the roof is based on how you set the orientation of the roof. If you want to change the angle of the panels, you’ll need to change the orientation of the roof. Alternatively, you can use the Irregular Building tool in the 3D design mode which will allow you to set the orientation of the panels.</p></div>
						</div>

						<h6 class="faq-header">Financial Questions</h6>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">The payback period is 25+ years, help!</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>There are a few things that can help with the payback period. If you navigate to the financial task and scroll to the Generation and Consumption section, you can edit the electricity costs for your customer. You can also specify the export tariff in this section for excess energy that is sold to the grid.<br><br>Another tip is that if you click into the Electricity cost field there is an option to change the rate at which the electricity will increase each year. <br><br>Adding a couple of batteries to the system might also be beneficial. This will increase the initial investment required but will allow the customer to store energy produced from peak times in the day to be used later.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">How do I hide line prices in the customer proposal?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>Select Customer Proposal from the Tasks drop-down menu. In the bottom section titled Quotation you can change the pricing to 1) Show line items, 2), Show equipment and services subtotals, or 3) Only show total.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Why are there two consumption figures to choose from in the financial task and how do I know which one to use?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>If you have completed both the MCS self-consumption calculation and the Easy PV consumption calculation in the project, both figures will appear as options when you first open the Financial Task in Easy PV. You are free to choose whichever calculation.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Why do some of the financial savings appear to be different on the Customer Proposal and Easy PV Project Report?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>Easy PV uses two different methods of calculating financial savings. 1) We do a basic calculation to work out a headline year one/first year saving figure that can be used on proposal summaries, etc. This calculation doesn’t take into account inflation or degradation rate. 2) We calculate a financial forecast showing payback for a longer period (25 years by default). This takes into account inflation, degradation, and discount rates. In the first year, we apply half the % values for each of these rates rather than the full % value.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">Can I input variable rate tariffs for my customer’s electricity usage?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>At the moment, this is not yet a supported feature. However, our developers are hard at work and constantly adding new features!</p></div>
						</div>

						<h6 class="faq-header">Custom Components</h6>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">How do I add a component to Easy PV that is not on the Midsummer Wholesale website?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>Please note that when you add products that Midsummer doesn’t stock, we can only offer limited support. Please follow the steps below to add a component:<br><br>1. Navigate to the Components menu from the Easy PV homepage<br><br>2. You can then select what type of component you would like to add<br><br>3. You will first need to Add a manufacturer - this allows you to create a category for multiple products from a specific manufacturer to organise your products better<br><br>4. Click on the newly created manufacturer and then click Add (component)<br><br>5. This will bring up a menu requesting specific technical data that is required so that your custom component can be used in Easy PV's calculations. This technical data will be available on the Manufacturer's Datasheet for the productFor more detailed instructions please read our full</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">I have added a new inverter in ‘My Components’, but I’m unable to allocate panels to its inputs. How do I fix this?</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>When you add an inverter and are having difficulty, you will need to navigate back to My Components and open the inverter you have added. The most common issue is that there aren’t the correct number of trackers. Check on the manufacturer’s datasheet to see how many trackers there are for the inverter. If you need to add a tracker, click the gray words that say Add tracker in the solar sections on the right.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">I added a battery in ‘My Components’ but it isn’t showing up as an option in the Inverter task.</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>When you add a battery component, you must ensure that you have checked the appropriate checkbox to set its compatibility with your custom inverter category.</p></div>
						</div>

						<div class="faq-dropdown collapsed">
							<div class="faq-question"><div class="faq-question-text">I added a hybrid inverter to ‘My Components’ but can’t add a battery to it in the Inverter Task.</div><div class="faq-dropdown-arrow"></div></div>
							<div class="faq-answer"><p>If you are trying to use custom Hybrid Inverter and Battery components - you will need to make sure you have added the Battery as its own Component. You can do this under “Components” -> “Edit Batteries”. Make sure you select the checkbox to set its compatibility with your custom inverter category!</p></div>
						</div>

						

									
					
					</div>
				</div>

				<div class="help-tab" id="video-library">
					<h5 id="video-library-title">Video Library</h5>
					<button class="gw-button btn-large btn-tertiary title-hidden" id="video-library-back" onclick="backToLibrary()"><img class="icon" src="/testing/icons/400/24/Left.svg" alt="icon" />Video Library</button>
					<div class="video-library-container">

						<div class="video-library-item" id="3d-studio-video" onclick="expandVideo('3d-studio-video')">
							<div class="video-image">
								<img class="image" src="/testing/pages/easy-pv/help-modal/src/images/3d-studio.png" alt="3D Studio Video Thumbnail">
								<iframe class="video" src="https://www.youtube.com/embed/RTgM7j2yLIw" title="Easy PV Tutorial: 3D Design Tool" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
							</div>
							<div class="video-caption">How to use the 3D Studio to design a roof
								<div class="video-description">The new 3D Studio in Easy PV makes it super easy to create 3D models of residential and commercial buildings as part of the project design process. This training video shows you how to create a building using the 3D studio, add obstructions, surrounding buildings, trees etc. and generate automatic sun-path diagrams. If you need more help we recommend booking onto one of our daily training sessions.							</div>
							</div>
						</div>

						<div class="video-library-item" id="draw-roof-video" onclick="expandVideo('draw-roof-video')">
							<div class="video-image">
								<img class="image" src="/testing/pages/easy-pv/help-modal/src/images/draw-roof.png" alt="3D Studio Video Thumbnail">
								<iframe class="video" src="https://www.youtube.com/embed/Ts0Lh3Kp1aY" title="Easy PV Tutorial: Create a Roof" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
							</div>
							<div class="video-caption">Drawing a roof (not 3D)
								<div class="video-description">We recommend using the new 3D studio to design a roof (see other videos), but if you want to draw the roof manually this video shows you how. It walks you through the steps to create a roof in Easy PV, including: pitch, orientation, materials, roof outlines, obstructions, and guide boxes.							</div>
							</div>
						</div>

						<div class="video-library-item" id="panel-task-video" onclick="expandVideo('panel-task-video')">
							<div class="video-image">
								<img class="image" src="/testing/pages/easy-pv/help-modal/src/images/panel-task.png" alt="3D Studio Video Thumbnail">
								<iframe class="video"  src="https://www.youtube.com/embed/gy8yjTJnfuY" title="Easy PV Tutorial: Panel Task" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
							</div>
							<div class="video-caption">Panel Task
								<div class="video-description">Learn more about browsing panels, designing your panel array, and mounting systems.</div>
							</div>
						</div>

						<div class="video-library-item" id="inverter-and-electrical-task-video" onclick="expandVideo('inverter-and-electrical-task-video')">
							<div class="video-image">
								<img class="image" src="/testing/pages/easy-pv/help-modal/src/images/inverter-and-electrical-task.png" alt="3D Studio Video Thumbnail">
								<iframe class="video"  src="https://www.youtube.com/embed/3PIcLvOW-JU" title="Easy PV Tutorial: Inverter Task" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
							</div>
							<div class="video-caption">Inverter and Electrical Tasks
								<div class="video-description">This video will take you through configuring your inverter and electricals, covering topics such as: browsing inverters and batteries, allocating panels to strings and inputs, selecting batteries, isolators, cables, meters, and extras.</div>
							</div>
						</div>


						<div class="video-library-item" id="performance-task-video" onclick="expandVideo('performance-task-video')">
							<div class="video-image">
								<img class="image" src="/testing/pages/easy-pv/help-modal/src/images/performance-task.png" alt="3D Studio Video Thumbnail">
								<iframe class="video"  src="https://www.youtube.com/embed/zlBsI62fQVc" title="Easy PV Tutorial: Calculating Performance and Consumption Estimates" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
							</div>
							<div class="video-caption">Performance and Consumption Tasks
								<div class="video-description">In this video, learn about generating performance estimates for your system and modelling energy consumption. Topics explored are: panel string allocation, sunpath diagrams, MCS and Easy PV calculation methods, and selecting a self-consumption method in the financial task.</div>
							</div>
						</div>


						<div class="video-library-item" id="structural-task-video" onclick="expandVideo('structural-task-video')">
							<div class="video-image">
								<img class="image" src="/testing/pages/easy-pv/help-modal/src/images/structural-task.png" alt="3D Studio Video Thumbnail">
								<iframe class="video" src="https://www.youtube.com/embed/UZjWN49Qgqk" title="Easy PV Tutorial: Structural Calculations" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
							</div>
							<div class="video-caption">Structural Task
								<div class="video-description">This video highlights some of the regulations around structural calculations, and demonstrates how to complete the weight loading and wind loading structural calculations based on the properties of the system, the roof, local topography, and project location.</div>
							</div>
						</div>


					</div>
				</div>




				<div class="help-tab" id="guides">
					<h5 id="guide-title">Guides and Articles</h5>
					<button class="gw-button btn-large btn-tertiary title-hidden" id="guide-back" onclick="backToGuides()"><img class="icon" src="/testing/icons/400/24/Left.svg" alt="icon" />Guides and Articles</button>
				
					<div class="article-list">

						<div class="article" onclick="showArticle('component-guide')">
							<div class="article-graphic"><img class="icon icon-blue" src="/testing/icons/400/40/Inverter.svg" alt="Component Guide Icon"></div>
							<div class="article-name">Component Upload Guide<div class="article-description">Lorem ipsum dolor sit amet consectetur. Sit id id lectus et pellentesque nullam.</div></div>
							<div class="article-tag-container"><div class="gw-tag tag-compact tag-neutral">5 Min</div></div>
						</div>

						<div class="article-content" id="component-guide">
							<div class="article-title h4" id='component-guide-top'>Component Upload Guide</div>
							
							<p>A Guide to Uploading Components in Easy PV, <a class='gw-link' onclick="changeHelpTab('faqs')">do also check our FAQs for common issues and troubleshooting tips!</a></p>

							<p>This Guide is split into sections for each type of component including:</p>
							<ul>
								<li><a href='#add-component-solar-panels' class = 'gw-link'>Solar Panels</a></li>
								<li><a href='#add-component-inverters' class = 'gw-link'>Inverters</a></li>
								<li><a href='#add-component-hybrid-inverters' class = 'gw-link'>Hybrid Inverters</a></li>
								<li><a href='#add-component-batteries' class = 'gw-link'>Batteries</a></li>
							</ul>
							<p>You can access the Component Menu from the EasyPV home page, or from the navigation bar at the top of the site.</p>
							<img class="guide-image" src="/testing/pages/easy-pv/help-modal/src/images/component-upload-guide-images/sidebar.png" alt="sidebar">
							<p>Select from the menu on the left which component you would like to add from the available options.</p>
							<img class="guide-image" src="/testing/pages/easy-pv/help-modal/src/images/component-upload-guide-images/sidebar-submenu.png" alt="sidebar-submenu">
							<br>
							<a href='#component-guide-top' class='gw-link'>Back to top</a>



							<br>
							<h6 id='add-component-solar-panels'>Solar Panels</h6>
							<p>When adding a Custom Component in Easy PV you first need to add a custom manufacturer category. This allows you to better organize your custom components - with multiple components being categorized by their manufacturer when it comes to selecting them in a project.</p>
							<img class="guide-image" src="/testing/pages/easy-pv/help-modal/src/images/component-upload-guide-images/solarpanel-manufacturer.png" alt="solarpanel-manufacturer">
							<p>Once you have created a Manufacturer you can then proceed to add a number of custom panels.</p>
							<img class="guide-image" src="/testing/pages/easy-pv/help-modal/src/images/component-upload-guide-images/new-panel.png" alt="new-panel">
							<p>When adding any component - there is a set of technical information that needs to be entered so that Easy PV can conduct necessary performance calculations. This information is available from the Manufacturer’s technical Datasheet for that specific product.</p>

							<p>There can be some variation in how different manufacturers display this technical information on datasheets, so we have created a list of potential variations for each other value required to add a custom panel:</p>
															
							<div><span class="body-bold">Power:  </span>Power of the panel at STC in Watts
							<ul>
								<li>Peak Power Watts</li>
								<li>Maximum Power Pmax</li>
								<li>Power at MPP</li>	
							</ul></div>

							<div><span class="body-bold">Isc:  </span>Short circuit current of the panel at STC in A
							<ul>
								<li>Short Circuit Current</li>
								<li>Short Circuit Current Isc</li>
							</ul></div>

							<div><span class="body-bold">Impp:  </span>Maximum power point current of the panel at STC in A
							<ul>
								<li>Maximum Power Current</li>
								<li>Current at MPP</li>
							</ul></div>

							<div><span class="body-bold">Voc:  </span>Open circuit voltage of the panel at STC
							<ul>
								<li>Open Circuit Voltage</li>
							</ul></div>

							<div><span class="body-bold">Vmpp:  </span>Maximum power point voltage of the panel at STC
							<ul>
								<li>Maximum Power Voltage</li>
								<li>Voltage at MPP</li>
							</ul></div>

							<div><span class="body-bold">ΔVoc/°C:  </span>Temperature coefficient of the open circuit voltage of the panel
							<ul>
								<li>Temperature Coefficient of Voc</li>
							</ul></div>

							<div><span class="body-bold">ΔIsc/°C:  </span>The temperature coefficient of the panel short circuit current
							<ul>
								<li>Temperature Coefficient of Isc</li>
							</ul></div>

							<p>As non-Midsummer related products - we cannot provide further assistance beyond this guide in terms of adding components or with reading/understanding manufacturer datasheets. If you require assistance reading technical information from a Datasheet - please contact the manufacturer directly.</p>
							<p>Once you have added a panel successfully - you’ll be able to select it in the list of panels when creating a new project!</p>
							<a href='#component-guide-top' class='gw-link'>Back to top</a>



							<br>
							<h6 id='add-component-inverters'>Inverters</h6>
							<p>To add an inverter - add a new Inverter Manufacturer Category and specify the type of inverter you are adding from the drop-down menu.</p>
							<img class="guide-image" src="/testing/pages/easy-pv/help-modal/src/images/component-upload-guide-images/inverter-type.png" alt="inverter-type">
							<p>When adding an inverter, remember to click “Add tracker” for each (MPPT) input the inverter has.</p>
							<img class="guide-image" src="/testing/pages/easy-pv/help-modal/src/images/component-upload-guide-images/add-tracker.png" alt="add-tracker">
							<p>List of potential variations for each value on different manufacturer data sheets:</p>

							<div><span class="body-bold">Max current:  </span>Maximum AC current in Amps that the inverter can output
							<ul>
								<li>Max output current</li>
								<li>Max AC current</li>
							</ul></div>

							<div><span class="body-bold">Max power:  </span>Maximum AC power output in Watts of the inverter
							<ul>
								<li>Max recommended PV power</li>
								<li>Max AC apparent power</li>
								<li>Max apparent AC power</li>
								<li>Nominal AC power</li>
								<li>Rated output power</li>
							</ul></div>

							<div><span class="body-bold">Power factor:  </span>1 Unless stated otherwise</div>
							
							<div><span class="body-bold">Phases:  </span>Choose whether this is a single-phase or three-phase inverter</div>
							
							<div><span class="body-bold">Tracker, Vmpp range:  </span>
							<ul>
								<li>MPP voltage range</li>
								<li>Operating voltage range</li>
								<li>MPPT range</li>
							</ul></div>
							
							<div><span class="body-bold">Tracker, Max Voc:  </span>Maximum AC current in Amps that the inverter can output
							<ul>
								<li>Max DC voltage</li>
								<li>Max input voltage</li>
								<li>Max DC input power</li>
							</ul></div>
							
							<div><span class="body-bold">Max I:  </span>Maximum current
							<ul>
								<li>Max input current per MPP tracker</li>
								<li>Max input current</li>
							</ul></div>
							<a href='#component-guide-top' class='gw-link'>Back to top</a>



							<br>
							<h6 id='add-component-hybrid-inverters'>Hybrid Inverters</h6>
							<p>If the inverter you are adding is a Hybrid Inverter then you will also need to include battery information.</p>
							<img class="guide-image" src="/testing/pages/easy-pv/help-modal/src/images/component-upload-guide-images/battery.png" alt="battery">
							<p>List of potential variations for each value on different manufacturer data sheets:</p>

	
							<div><span class="body-bold">Max Charge Rate:  </span>The maximum power at which the inverter can charge a battery
							<ul>
								<li>Max charge power</li>
							</ul></div>
									
							<div><span class="body-bold">Max Discharge Rate:  </span>The maximum power that the inverter can draw from a battery. This is often the same as the maximum charge rate
							<ul>
								<li>Max discharge power</li>
							</ul></div>
									
							<div><span class="body-bold">Charge Efficiency:  </span>The efficiency of the charge process. Datasheets may have several values; the ‘Euro’ efficiency is usually the most representative. 
							<ul>
								<li>Euro efficiency</li>
							</ul></div>
									
							<div><span class="body-bold">Discharge Efficiency:  </span>The efficiency of the discharge process. If no separate value is given on the datasheet, use the same value as for charge efficiency.
							<ul>
								<li>Battery discharge</li>
							</ul></div>
									
							<div><span class="body-bold">Min Battery Capacity:  </span>The capacity of the smallest battery bank that should be used with this inverter.</div>
							<div><span class="body-bold">Max Battery Capacity:  </span>The capacity of the largest battery bank that should be used with this inverter.</div>
							<div><span class="body-bold">Max Discharge Depth:  </span>The maximum depth to which the inverter will discharge an attached battery. Easy PV uses the lower of the max discharge for the inverter. You can use 100% if no figure is given in the datasheet.</div>
							<div><span class="body-bold">Max Batteries:  </span>If the inverter has a maximum number of batteries that can be connected, enter it here. Leave blank if there is no maximum.</div>
							<a href='#component-guide-top' class='gw-link'>Back to top</a>



							<br>
							<h6  id='add-component-batteries'>Batteries</h6>
							<p>If you’re looking to add a battery, this needs to be input separately to the inverter:</p>
							<img class="guide-image" src="/testing/pages/easy-pv/help-modal/src/images/component-upload-guide-images/add-battery.png" alt="add-battery">
							<p>From here you can add the relevant battery details. Notice you can select which inverter the battery is compatible with from the list.</p>
							<img class="guide-image" src="/testing/pages/easy-pv/help-modal/src/images/component-upload-guide-images/inverter-brands.png" alt="inverter-brands">
							<p>The battery will auto-save once all the required fields are completed.</p>

							<p>List of potential variations for each value on different manufacturer data sheets:</p>

							<div><span class="body-bold">Battery Capacity:  </span>Total battery capacity. Usable capacity may be less if there is a max permitted discharge depth.
							<ul>
								<li>Battery modal energy</li>
								<li>Battery system capacity</li>
							</ul></div>

							<div><span class="body-bold">Max Discharge:  </span>Maximum depth to which the manufacturer recommends that this battery is discharged. Typically 80 or 90%.
							<ul>
								<li>Depth of discharge</li>
							</ul></div>

							<div><span class="body-bold">Round Trip Efficiency:  </span>percentage of electricity recovered from the battery in a charge-discharge cycle. Around 95% is typical for lithium ion batteries.
							<ul>
								<li>Peak roundtrip efficiency</li>
							</ul></div>
							<a href='#component-guide-top' class='gw-link'>Back to top</a>
						</div>


						<div class="article" onclick="showArticle('user-management-guide')">
							<div class="article-graphic"><img class="icon icon-blue" src="/testing/icons/400/40/User Settings.svg" alt="User Management Guide Icon"></div>
							<div class="article-name">User Management Guide<div class="article-description">Lorem ipsum dolor sit amet consectetur. Sit id id lectus et pellentesque nullam.</div></div>
							<div class="article-tag-container"><div class="gw-tag tag-compact tag-neutral">3 Min</div></div>
						</div>

						<div class="article-content" id="user-management-guide">
							<div class="article-title h6">User Management Guide</div>
							
						</div>


						<div class="article" onclick="showArticle('sharing-permissions-guide')">
							<div class="article-graphic"><img class="icon icon-blue" src="/testing/icons/400/40/Share.svg" alt="sharing permissions guide Icon"></div>
							<div class="article-name">Sharing Permissions Guide<div class="article-description">Lorem ipsum dolor sit amet consectetur. Sit id id lectus et pellentesque nullam.</div></div>
							<div class="article-tag-container"><div class="gw-tag tag-compact tag-neutral">4 Min</div></div>
						</div>

						<div class="article-content" id="sharing-permissions-guide">
							<div class="article-title h6">Sharing Permissions Guide</div>
							<p>Lorem Ipsum</p>
						</div>

					</div>

				

				</div>
			



				<div class="help-tab" id="upgrade-options">
					<h5>Upgrade Options</h5>

					<div class="text-and-body">
					Free
					<p>Lorem ipsum dolor sit amet consectetur. Integer vitae elit commodo eros quam in. Faucibus urna ornare et egestas nisi sed pellentesque tincidunt. Mi cursus commodo varius enim ut nibh. </p>
					</div>

					<div class="text-and-body">
					Pro
					<p>Lorem ipsum dolor sit amet consectetur. Integer vitae elit commodo eros quam in. Faucibus urna ornare et egestas nisi sed pellentesque tincidunt. Mi cursus commodo varius enim ut nibh. </p>
					</div>
					
					<div class="text-and-body">
					Enterprise
					<p>Lorem ipsum dolor sit amet consectetur. Integer vitae elit commodo eros quam in. Faucibus urna ornare et egestas nisi sed pellentesque tincidunt. Mi cursus commodo varius enim ut nibh. </p>
					</div>

					<div class="tiers-table">
						<div class="tiers-row"><div class="feature"></div><div class="confirm header">Free</div><div class="confirm header">Pro</div><div class="confirm header">Enterprise</div></div>
						<div class="tiers-row spacer"></div>
						
						<div class="tiers-row"><div class="feature">Cost per user</div><div class="confirm">Free</div><div class="confirm">£35 / month</div><div class="confirm">On inquiry</div></div>
						<div class="tiers-row"><div class="feature">Users</div><div class="confirm">1</div><div class="confirm">Unlimited</div><div class="confirm">Unlimited</div></div>
						<div class="tiers-row"><div class="feature">Support and training</div><div class="confirm">Basic</div><div class="confirm">Dedicated</div><div class="confirm">Priority</div></div>
						<div class="tiers-row spacer"></div>

						<div class="tiers-row"><div class="feature"></div><div class="confirm header">Free</div><div class="confirm header">Pro</div><div class="confirm header">Enterprise</div></div>
						<div class="tiers-row"><div class="feature">2D & 3D roof design</div><div class="confirm tick"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">PV system design</div><div class="confirm tick"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Performance calculations</div><div class="confirm tick"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Structural analysis</div><div class="confirm tick"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Automatic schematic</div><div class="confirm tick"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Financial projections</div><div class="confirm tick"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Customer proposal</div><div class="confirm tick"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Automated DNO forms</div><div class="confirm tick"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row spacer"></div>

						<div class="tiers-row"><div class="feature"></div><div class="confirm header grey">Free</div><div class="confirm header">Pro</div><div class="confirm header">Enterprise</div></div>
						<div class="tiers-row"><div class="feature">Project sharing & team management</div><div class="confirm cross"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Project file management</div><div class="confirm cross"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Email templates & sending</div><div class="confirm cross"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Project status</div><div class="confirm cross"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Pre-installation survey</div><div class="confirm cross"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Post install photographic record</div><div class="confirm cross"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Automatic project pricing calculator</div><div class="confirm cross"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">E-signing</div><div class="confirm cross"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Additional forms and reports</div><div class="confirm cross"></div><div class="confirm tick"></div><div class="confirm tick"></div></div>
						<div class="tiers-row spacer"></div>

						<div class="tiers-row"><div class="feature"></div><div class="confirm header grey">Free</div><div class="confirm header grey">Pro</div><div class="confirm header">Enterprise</div></div>
						<div class="tiers-row"><div class="feature">Custom branding</div><div class="confirm cross"></div><div class="confirm cross"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Custom forms and reports</div><div class="confirm cross"></div><div class="confirm cross"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">User roles</div><div class="confirm cross"></div><div class="confirm cross"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Custom CRM integration</div><div class="confirm cross"></div><div class="confirm cross"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Dedicated server</div><div class="confirm cross"></div><div class="confirm cross"></div><div class="confirm tick"></div></div>
						<div class="tiers-row"><div class="feature">Two-factor-authentication</div><div class="confirm cross"></div><div class="confirm cross"></div><div class="confirm tick"></div></div>
						<div class="tiers-row spacer"></div>

						<div class="tiers-row">
							<div class="feature"></div>
							<div class="confirm"><button class="gw-button  btn-tertiary btn-small">Get Designing</button></div>
							<div class="confirm"><button class="gw-button  btn-tertiary btn-small">Upgrade Now</button></div>
							<div class="confirm"><button class="gw-button btn-tertiary btn-small" onclick="changeHelpTab('contact-us')">Contact Us</button></div>
						</div>
					
					</div>
				</div>


				<div class="help-tab" id="contact-us">
					<h5>Contact Us</h5>
				
					<div class="text-and-body">
					Need more help?
					<p>Can't find what you’re looking for in our FAQ or on our videos? Feel free to contact us on out email if you have any questions or queries. 

					If you’re just struggling a bit, don’t forget we have training sessions with our team who will help you learn to use Easy PV like an expert!</p>
					</div>

					<div class="contact-box email" onclick="copyEmail()">
						<div class="logo-details">
							<img class="image" src="/testing/icons/400/40/Email.svg" alt="3D Studio Video Thumbnail">
							<div class="details">
								Email
								<p id="textToCopy">help@easy-pv.co.uk</p>
							</div>
						</div>
						<div class="contact-controls">
							<a target="_blank" href="mailto:help@easy-pv.co.uk?subject=Help%20with%20Easy%20PV&body=Dear%20Recipient,"><button class="gw-button btn-large icon-only btn-tertiary"><img class="icon" src="/testing/icons/400/24/Send.svg" alt="icon" /></button></a>
							<button onclick="copyEmail()" class="gw-button btn-large icon-only btn-tertiary copy-button"><img class="icon" src="/testing/icons/400/24/Copy.svg" alt="icon" /></button>
						</div>
					</div>

					<div class="divider"></div>

					<div class="text-and-body">
					Just looking to connect?
					<p>Follow us on social media to keep up to date on new updates, big launches or insider tips!</div>

					<a class="contact-link" target="_blank" href="https://www.linkedin.com/in/easy-pv/">
						<div class="contact-box linkedin">
							<div class="logo-details">
								<img src="/testing/pages/easy-pv/help-modal/src/images/linkedin.svg" alt="linkedIn Logo">
								<div class="details">
									LinkedIn
									<p>Easy PV</p>
								</div>
							</div>
							<button class="gw-button btn-large icon-only btn-tertiary"><img class="icon" src="/testing/icons/400/24/Open In New Tab.svg" alt="icon" /></button>
						</div>
					</a>

					<a class="contact-link" target="_blank" href="https://twitter.com/EasyPV">
						<div class="contact-box x">
							<div class="logo-details">
								<img src="/testing/pages/easy-pv/help-modal/src/images/x.svg" alt="X Logo">
								<div class="details">
									X
									<p>@EasyPV</p>
								</div>
							</div>
							<button class="gw-button btn-large icon-only btn-tertiary"><img class="icon" src="/testing/icons/400/24/Open In New Tab.svg" alt="icon" /></button>
						</div>
					</a>

					<a class="contact-link" target="_blank" href="https://www.youtube.com/channel/UCcGCnLQs7n1d5b7CTstihfg">
						<div class="contact-box youtube">
							<div class="logo-details">
								<img src="/testing/pages/easy-pv/help-modal/src/images/youtube.svg" alt="YouTube Logo">
								<div class="details">
									YouTube
									<p>Easy-PV Solar Designer</p>
								</div>
							</div>
							<button class="gw-button btn-large icon-only btn-tertiary"><img class="icon" src="/testing/icons/400/24/Open In New Tab.svg" alt="icon" /></button>
						</div>
					</a>

				</div>
			
			
			


			


			</div>
			<div class="modal-rhs">
				<div class="gw-sidebar-tab-section">
					Help
					<div class="sidebar-tabs">
						<div class="sidebar-tab" onclick="changeHelpTab('faqs')" id="faqs-option">FAQs</div>
						<div class="sidebar-tab" onclick="changeHelpTab('video-library')" id="video-library-option">Video Library</div>
						<div class="sidebar-tab" onclick="changeHelpTab('guides')" id="guides-option">Guides and Articles</div>
						<div class="sidebar-tab" onclick="changeHelpTab('upgrade-options')" id="upgrade-options-option">Upgrade Options</div>
						<div class="sidebar-tab" onclick="changeHelpTab('contact-us')" id="contact-us-option">Contact Us</div>
					</div>
				</div>
				<a href='https://cal.com/easy-pv' target="_blank"><div class="gw-information-box info">
				<div class="information-header-and-button"><div class="information-header-container"><div class="information-icon"></div><div class="information-header">Looking for more?</div></div><img class="icon" src="/testing/icons/400/20/Open In New Tab.svg" alt="icon" /></div>
                    Or can't find what you need? We also do twice weekly training, check it out here.
				</div></a>
			</div>
		</div>
		`)
	}
}

modals.funcs.helpModal = modal