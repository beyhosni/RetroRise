# 🚀 RetroRise

Une plateforme e-commerce moderne pour la vente de sneakers et drops exclusifs.

RetroRise acquiert des marques cultes mais disparues

## 📋 Sommaire

- [Architecture du projet](#-architecture-du-projet)
- [Technologies utilisées](#-technologies-utilisées)
  - [Frontend](#frontend)
  - [Backend](#backend)
  - [Infrastructure](#infrastructure)
  - [Monitoring](#monitoring)
- [API Endpoints](#-api-endpoints)
- [Installation](#-installation)
- [Configuration](#-configuration)

## 🏗️ Architecture du projet

RetroRise est une application microservices basée sur une architecture Spring Boot, avec un frontend React. Les services communiquent entre eux via Kafka pour les événements asynchrones et utilisent PostgreSQL comme base de données persistante.

```
RetroRise/
├── frontend/                 # Application React
├── services/                 # Microservices Spring Boot
│   ├── brand-service/       # Service de gestion des marques
│   ├── drop-service/        # Service de gestion des drops
│   ├── order-service/       # Service de gestion des commandes
│   ├── notification-service/ # Service de gestion des notifications
│   └── gateway-service/     # API Gateway
├── monitoring/               # Configuration monitoring
│   ├── grafana/
│   └── prometheus/
└── docker-compose.yml       # Orchestration des conteneurs
```

## 🛠️ Technologies utilisées

### Frontend

| Technologie | Description |
|------------|-------------|
| <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /> | Bibliothèque JavaScript pour construire des interfaces utilisateur |
| <img src="https://img.shields.io/badge/Redux-593D88?style=for-the-badge&logo=redux&logoColor=white" alt="Redux" /> | Gestion d'état de l'application |
| <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white" alt="React Router" /> | Routage côté client |
| <img src="https://img.shields.io/badge/styled--components-DB7093?style=for-the-badge&logo=styled-components&logoColor=white" alt="Styled Components" /> | CSS-in-JS pour le style des composants |
| <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" /> | Client HTTP pour les requêtes API |
| <img src="https://img.shields.io/badge/Lucide-000000?style=for-the-badge&logo=lucide&logoColor=white" alt="Lucide Icons" /> | Bibliothèque d'icônes |
| <img src="https://img.shields.io/badge/Date--FNS-000000?style=for-the-badge&logo=date-fns&logoColor=white" alt="Date FNS" /> | Manipulation de dates |
| <img src="https://img.shields.io/badge/React--Hot--Toast-000000?style=for-the-badge&logo=react-hot-toast&logoColor=white" alt="React Hot Toast" /> | Notifications toast |

### Backend

| Technologie | Description |
|------------|-------------|
| <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java" /> | Langage de programmation principal (v17+) |
| <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot" /> | Framework principal pour les microservices |
| <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white" alt="Spring Security" /> | Sécurité et authentification |
| <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /> | Base de données relationnelle |
| <img src="https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white" alt="Redis" /> | Cache et sessions |
| <img src="https://img.shields.io/badge/Kafka-231F20?style=for-the-badge&logo=apache-kafka&logoColor=white" alt="Kafka" /> | Bus de messages pour événements asynchrones |
| <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white" alt="JWT" /> | Authentification via tokens |
| <img src="https://img.shields.io/badge/Lombok-6DB33F?style=for-the-badge&logo=lombok&logoColor=white" alt="Lombok" /> | Réduction du code boilerplate |
| <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white" alt="Swagger" /> | Documentation API |

### Infrastructure

| Technologie | Description |
|------------|-------------|
| <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" /> | Conteneurisation des applications |
| <img src="https://img.shields.io/badge/Docker_Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker Compose" /> | Orchestration des conteneurs |
| <img src="https://img.shields.io/badge/Keycloak-339933?style=for-the-badge&logo=keycloak&logoColor=white" alt="Keycloak" /> | Gestion de l'identité et des accès |
| <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" /> | Reverse proxy et load balancer |
| <img src="https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" /> | Base de données relationnelle (4 instances) |

### Monitoring

| Technologie | Description |
|------------|-------------|
| <img src="https://img.shields.io/badge/Prometheus-E6522C?style=for-the-badge&logo=prometheus&logoColor=white" alt="Prometheus" /> | Collecte de métriques |
| <img src="https://img.shields.io/badge/Grafana-F46800?style=for-the-badge&logo=grafana&logoColor=white" alt="Grafana" /> | Visualisation des métriques |

## 📡 API Endpoints

### Brand Service

| Méthode | Endpoint | Description | Rôles requis |
|---------|----------|-------------|--------------|
| POST | `/brands` | Créer une nouvelle marque | ADMIN, OPS |
| GET | `/brands/{id}` | Récupérer une marque par ID | ADMIN, OPS, CUSTOMER |
| GET | `/brands` | Récupérer toutes les marques (paginées) | ADMIN, OPS, CUSTOMER |
| GET | `/brands/active` | Récupérer les marques actives | ADMIN, OPS, CUSTOMER |
| GET | `/brands/active/paginated` | Récupérer les marques actives (paginées) | ADMIN, OPS, CUSTOMER |
| GET | `/brands/search` | Rechercher des marques | ADMIN, OPS, CUSTOMER |
| GET | `/brands/industry/{industry}` | Récupérer les marques par industrie | ADMIN, OPS, CUSTOMER |
| GET | `/brands/score/{minScore}` | Récupérer les marques par score minimum | ADMIN, OPS, CUSTOMER |
| PUT | `/brands/{id}` | Mettre à jour une marque | ADMIN, OPS |
| DELETE | `/brands/{id}` | Supprimer une marque | ADMIN |

### Drop Service

| Méthode | Endpoint | Description | Rôles requis |
|---------|----------|-------------|--------------|
| POST | `/drops` | Créer un nouveau drop | ADMIN, OPS |
| GET | `/drops/{id}` | Récupérer un drop par ID | ADMIN, OPS, CUSTOMER |
| GET | `/drops` | Récupérer tous les drops (paginés) | ADMIN, OPS, CUSTOMER |
| GET | `/drops/published` | Récupérer les drops publiés | ADMIN, OPS, CUSTOMER |
| GET | `/drops/published/paginated` | Récupérer les drops publiés (paginés) | ADMIN, OPS, CUSTOMER |
| GET | `/drops/active` | Récupérer les drops actifs | ADMIN, OPS, CUSTOMER |
| GET | `/drops/active/paginated` | Récupérer les drops actifs (paginés) | ADMIN, OPS, CUSTOMER |
| GET | `/drops/search` | Rechercher des drops | ADMIN, OPS, CUSTOMER |
| GET | `/drops/brand/{brandId}` | Récupérer les drops par marque | ADMIN, OPS, CUSTOMER |
| GET | `/drops/brand/{brandId}/published` | Récupérer les drops publiés par marque | ADMIN, OPS, CUSTOMER |
| PUT | `/drops/{id}` | Mettre à jour un drop | ADMIN, OPS |
| DELETE | `/drops/{id}` | Supprimer un drop | ADMIN |

### Order Service

| Méthode | Endpoint | Description | Rôles requis |
|---------|----------|-------------|--------------|
| POST | `/orders` | Créer une nouvelle commande | ADMIN, OPS, CUSTOMER |
| POST | `/orders/{id}/payment` | Traiter le paiement d'une commande | ADMIN, OPS, CUSTOMER |
| GET | `/orders/{id}` | Récupérer une commande par ID | ADMIN, OPS, CUSTOMER |
| GET | `/orders` | Récupérer toutes les commandes (paginées) | ADMIN, OPS |
| GET | `/orders/customer/{customerId}` | Récupérer les commandes par client | ADMIN, OPS, CUSTOMER |
| GET | `/orders/customer/{customerId}/paginated` | Récupérer les commandes par client (paginées) | ADMIN, OPS, CUSTOMER |
| GET | `/orders/drop/{dropId}` | Récupérer les commandes par drop | ADMIN, OPS |
| GET | `/orders/drop/{dropId}/paginated` | Récupérer les commandes par drop (paginées) | ADMIN, OPS |
| PUT | `/orders/{id}` | Mettre à jour une commande | ADMIN, OPS |
| DELETE | `/orders/{id}` | Supprimer une commande | ADMIN |

### Notification Service

| Méthode | Endpoint | Description | Rôles requis |
|---------|----------|-------------|--------------|
| POST | `/notifications` | Créer une nouvelle notification | ADMIN, OPS |
| GET | `/notifications/{id}` | Récupérer une notification par ID | ADMIN, OPS, CUSTOMER |
| GET | `/notifications` | Récupérer toutes les notifications (paginées) | ADMIN, OPS |
| GET | `/notifications/recipient/{recipientId}` | Récupérer les notifications par destinataire | ADMIN, OPS, CUSTOMER |
| GET | `/notifications/recipient/{recipientId}/paginated` | Récupérer les notifications par destinataire (paginées) | ADMIN, OPS, CUSTOMER |
| GET | `/notifications/recipient/{recipientId}/unread-count` | Récupérer le nombre de notifications non lues | ADMIN, OPS, CUSTOMER |
| POST | `/notifications/{id}/read` | Marquer une notification comme lue | ADMIN, OPS, CUSTOMER |

## 🚀 Installation

### Prérequis

- Java 17+
- Maven 3.8+
- Node.js 18+
- Docker & Docker Compose

### Backend

```bash
# Cloner le dépôt
git clone https://github.com/yourusername/RetroRise.git
cd RetroRise

# Lancer l'infrastructure Docker
docker-compose up -d

# Lancer les services (optionnel, si vous voulez les exécuter localement)
cd services/brand-service
mvn spring-boot:run

# Répéter pour chaque service
cd ../drop-service
mvn spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm start
```

## ⚙️ Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet avec les variables suivantes :

```env
# Base de données
DB_HOST=localhost
DB_PORT=5432
DB_NAME=retrorise
DB_USER=retrorise
DB_PASSWORD=retrorise_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# Keycloak
KEYCLOAK_URL=http://localhost:8180
KEYCLOAK_REALM=retrorise
KEYCLOAK_CLIENT_ID=retrorise-client
```

### Ports par défaut

| Service | Port |
|---------|------|
| Frontend | 3000 |
| Gateway Service | 8080 |
| Brand Service | 8081 |
| Drop Service | 8082 |
| Order Service | 8083 |
| Notification Service | 8084 |
| PostgreSQL (Brand) | 5432 |
| PostgreSQL (Drop) | 5433 |
| PostgreSQL (Order) | 5434 |
| PostgreSQL (Keycloak) | 5435 |
| Redis | 6379 |
| Kafka | 9092 |
| Keycloak | 8180 |
| Prometheus | 9090 |
| Grafana | 3001 |

## 📖 Documentation

### Documentation API

La documentation Swagger est disponible pour chaque service microservices :

- Gateway Service: http://localhost:8080/swagger-ui.html
- Brand Service: http://localhost:8081/swagger-ui.html
- Drop Service: http://localhost:8082/swagger-ui.html
- Order Service: http://localhost:8083/swagger-ui.html
- Notification Service: http://localhost:8084/swagger-ui.html

### Documentation technique

Pour plus d'informations techniques, consultez :
- La documentation des services dans les dossiers `services/*/README.md`
- Les dashboards Grafana sur `http://localhost:3001` (admin/admin)
- Architecture détaillée: `docs/architecture.md`
- Guide de développement: `docs/development.md`
- Guide de déploiement: `docs/deployment.md`

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour les détails.

## 👥 Contributeurs

- [Votre Nom](https://github.com/yourusername) - Développeur principal

## 📞 Contact

Pour toute question ou suggestion, n'hésitez pas à :
- Ouvrir une issue sur GitHub
- Nous contacter à contact@retrorise.com

## 🙏 Remerciements

Merci à tous les contributeurs et à la communauté open source pour leurs outils et bibliothèques.
