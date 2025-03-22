# **Vendo Backend**

## **Getting Started**

To get started with the **Vendo** backend project, follow the steps below:

### **Prerequisites**

Before starting with the installation, ensure that you have the following installed:

- Node.js (for running the backend server)
- Git (for version control)
- TypeScript (for transpiling TypeScript code)
- PostgreSQL (for the database)
- Prisma (for interacting with the PostgreSQL database)

Ensure you have Node.js installed. You can download it from [Node.js official website](https://nodejs.org/).

@note Node.js is required to run the backend server and install dependencies.

Install Git from [Git official website](https://git-scm.com/).

@note Git is needed for version control and collaborating with other developers.

Install TypeScript globally using the following command:

```bash
npm install -g typescript
```

@note TypeScript is used to write the backend in a type-safe way. Installing it globally ensures you can compile TypeScript code.

Ensure you have PostgreSQL installed. You can download it from [PostgreSQL official website](https://www.postgresql.org/).

@note PostgreSQL is used as the relational database for this backend project.

Install Prisma globally using the following command:

```bash
npm install -g prisma
```

@note Prisma is an ORM (Object Relational Mapper) that helps interact with the PostgreSQL database in a type-safe way.

### **Steps**

These are the steps to set up the backend project:

1. **Clone the repository**

   ```bash
   git clone git@github.com:your-username/vendo-backend.git
   ```

2. **Navigate to the project directory**

   ```bash
   cd vendo-backend
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Create `.env` file**

   Create a `.env` file in the root of the project and add your environment variables (e.g., database credentials, API keys).

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open the project in your browser**

   Open your browser and go to `http://localhost:8080` to see the project running.

### **Build & Production**

- For creating build files, run `npm run build`.
- For running build files in production, run `npm start`.

## **Documentation**

You can find the Postman Collection for API documentation here:

[Postman Collection](https://documenter.getpostman.com/view/27265804/2sAYkBsM99)

## **Features**

- Custom error class
- Custom error handler
- Logging
- Localization
- Rate limiting
- Slow down
- Multer (for handling file uploads)
- API key implementation
- Sending Emails (using SendGrid)
- Metrics (Analytics)

## **Features to be Added**

- Testing
- Containerization
- Authentication (Passport.js)
- Authorization

## **Contributing**

Contributors are welcome! If you'd like to enhance the project or add new features, follow these steps:

1. Fork the repository.
2. Clone your forked repository:

   ```bash
   git clone git@github.com:your-username/vendo-backend.git
   ```

3. Create a new branch:

   ```bash
   git checkout -b feature/new-feature
   ```

4. Make your changes and commit them:

   ```bash
   git commit -m "Add new feature"
   ```

5. Push your changes:

   ```bash
   git push origin feature/new-feature
   ```

6. Open a Pull Request on GitHub.

If you encounter a bug or want to see something added/changed, please go ahead and [Open an issue](https://github.com/your-username/vendo-backend/issues/new/choose).

If you need help with something, feel free to [Start a discussion](https://github.com/your-username/vendo-backend/discussions/new/choose).

## **Contact**

For any questions or suggestions, feel free to reach out:

- **Email:** [youremail@example.com](mailto:youremail@example.com)
- **Website:** [Your Website](https://yourwebsite.com)
- **LinkedIn:** [Your LinkedIn](https://www.linkedin.com/in/your-profile)

## **License**

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
