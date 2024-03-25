document.addEventListener("DOMContentLoaded", function () {
    // Array of Lorem Ipsum tips
    const loremTips = [
      "Quick Tip: You can press ‘N’ on your keyboard to skip through the sections of the electrical task.",
      "Quick Tip: You can select multiple panels in the panels task by holding down ‘shift’ and dragging your cursor across the panels!",
      "Did you know? Easy PV can automatically calculate the shade factor on a project made with the 3D design mode.",
      "Upgrading to easy PV pro not only gives you access to loads of great features, it also get you priority Easy PV support!",
      "Did you know? If you click on the task icon in your while browsing all your projects, you can go directly to that task within that project.",
      "Connect your Midsummer Wholesale account to see your Midsummer prices within Easy PV and quickly order your kits in one click!",
      "Did you know? You can use the arrow keys to add more panels on roofs.",
      "Feeling stuck? Check out our in-depth FAQs, so you don’t have to wait to get any questions answered.",
      "Want to get the most out of Easy PV? Its in-built collaboration with Midsummer Wholesale allows you to streamline your workflow by using both together!",
      "Using 'roof outline' mode? Don't forget that the first roof line you draw is the gutter line?",
      "Coming soon: Different consumption profiles for commercial sized projects",
      "MCS Self-consumption calculation unavailable? You can still use the consumption task to estimate the self-consumption of your project!",
      "Customer proposal not generating properly? Make sure you’ve completed all the required tasks correctly."
    ];
  
    // Get the loading text element
    const loadingText = document.getElementById("loading-text");
  
    // Function to get a random tip
    function getRandomTip() {
      const randomIndex = Math.floor(Math.random() * loremTips.length);
      return loremTips[randomIndex];
    }
  
    // Display a random tip on the loading screen
    loadingText.textContent = getRandomTip();
  });
  