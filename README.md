# Richmond Centre for Disability

[Richmond Centre for Disability's (RCD)](https://www.rcdrichmond.org/) platform for people with
disabilities to apply for accessible parking permits (APP) in Richmond, BC. The app consists of an
applicant-facing application portal and an internal user/APP management portal.

## General Architecture

1. [NodeJS](https://nodejs.org/en/) application powered by the [NextJS](https://nextjs.org/)
   framework.
2. [Apollo](https://www.apollographql.com/) for [GraphQL](https://graphql.org/) server and client.
3. [Chakra UI](https://chakra-ui.com/) for building accessible and responsive frontend components.
4. [Prisma](https://www.prisma.io/) ORM for [PostgreSQL](https://www.postgresql.org/).
5. [i18next](https://www.i18next.com/) for internationalization and app translations.
6. Service: [Amazon SES](https://aws.amazon.com/ses/) for outbound email service.
7. Service: [Railway](https://railway.app/) for application and database deploys.

## Project structure

```bash
.
├── assets # Assets
├── components # Project components
│   └── Layout.tsx
├── containers # State containers
├── lib # Library
│   ├── graphql # Global GraphQL setup
│   └── scripts # Scripts
├── pages # Pages
│   ├── _app.tsx
│   ├── api # API routes
│   └── index.tsx
├── prisma # Prisma ORM
│   └── schema.prisma # Prisma Schema
├── public
│   └── locales # Translations
├── tools # Frontend tools
│   ├── pages # Tools for pages
│   └── components # Tools for components
# Misc individual files
├── .env.sample # Sample .env file
├── README.md
├── apollo.config.js
├── codegen.yml
├── next-env.d.ts
├── next-i18next.config.js
├── next.config.js
├── package.json
├── tsconfig.json
└── yarn.lock
```

## Run locally

Duplicate `.env.sample` to `.env` and configure environment variables.

To deploy your database schema, run the following:

```bash
# Deploy schema.sql to Heroku Postgres
heroku pg:psql -a YOUR_APP_NAME -f prisma/schema.sql

# Regenerate Prisma schema and client
npx prisma introspect && npx prisma generate
```

To run the application:

```bash
# Install dependencies
yarn

# Run locally
yarn dev
```

## Development

After making changes to GraphQL schema, automatically generate the TypeScript types:

```bash
yarn generate-graphql-types
```

[Railway](https://railway.app/) provides deploys for every PR!

## Deploy

Deployment occurs automatically on push to the Main and Staging branches.
[Railway](https://railway.app/) handles the continuous deployment of these branches.

<!-- 1. Master Deploy: [ossdancefest.com](https://www.ossdancefest.com)
2. Staging Deploy: [dancefest.dev](https://dancefest.dev) -->

## License

[MIT](https://github.com/uwblueprint/richmond-centre-for-disability/blob/main/LICENSE)
