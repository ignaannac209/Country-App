# CountryApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.2.1.

## Development server

To start a local development server, run:

```bash
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

The local API proxy reads `RESTCOUNTRIES_API_KEY` from `.env`. Create that file from `.env.example` and add your Rest Countries API key. `.env` is ignored by Git and must not be committed.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Deploying to Netlify

The `netlify.toml` file configures the Angular production build and the Netlify Function that proxies Rest Countries requests. In the Netlify site settings, add `RESTCOUNTRIES_API_KEY` as an environment variable for the site’s functions. Do not put the key in frontend code or commit it to Git.

Netlify publishes `dist/country-app/browser` and serves Angular routes through the SPA fallback. The API key is only used by the server-side function.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
