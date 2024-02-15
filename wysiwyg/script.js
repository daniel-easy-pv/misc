$('.toolbar a').click(function(e) {
    const command = $(this).data('command');
    if (command == 'createlink') {
      url = prompt('Enter the link here: ', 'https:\/\/');
      document.execCommand(command, false, url);
    } else document.execCommand(command, false, null);
  });