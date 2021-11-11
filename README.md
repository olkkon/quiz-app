
# Quiz application

In this application one can create and answer questions created by other users. Starting to use the application requires you to register, but if you have done that earlier, just log in! Application provides some statistical data on users and answers given by them, as well as api-endpoint at /api/questions.

## How to start using application

### Setting up a database

You need to set up a database for application to work correctly. ElephantSQL was used during the development, but in practice any PostgreSQL based database will work. Instructions for setting up the database are omitted. Remember to provide database credentials for your own base at /database/database.js. 

Database schema:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password CHAR(60)
);

CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  title VARCHAR(256) NOT NULL,
  question_text TEXT NOT NULL
);

CREATE TABLE question_answer_options (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  option_text TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false
);

CREATE TABLE question_answers (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  question_id INTEGER REFERENCES questions(id),
  question_answer_option_id INTEGER REFERENCES question_answer_options(id),
  correct BOOLEAN DEFAULT false
);

CREATE UNIQUE INDEX ON users((lower(email)));
```

### Local running
The application can be run locally in the terminal using following command:
`deno run --allow-all --unstable run-locally.js`
Make sure that you are in the root folder of the project when running the command in the terminal.

### Creating some data
For full experience and easier testing of the application, it is recommended to follow the steps below.

1. Create at least three different accounts to the system. Save the credentials to e.g text file.
2. Now, create at least five questions using the first account. All these questions should preferably have five or so answer options.
3. Using first account, answer those questions and make intentionally some mistakes.
4. Now answer those questions using accounts two and three.

After making the data, go to statistics - page using the first account and you will see some statistics.

## Additional features

Additional features are listed here page or feature basis.
#### Authorization
- Possibility to log out of the system. Separate log out - page for that.
- When registering a new user and user is logged in, current user will be logged out.

#### Question page
- Prevent user adding multiple answer options which are correct
- Show warning when the question does not yet have any correct answer option

#### API
- Show separate info page for API usage at /api/questions.
- Return error messages when the question answering id's are incorrect or does not have match on database.

#### Quiz
- Possibility to skip a question
- Prevent user manually choosing random question by checking that question id coming from parameter is in the list of proper questions (which could have been selected automatically).



## Testing

All tests are located at /tests/ - folder. All tests can be run easily at once by running following command at the root folder of the project.
`deno test --allow-all --unstable`

Some notes before starting the tests:

#### Test 2
Test requires correct answer option at database. Before the test are two variables called `questionId` and `optionId`, these should be filled before running the test.

#### Test 3
Make sure that `questionId = 100` and `optionId = 100` are not in use in your database. If that is the case, just change those values to some that are not in use. Idea of the test is to use values which are not found in the base.

#### Test 4
Test requires working login credentials to the application. At the start of the test file are two variables called `email` and `password`, these should be filled before running the test.

#### Test 7
Test requires working login credentials to the application. At the start of the test file are two variables called `email` and `password`, these should be filled before running the test.

#### Test 8
Test requires working login credentials to the application. At the start of the test file are two variables called `email` and `password`, these should be filled before running the test.

#### Test 9
Test requires existing user at the database. At the start of the test file is variable called `userId`, this should be filled before running the test.

#### Test 10
Test requires existing user at the database. At the start of the test file is variable called `userId`, this should be filled before running the test.

