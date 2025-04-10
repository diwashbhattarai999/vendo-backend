# Vendo Backend

Backend for Vendo, a SaaS platform. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

<br />

> ### 🚧 Work in Progress

<br />

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication and OAuth0 integration.
- **Role-Based Access Control**: Fine-grained permissions for different user roles.
- **RESTful API**: Well-structured API endpoints for easy integration.
- **File Uploads**: Support for file uploads with Multer.
- **Email Notifications**: Send emails using Resend for user notifications.
- **Database Management**: Prisma ORM for seamless database interactions.
- **Scalable Architecture**: Built with TypeScript for maintainability and scalability.
- **Containerized Deployment**: Docker support for easy deployment.
- **DevOps Ready**: Docker setup for local development and production.
- **Monitoring**: Prometheus-compatible metrics via prom-client.

## 🛠 Tech Stack

- **Language**: Node.js, TypeScript
- **Framework**: Express
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT, Passport, OAuth (Google, Facebook)
- **File Uploads**: Multer, Cloudinary
- **Monitoring**: Winston (logging), prom-client (metrics)
- **Email Service**: Resend
- **DevOps**: Docker, Husky, Commitizen, Standard Version
- **Package Manager**: pnpm

## 📦 Installation & Setup

### Prerequisites

- **Node.js** `>=18.0.0`
- **pnpm** `>=9.0.0`
- **PostgreSQL** `>=14.0`
- **Docker** (optional, for containerized setup)

### Steps

1. **Clone the repository:**

   ```sh
   git clone https://github.com/diwashbhattarai999/vendo-backend.git
   cd vendo-backend
   ```

2. **Install dependencies using pnpm:**

   ```sh
   pnpm install
   ```

3. **Set up environment variables:**
   Copy `.env.example` to `.env` and configure the values.

   ```sh
   cp .env.example .env
   ```

4. **Run database migrations:**

   ```sh
   pnpm db:migrate
   ```

5. **Start the development server:**

   ```sh
   pnpm dev
   ```

6. **Build for production:**

   ```sh
   pnpm build
   ```

7. **Start production server:**
   ```sh
   pnpm start
   ```

## 🐳 Docker Setup

Run the backend using Docker:

```sh
pnpm docker:compose:dev
```

Stop the containers:

```sh
pnpm docker:compose:stop
```

## 📄 API Documentation

The API documentation is available on Postman. You can view it here:

[Postman API Documentation](https://documenter.getpostman.com/view/43388572/2sB2cRDjX4)

## 💻 Scripts

| Command                    | Description                                      |
| -------------------------- | ------------------------------------------------ |
| `pnpm dev`                 | Start the development server                     |
| `pnpm clean`               | Clean the build directory and logs               |
| `pnpm build`               | Build the project for production                 |
| `pnpm start`               | Start the production server                      |
| `pnpm type-check`          | Run TypeScript type checks                       |
| `pnpm lint`                | Run ESLint checks                                |
| `pnpm lint:fix`            | Fix ESLint issues                                |
| `pnpm format`              | Format code using Prettier                       |
| `pnpm format:check`        | Check code formatting using Prettier             |
| `pnpm prepare`             | Prepare the project for release                  |
| `pnpm commit`              | Commit changes with Commitizen                   |
| `pnpm:release`             | Release a new version using Standard Version     |
| `pnpm db:studio`           | Open Prisma Studio for database management       |
| `pnpm db:pull`             | Pull the latest database schema using Prisma     |
| `pnpm db:push`             | Push the Prisma schema to the database           |
| `pnpm db:reset`            | Reset the database                               |
| `pnpm db:migrate`          | Run database migrations                          |
| `pnpm db:generate`         | Generate Prisma client                           |
| `pnpm docker:compose:dev`  | Run the backend using Docker in development mode |
| `pnpm docker:compose:prod` | Run the backend using Docker in production mode  |
| `pnpm docker:compose:stop` | Stop the Docker containers                       |
| `pnpm logs:dev`            | View logs for the development server             |
| `pnpm logs:prod`           | View logs for the production server              |

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please follow the standard Git flow:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your fork
5. Create a pull request

For more details, refer to `CONTRIBUTING.md`.

## 🔗 Links

- **🌐 Live Project** (Coming Soon)
- **🗂 Repository**: [GitHub](https://github.com/diwashbhattarai999/vendo-backend)
- **🐛 Issues**: [Report a bug](https://github.com/diwashbhattarai999/vendo-backend/issues)
- **👤 Author**: [Diwash Bhattarai](https://diwashb.me)
