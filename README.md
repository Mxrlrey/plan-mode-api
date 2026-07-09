# Plan Mode API

Base do projeto com NestJS, Prisma, PostgreSQL, JWT e Swagger.

## Rodar localmente

1. Suba o banco:

```bash
docker compose up -d
```

2. Gere o client do Prisma:

```bash
npm run prisma:generate
```

3. Rode a API:

```bash
npm run start:dev
```

4. Acesse a documentação Swagger:

```text
http://localhost:3000/docs
```

## Scripts

- `npm run build`
- `npm run start`
- `npm run start:dev`
- `npm run prisma:migrate`
- `npm run prisma:studio`
