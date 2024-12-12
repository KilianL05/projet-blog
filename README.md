# Projet Blog

## Description

Ce projet est une application de blog qui permet aux utilisateurs de créer, lire, mettre à jour et supprimer des blogs et des articles. Il inclut également une authentification à deux facteurs (2FA) pour une sécurité accrue.

## Fonctionnalités

- Authentification des utilisateurs
- Authentification à deux facteurs (2FA)
- Création, lecture, mise à jour et suppression de blogs
- Création, lecture, mise à jour et suppression d'articles
- Gestion des sessions utilisateur

## Prérequis

- Node.js
- npm
- MySQL

## Installation

1. Clonez le dépôt :

    ```bash
    git clone https://github.com/votre-utilisateur/projet-blog.git
    cd projet-blog
    ```

2. Installez les dépendances :

    ```bash
    npm install
    ```

3. Configurez les variables d'environnement en créant un fichier `.env` à la racine du projet avec le contenu suivant :

    ```dotenv
    JWT_SECRET=your_secret_key
    JWT_EXPIRATION=your_expiration_time

    DB_NAME=your_db_name
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    DB_HOST=your_db_host

    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret
    ```

4. Assurez-vous d'avoir un serveur MySQL en cours d'exécution et créez la base de données en exécutant :

    ```bash
    node db.js
    ```

5. Lancez le projet :

    ```bash
    npm start
    ```

6. Dans un autre terminal, créez des données initiales :

    ```bash
    node script.js
    ```

## Utilisation

- Accédez à l'application via `http://localhost:3000`
- Inscrivez-vous et connectez-vous pour utiliser les fonctionnalités de blog
- Activez l'authentification à deux facteurs pour une sécurité accrue avec l'application mobile Google Authenticator

## Auteurs

- Killian Levasseur
- Jules Artaud
