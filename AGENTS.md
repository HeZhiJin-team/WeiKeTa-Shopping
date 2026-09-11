# Repository Guidelines

## Project Structure & Module Organization

This is a Vue 2 uni-app storefront, developed primarily in HBuilderX. Application entry points are `main.js` and `App.vue`. Feature pages live in `pages/`; register every new route and subpackage in `pages.json`. Put reusable UI in `components/`, feature API functions in `api/`, shared logic in `libs/`, `mixins/`, or `utils/`, and Vuex state in `store/modules/`. Keep images, fonts, and other source assets in `static/`. Treat `unpackage/dist/` as generated output; do not edit it directly.

## Build, Test, and Development Commands

- `npm install` installs the minimal Node dependencies recorded in `package-lock.json`.
- Use HBuilderX 3.0+ for development: **Run → Run to Browser**, **Run to Mini Program Simulator**, or **Run to Phone or Simulator**.
- Use HBuilderX **Publish** to produce H5, WeChat Mini Program, or native App builds. The repository defines no `npm` build, lint, or test scripts.

## Coding Style & Naming Conventions

Follow the established Vue options-API style and preserve local indentation (most project files use tabs). Use PascalCase component names (for example, `BaseMoney.vue`), camelCase for methods and variables (`loadGoods`), and UPPER_SNAKE_CASE for constants. Name page and feature directories after their existing route paths. Use `rpx` and flex layouts for responsive UI. Keep platform-only code inside uni-app conditional-compilation comments such as `// #ifdef H5` and `// #endif`.

## Testing Guidelines

No automated test framework or coverage threshold is configured. Before opening a PR, exercise affected flows in HBuilderX on the relevant targets—at least H5 and, when applicable, WeChat Mini Program or App. Verify route registration, API error states, and platform-specific branches. Add a focused test only when introducing a test runner as part of the change.

## Commit & Pull Request Guidelines

Use Conventional Commit headers with one of: `feat`, `fix`, `perf`, `refactor`, `docs`, `types`, `test`, `ci`, `revert`, or `chore`. Write an imperative, scoped summary, e.g. `fix(cart): prevent duplicate checkout requests`. Keep commits focused. PRs should describe user-visible behavior, list tested targets, link related issues, and include screenshots or recordings for UI changes. Call out changes to `config/app.js`, `manifest.json`, or `pages.json` explicitly; never commit credentials or production secrets.
