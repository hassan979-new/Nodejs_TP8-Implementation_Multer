const form = document.querySelector("form");
const progressBar = document.getElementById("progressBar");
const status = document.getElementById("status");
const fileInput = document.querySelector('input[type="file"]');

// Validation fichier
function validateFile(file) {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp"
  ];

  const maxSize = 5 * 1024 * 1024;

  if (!allowedTypes.includes(file.type)) {
    return "Type de fichier non autorisé";
  }

  if (file.size > maxSize) {
    return "Fichier trop volumineux (max 5MB)";
  }

  return null;
}

// Validation avant envoi
fileInput.addEventListener("change", function () {
  const files = Array.from(this.files);

  for (let file of files) {
    const error = validateFile(file);

    if (error) {
      alert(error);
      this.value = "";
      return;
    }
  }
});

// Upload avec progression
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = new FormData(form);

  const xhr = new XMLHttpRequest();

  xhr.open("POST", form.action, true);

  // Reset UI
  progressBar.style.width = "0%";
  status.innerText = "Upload en cours...";

  // Progress bar
  xhr.upload.onprogress = function (event) {
    if (event.lengthComputable) {
      const percent = (event.loaded / event.total) * 100;
      progressBar.style.width = percent + "%";
    }
  };

  // Succès
  xhr.onload = function () {
    if (xhr.status === 200) {
      progressBar.style.width = "100%";
      status.innerText = "Upload réussi";
    } else {
      status.innerText = "Erreur upload";
    }
  };

  // Erreur réseau
  xhr.onerror = function () {
    status.innerText = "Erreur réseau";
  };

  xhr.send(formData);
});