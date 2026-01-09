

# Products Microservice

Small NestJS TCP microservice for managing products.

Links
- Service entry: [src/main.ts](src/main.ts)
- App module: [`AppModule`](src/app.module.ts)
- Products feature: [`ProductsModule`](src/products/products.module.ts), [`ProductsController`](src/products/products.controller.ts), [`ProductsService`](src/products/products.service.ts)
- DB service: [`PrismaService`](src/prisma.service.ts)
- Prisma schema: [prisma/schema.prisma](prisma/schema.prisma)
- Env validation: [`envs`](src/config/envs.ts)
- Scripts: [package.json](package.json)
- Example e2e test: [test/app.e2e-spec.ts](test/app.e2e-spec.ts)
- Env template: [.env.template](.env.template)

Requirements
- Node.js (see package engines; Node >= 18 recommended)
- pnpm
- SQLite (or set DATABASE_URL to your DB)
- npx (for Prisma CLI)

Quick start

1. Install deps
```
pnpm install
```

2. Configure env

cp [.env.template](http://_vscodecontentref_/0) .env

Edit .env -> set PORT and DATABASE_URL (e.g. DATABASE_URL="file:./dev.db")

3. Prisma (generate client & run migrations)

```
npx prisma generate
npx prisma migrate dev --name init
# For production:
npx prisma migrate deploy
```

4. Run locally

```
pnpm run start:dev
```