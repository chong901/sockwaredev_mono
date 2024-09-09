This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### For the first time and prepare the data

Run the docker compose:

```bash
docker compose up -d
```

Wait for ORS to be ready, check `http://localhost:8080/ors/v2/health` and make sure the status is `ready` (might take a few mins), there should be some files under openrouteservice/graphs folder. (reference)[https://giscience.github.io/openrouteservice/run-instance/running-with-docker]

Copy .env.local.sample to .env.local

```bash
cp .env.local.sample .env.local
```

Get the LTA api key from [LTA website](https://datamall.lta.gov.sg/content/datamall/en/request-for-api.html) and put it into .env.local 

DB migration:

```bash
DATABASE_URL=postgres://postgres:1234@localhost:5433/postgres yarn db:migrate
```

Prepare data

```bash
yarn prepare-data
```

### Enjoy the development

Start Nextjs

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
