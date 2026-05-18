# Node.js – Démo Upload de fichiers avec Express et Multer

## 📖 Description
Ce projet est une **application Node.js** utilisant **Express.js** et **Multer** pour gérer le téléversement de fichiers (images).  
Il propose plusieurs scénarios : upload simple, upload multiple et upload avec métadonnées.  
Le projet inclut également une interface utilisateur avec **HTML/CSS/JS** et une gestion des miniatures via **Sharp**.

---

## 📂 Structure du projet
```
express-upload-demo/
├── package.json
├── package-lock.json
├── server.js
├── uploads/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── upload.js
└── views/
└── index.html
```

---

## ⚙️ Fonctionnalités

### Upload simple
- Formulaire pour téléverser une seule image.  
- Validation côté client (type et taille ≤ 5 Mo).  
- Génération automatique d’une **miniature** avec **Sharp**.  

### Upload multiple
- Formulaire pour téléverser jusqu’à **3 images**.  
- Affichage des fichiers uploadés avec aperçu.  
- Nettoyage automatique des fichiers en cas d’erreur.  

### Upload avec métadonnées
- Formulaire avec **titre**, **description**, image principale et galerie.  
- Upload multi-champs avec **Multer.fields()**.  
- Limite de **2 images supplémentaires** pour la galerie.  

### Interface utilisateur
- Design moderne avec **cards** et **progress bar**.  
- Messages de succès et d’erreur stylisés.  
- Validation côté client avec JavaScript.  

### Sécurité et robustesse
- Filtrage des fichiers par **MIME type** et extension.  
- Limite de taille (5 Mo).  
- Nettoyage des fichiers en cas d’erreur.  

---

## 🖥️ Exemple d’exécution

https://github.com/user-attachments/assets/ec8f1695-b5f7-4a6b-9d7a-b4c28cdd021f

---

## 💡 Concepts pratiqués
- Utilisation de **Multer** pour la gestion des fichiers.  
- Création de miniatures avec **Sharp**.  
- Validation côté client avec **JavaScript**.  
- Interface utilisateur responsive avec **HTML/CSS**.  
- Architecture Express avec routes dédiées.  
- Gestion des erreurs et nettoyage des fichiers.  

---

## 🧑‍💻 Auteur
👤 **Agouram Hassan**  
⚙️ Développement Node.js – Démo Upload avec Express et Multer  
🎓 Instructor : **Mr. LACHGAR**  
📅 18 Mai 2026

