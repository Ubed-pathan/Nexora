# 🌐 Nexore - A Full Stack Java Social Media Platform

Welcome to **Nexore**, a dynamic and responsive full-stack social media web application built using Java, Spring Boot, and modern front-end technologies. Nexore offers essential social media features like user authentication, post creation, liking, commenting, and profile management.

## 🚀 Live Demo

🔗 [nexora--one.vercel.app](https://nexora--one.vercel.app)

---

## 🛠️ Tech Stack

### Frontend
- React
- Responsive UI with modern design principles

### Backend
- Java
- Spring Boot
- Spring Security (for authentication and authorization)
- RESTful APIs

### Database
- PostgreSQL

### Tools & Services
- Maven
- Postman (API testing)
- Git & GitHub (Version Control)

---

## ✨ Features

- 🔐 **User Authentication & Authorization**
- 📝 **Create, Delete, and Save Posts**
- ❤️ **Like, Dislike & 💬 Comment on Posts**
- 👤 **User Profile Viewing**
- 👤 **Profile Image Add Feature**
- 🔎 **Responsive Design and Clean UI**
- 📦 **Robust API integration between frontend and backend**

---


## 📂 Project Structure
```
nexore/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/nexore/
│   │   │   │   ├── controller/
│   │   │   │   ├── model/
│   │   │   │   ├── repository/
│   │   │   │   ├── service/
│   │   │   │   └── security/
│   │   │   └── resources/
│   │   │       └── application.properties
│   └── pom.xml
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
```

## ⚙️ Installation & Run Instructions

### ✅ Prerequisites
- Java 17+
- Maven
- Node.js and npm
- PostgreSQL

### 🔧 Backend Setup
1. Clone the Repository
```bash
git clone https://github.com/your-username/nexore.git
cd nexore/nexora_server
```

2. Configure Database
Update `application.properties` with your PostgreSQL DB credentials:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/nexore_db
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
```

3. Run Backend
```bash
mvn clean install
mvn spring-boot:run
```
Backend runs at `http://localhost:8484`

### 🌐 Frontend Setup
1. Navigate to the Frontend Directory
```bash
cd nexora/nexora_client
```

2. Install Dependencies
```bash
npm install
```

3. Start Frontend
```bash
npm start
```
Frontend runs at `http://localhost:5555`


## 📬 Contact
👤 Ubed Pathan  
📧 ubedpathan818@gmail.com 
🔗 [LinkedIn](https://www.linkedin.com/in/ubed-pathan-35a715242/)
🔗 [Portfolio ](https://ubedsportfolio.vercel.app/))

## ⭐ Support
If you found this project helpful, please consider giving it a ⭐ on GitHub!

