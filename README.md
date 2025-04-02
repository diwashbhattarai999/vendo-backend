# Vendo Backend

Backend for Vendo, a SaaS platform. Built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

<br />

> ### 🚧 Work in Progress

<br />

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication.

## 🛠 Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL, Prisma ORM
- **Authentication**: JSON Web Tokens (JWT)
- **Deployment**: Docker
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

- **Repository**: [GitHub](https://github.com/diwashbhattarai999/vendo-backend)
- **Issues**: [Report a bug](https://github.com/diwashbhattarai999/vendo-backend/issues)
- **Author**: [Diwash Bhattarai](https://diwashb.me)
