# Prospection CRM

Application de suivi de prospection commerciale (Entreprises, Contacts,
Activités, Applications produit), à usage personnel et local.

## Stack

- **Frontend** : React + Vite, navigation par React Router (page d'accueil à
  cartes, puis onglets horizontaux à l'intérieur de chaque module).
- **Backend** : petit serveur Express exposant une API REST.
- **Persistance** : SQLite (`better-sqlite3`), fichier `data/crm.db` créé
  automatiquement au premier démarrage. Les données survivent aux
  redémarrages et rechargements — c'est un vrai fichier sur disque, facile
  à sauvegarder en le copiant.

Ce choix (plutôt qu'IndexedDB pur) a été retenu pour la fiabilité de la
persistance, la simplicité des requêtes avec jointures entre modules
(Entreprise ↔ Contact ↔ Activité ↔ Application), et parce qu'il reste très
simple à lancer et maintenir seul au quotidien.

## Démarrage en un clic

Après avoir récupéré ce dossier sur ta machine, double-clique sur le
fichier correspondant à ton système :

- **Windows** : `Demarrer-CRM.bat`
- **macOS** : `Demarrer-CRM.command`
- **Linux** : `demarrer-crm.sh` (le rendre exécutable une fois si besoin :
  clic droit → Propriétés → Autoriser l'exécution, ou `chmod +x demarrer-crm.sh`)

Le premier lancement installe les dépendances et construit l'application
(peut prendre une minute), les suivants sont quasi instantanés. Le
navigateur s'ouvre automatiquement sur le CRM. Pour arrêter, ferme la
fenêtre de terminal qui s'est ouverte (ou Ctrl+C).

## Démarrage manuel (développement)

```bash
npm install
npm run dev
```

Cela lance en parallèle le serveur API (port 3001) et le serveur de
développement Vite (port 5173, avec proxy `/api` vers le backend, et
rechargement à chaud). Ouvrir http://localhost:5173.

## Production locale

```bash
npm run build
npm start
```

Sert l'application buildée directement depuis Express sur
http://localhost:3001.

## Logique métier

- Identifiants auto-générés par module, jamais réutilisés même après
  suppression : Entreprise (`0001`…), Contact (`10001`…), Activité
  (`20001`…), Application (`30001`…).
- Un Contact doit toujours être rattaché à une Entreprise existante.
- Une Entreprise ne peut pas être supprimée tant que des Contacts lui sont
  rattachés.
- La page d'accueil affiche les "Prochaines actions" issues du module
  Activité, avec mise en évidence des actions en retard.
