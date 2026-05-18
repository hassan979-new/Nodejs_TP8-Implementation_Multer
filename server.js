// Importation des modules nécessaires
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// Création du dossier uploads si nécessaire
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Middleware statique
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Fonction de nettoyage des fichiers en cas d'erreur
function cleanupFiles(files) {
  if (!files) return;

  if (Array.isArray(files)) {
    files.forEach(file => fs.unlink(file.path, () => {}));
  } else if (files.path) {
    fs.unlink(files.path, () => {});
  } else if (typeof files === 'object') {
    Object.values(files).forEach(group => {
      group.forEach(file => fs.unlink(file.path, () => {}));
    });
  }
}

// Configuration des fichiers autorisés
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedMimeTypes.includes(file.mimetype) &&
    allowedExtensions.includes(ext)
  ) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées'), false);
  }
};

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

// Upload simple
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 3
  }
});

// Upload multi-champs
const uploadMixed = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
}).fields([
  { name: 'image', maxCount: 1 },
  { name: 'galerie', maxCount: 2 }
]);

// Route accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Upload simple fichier
app.post('/upload', upload.single('fichier'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("Aucun fichier");
  }

  const inputPath = req.file.path;
  const outputPath = "uploads/thumb-" + req.file.filename;

  // création miniature
  await sharp(inputPath)
    .resize(300)
    .toFile(outputPath);

  res.send(`
    <h1>Upload réussi</h1>
    <p>Image originale :</p>
    <img src="/uploads/${req.file.filename}" width="300">

    <p>Miniature :</p>
    <img src="/uploads/thumb-${req.file.filename}" width="150">
  `);
});

// Upload multiple fichiers
app.post('/upload-multiple', upload.array('fichiers', 3), (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('Aucun fichier envoyé');
  }

  const list = req.files.map(f => `
    <li>
      ${f.originalname}
      <img src="/uploads/${f.filename}" style="max-width:200px;">
    </li>
  `).join('');

  res.send(`
    <h1>Fichiers uploadés</h1>
    <ul>${list}</ul>
  `);
}, (err, req, res, next) => {
  if (req.files) cleanupFiles(req.files);

  res.status(400).send(`
    <h1>Erreur upload multiple</h1>
    <p>${err.message}</p>
  `);
});

// Upload avec champs multiples
app.post('/upload-with-data', uploadMixed, (req, res, next) => {
  if (!req.files || !req.files.image) {
    return res.status(400).send('Image principale requise');
  }

  const titre = req.body.titre || '';
  const description = req.body.description || '';

  const mainImage = req.files.image[0];
  const gallery = req.files.galerie || [];

  const galleryHtml = gallery.map(img => `
    <img src="/uploads/${img.filename}" style="max-width:200px;">
  `).join('');

  res.send(`
    <h1>${titre}</h1>
    <p>${description}</p>
    <img src="/uploads/${mainImage.filename}" style="max-width:300px;">
    <div>${galleryHtml}</div>
  `);
}, (err, req, res, next) => {
  if (req.files) cleanupFiles(req.files);

  res.status(400).send(`
    <h1>Erreur upload</h1>
    <p>${err.message}</p>
  `);
});

// Démarrage serveur
app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});