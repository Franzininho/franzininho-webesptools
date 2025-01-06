document.getElementById('customInstallButton').addEventListener('click', async (event) => {
    const files = [];
    for (let i = 1; i <= 4; i++) {
      const binInput = document.getElementById(`bin${i}`);
      const offsetInput = document.getElementById(`offset${i}`);
      if (binInput.files.length > 0 && offsetInput.value) {
        files.push({
          path: URL.createObjectURL(binInput.files[0]),
          offset: offsetInput.value
        });
      }
    }
  
    if (files.length > 0) {
      const manifest = {
        name: "Custom Firmware",
        builds: [
          {
            chipFamily: "ESP32-S2",
            parts: files
          }
        ]
      };
  
      const customInstallButton = document.getElementById('customInstallButton');
      customInstallButton.manifest = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/json' }));
    } else {
      alert('Please select at least one binary file and specify its offset.');
      event.preventDefault(); // Prevent the default action if no files are selected
    }
  });
  
  window.onload = function() {
    if (navigator.serial) {
      document.getElementById("notSupported").style.display = 'none';
      document.getElementById("main").style.display = 'block';
    } else {
      document.getElementById("notSupported").style.display = 'block';
      document.getElementById("main").style.display = 'none';
    }
  };