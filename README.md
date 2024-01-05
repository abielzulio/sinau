<a href="https://sinau.app">
  <img alt="Sinau — Generative learning path platform" src="https://www.sinau.app/og.png">
  <h1 align="center">Sinau</h1>
</a>

<p align="center">
  Generative learning path platform for everyone
</p>

<p align="center">
  <a href="https://twitter.com/abielzulio">
    <img src="https://img.shields.io/twitter/follow/abielzulio?style=flat&label=abielzulio&logo=twitter&color=0bf&logoColor=fff" alt="Abiel Zulio M Twitter follower count" />
  </a>
  <a href="https://github.com/abielzulio/sinau">
    <img src="https://img.shields.io/github/stars/abielzulio/sinau?label=abielzulio%2Fsinau" alt="Sinau repo star count" />
  </a>
</p>

<p align="center">
  <a href="#introduction"><strong>Introduction</strong></a> ·
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
  <a href="#development"><strong>Development</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="#author"><strong>Author</strong></a> ·
  <a href="#license"><strong>License</strong></a>
</p>
<br/>

## Introduction

Sinau is an open-source generative learning path platform to help anyone learn any subject from zero knowledge. It's a platform to guide and help you to learn anything that was unthinkable before.

## Features

- Module-based learning path
- Youtube video, reading material, and quiz per module
- Reading references list
- AI-assisted chatbot

## Tech Stack

- [Vercel](https://vercel.com/?utm_source=sinau&utm_campaign=oss)
- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [Auth.js](https://authjs.dev/)
- [Neon](https://neon.tech)
- [Prisma.io](https://prisma.io/)
- [OpenAI](https://openai.com/)
- [Trigger.dev](https://trigger.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

## Development

To get a local copy up and running, please follow these simple steps.

### Prerequisites

Here is what you need to be able to run Sinau locally.

- Node.js
- PostgreSQL
- Docker
- [Trigger.dev](https://trigger.dev/) account
- [OpenAI](https://openai.com/) account
- [Google Cloud](https://cloud.google.com/) account (for Google authentication provider)

### Setup

1. Clone the repo

   ```sh
   git clone https://github.com/abielzulio/sinau.git
   ```

2. Go to the project folder

   ```sh
   cd sinau
   ```

3. Install packages

   ```sh
   npm i
   ```

4. Set up the local PostgreSQL through Docker

   ```sh
   docker-compose up -d
   ```

5. Set up the local PostgreSQL through Docker

   ```sh
   docker-compose up -d
   ```

6. Set up your `.env` file

   - Duplicate `.env.example` to `.env`
   - Use `openssl rand -base64 32` to generate a key and add it under `NEXTAUTH_SECRET` in the `.env` file.
   - Go to [trigger.dev](https://trigger.dev/) and paste your `TRIGGER_API_KEY`, `TRIGGER_API_URL`,`TRIGGER_ID`, and `NEXT_PUBLIC_TRIGGER_PUBLIC_API_KEY` to the `.env` file.
   - Go to [Open AI](https://openai.com/) and paste your `OPENAI_API_KEY` to the `.env` file.
   - Go to [Google Cloud](https://cloud.google.com/) and paste your `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to the `.env` file.

7. Run the database migration

   ```sh
   npm run db:migrate
   ```

8. Run the app locally

   ```sh
   npm run dev
   ```

9. Run the trigger.dev locally (in a separate terminal)

   ```sh
   npx @trigger.dev/cli@latest dev
   ```

## Contributing

Here's how you can contribute:

- [Open an issue](https://github.com/abielzulio/sinau/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/abielzulio/sinau/pull) to add new features/make quality-of-life improvements/fix bugs.

<!-- ## Contributors

<a href="https://github.com/abielzulio/sinau/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=abielzulio/sinau" />
</a>
 -->

## Author

- Abiel Zulio M ([@abielzulio](https://twitter.com/abielzulio))

## License

Distributed under the [AGPLv3 License](https://github.com/abielzulio/sinau/blob/main/LICENSE). See `LICENSE` for more information.

## Acknowledgements

Special thanks to these amazing projects which help power Sinau:

- [Vercel](https://vercel.com/?utm_source=sinau&utm_campaign=oss)
- [Next.js](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [Auth.js](https://authjs.dev/)
- [Neon](https://neon.tech)
- [Prisma.io](https://prisma.io/)
- [OpenAI](https://openai.com/)
- [Trigger.dev](https://trigger.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
