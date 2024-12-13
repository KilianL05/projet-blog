## Informations générales

**Groupe** : Killian Levasseur, Jules Artaud

**Stack du projet** :
- HTML, JavaScript pour le frontend
- NodeJS (Express) pour le backend
- MySQL pour la base de données

**Contexte** :
Vous devez réaliser une application de création de blog. Chaque personne peut créer son espace, dès le moment où celle-ci a créé son compte. Le blog de chaque personne peut être disponible en public (chaque visiteur peut lire les contenus sans pour autant être identifié) ou en privé (le visiteur doit disposer d'un compte et être identifié pour visualiser le contenu). Des privilèges doivent être plus élevés pour créer du contenu : dans ce cas, une authentification à deux facteurs est nécessaire.

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

## Routes

### Authentification

- **POST /register** : Inscription d'un nouvel utilisateur.
- **POST /login** : Connexion d'un utilisateur existant.
- **POST /logout** : Déconnexion de l'utilisateur actuel.
- **POST /logout-all** : Déconnexion de l'utilisateur actuel de tous les appareils.
- **GET /login/federated/google** : Connexion via Google.
- **GET /oauth2/redirect/google** : Redirection après l'authentification Google.

### Authentification à deux facteurs (2FA)

- **GET /2fa** : Page de configuration de l'authentification à deux facteurs.
- **GET /qrcode** : Génération du QR code pour l'authentification à deux facteurs.
- **GET /verify-2fa** : Page de vérification de l'authentification à deux facteurs.
- **POST /verify-2fa** : Vérification du code TOTP pour l'authentification à deux facteurs.

### Blogs

- **GET /blogsPublic** : Récupération de tous les blogs publics.
- **GET /blogsPrivate** : Récupération de tous les blogs privés (authentification requise).
- **GET /blogs/user** : Récupération des blogs de l'utilisateur connecté (authentification requise).
- **POST /blog** : Création d'un nouveau blog (authentification requise).
- **PUT /blog/:id** : Mise à jour d'un blog existant (authentification requise).
- **DELETE /blog/:id** : Suppression d'un blog existant (authentification requise).
- **GET /blogs/:id** : Récupération d'un blog par son ID avec ses articles.

### Articles

- **POST /blog/:id/article** : Création d'un nouvel article dans un blog (authentification requise).
- **PUT /article/:id** : Mise à jour d'un article existant (authentification requise).
- **DELETE /article/:id** : Suppression d'un article existant (authentification requise).

### Espace personnel

- **GET /personal-space** : Page de l'espace personnel de l'utilisateur.
- **GET /personal-spaceCheck** : Vérification de l'activation de l'authentification à deux facteurs (authentification requise).

Ces routes permettent de gérer l'authentification des utilisateurs, l'authentification à deux facteurs, ainsi que la création, la lecture, la mise à jour et la suppression de blogs et d'articles.

## Auteurs

- Killian Levasseur
- Jules Artaud