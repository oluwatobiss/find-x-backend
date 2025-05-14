# Find X Rest API

This photo tagging game ([Where's Wally?](https://en.wikipedia.org/wiki/Where%27s_Wally%3F)) presents users with a busy and crowded illustration containing many different people, objects, or places. The user's task is to find specified characters hidden in the illustration.

## Features

- **Authentication:** Create an account, log in, and log out of websites.
- **Authorization:** Only logged-in users have access to protected routes.
- **CRUD:** Most routes have complete Create, Read, Update, and Delete support.
- **Secured forms:** Forms' data are thoroughly sanitized and validated.
- **Tested Routes:** All routes have thorough testing that ensures the request-response cycle works appropriately.

## Users and privileges

- **Guest:** Unauthenticated user (Low-level privileges)
- **Gamer:** Authenticated user (Mid-level privileges)
- **Admin:** An administrator (All privileges)

| Privilege                | Guest | Gamer | Admin |
| ------------------------ | ----- | ----- | ----- |
| Create an account        | Yes   | Yes   | Yes   |
| Play game                | Yes   | Yes   | Yes   |
| Add image                | No    | No    | Yes   |
| Update images            | No    | No    | Yes   |
| Access all images        | No    | Yes   | Yes   |
| Access leaderboard       | No    | Yes   | Yes   |
| Access dashboard         | No    | No    | Yes   |
| Add name to leaderboard  | No    | Yes   | Yes   |
| Add score to leaderboard | Yes   | Yes   | Yes   |
| Manage users             | No    | No    | Yes   |
| Delete accounts          | No    | No    | Yes   |

## API Routes

### User

- `GET /users` Fetch all users' data.
- `POST /users` Create a new user account.
- `PUT /users/:id` Update a single user's data.
- `DELETE /users/:id` Delete a single user's data.

### Image

- `GET /images` Fetch all images.
- `GET /images/:id` Fetch a single image.
- `POST /images` Create a new image.
- `PUT /images/:id` Update a single image.
- `DELETE /images/:id` Delete a single image.

### Leader

- `GET /leaders` Fetch all leaderboard data.
- `POST /leaders` Create a new leader record if game time makes the top 10 leaderboard.

### Authentication

- `POST /auths` Create a new authentication token.

## Technologies used

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- Passport.js (local strategy)
- JSON Web Token
- Express Validator
- Jest
- SuperTest

## Usage

1. Clone the project

```bash
git clone https://github.com/oluwatobiss/find-x-backend.git
```

2. Navigate into the project repo

```bash
cd find-x-backend
```

3. Install dependencies

```bash
npm install
```

4. Create an environment variable file

```bash
touch .env
```

5. Define the project's environment variables

```
ADMIN_CODE="example-pass"
ANONY_PASSWORD="example-pass"
ANONY_EMAIL="example@mail.com"
DATABASE_URL="postgresql://username:user_password@localhost:5432/find_x"
FindX_URI="http://localhost:PORT"
JWT_SECRET="example_jwt_secret"
PORT=3000
```

6. Migrate the project's schema to your database

```bash
npm run db:dev
```

7. Start the server

```bash
npm run dev
```

## Related Repos

- [Find X Website](https://github.com/oluwatobiss/find-x-frontend)
