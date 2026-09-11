# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CRMEB UniApp is a multi-platform mobile e-commerce application built with the uni-app framework. It supports deployment to WeChat Mini Program, H5 web, and native Android/iOS apps from a single codebase.

**Technology Stack:**
- Framework: uni-app 3.0+
- Frontend: Vue.js 2.x
- UI Library: uView UI 2.0+
- State Management: Vuex
- HTTP Client: Custom wrapper around uni.request

## Development Workflow

This project primarily uses **HBuilderX** for development and building, not CLI tools.

### Running the Application

Use HBuilderX IDE:
1. Open project in HBuilderX 3.0+
2. **Run to WeChat Mini Program**: Run → Run to Mini Program Simulator → WeChat Developer Tools
3. **Run to H5**: Run → Run to Browser → Choose browser
4. **Run to App**: Run → Run to Phone or Simulator → Choose device

### Building for Production

Use HBuilderX "发行" (Publish) feature:
- **WeChat Mini Program**: 发行 → 小程序-微信
- **H5**: 发行 → H5
- **Native App**: 发行 → 原生 App-云打包

### Installing Dependencies

```bash
npm install
```

Note: The package.json is minimal as HBuilderX manages most dependencies.

## Configuration

### Environment Configuration

Edit `config/app.js` to configure the API base URL for different platforms:

```javascript
// For Mini Program / App
// #ifdef MP || APP-PLUS
HTTP_REQUEST_URL: `https://your-domain.com`,
// #endif

// For H5
// #ifdef H5
HTTP_REQUEST_URL: 'https://your-domain.com',
// #endif
```

### Key Configuration Files

- `config/app.js` - API URLs, headers, token name, cache settings
- `manifest.json` - App metadata, platform-specific configs, permissions
- `pages.json` - Page routing, navigation bar styles, tab bar config, sub-packages
- `vue.config.js` - Production build settings (disables source maps, removes console logs)

## Architecture

### Entry Points

- `main.js` - Application bootstrap, global component registration, prototype extensions
- `App.vue` - Root component with global state (userInfo, menus, tabbar, theme)

### Global Prototype Properties

The following are available on all Vue instances via `this`:
- `$util` - Utility functions (utils/util.js)
- `$config` - App configuration (config/app.js)
- `$Cache` - Cache management (utils/cache.js)
- `$eventHub` - Global event bus (Vue instance)
- `$socket` - WebSocket client (libs/new_chat.js)
- `$permission` - Permission checks (libs/permission.js)
- `$Debounce` - Debounce function (utils/validate.js)
- `$wechat` - WeChat SDK wrapper (H5 only, libs/wechat.js)

### Directory Structure

```
api/              # API interface definitions organized by module
components/       # Reusable Vue components (global and local)
config/           # Application configuration
libs/             # Business logic libraries (login, payment, chat, etc.)
mixins/           # Vue mixins for shared behavior
pages/            # Page components (organized by feature)
static/           # Static assets
store/            # Vuex store modules
utils/            # Utility functions (request, validation, cache, etc.)
```

### API Layer

All API calls should go through modules in the `api/` directory. The HTTP client (`utils/request.js`) handles:
- Request/response interceptors
- Token injection (uses `Authori-zation` header)
- Error handling and toast messages
- Platform-specific headers (Form-type: wechat/h5/routine/app)

### State Management

Vuex store is modular with separate modules for different features. Access store via `this.$store` or use mapState/mapGetters/mapActions/mapMutations.

### Platform-Specific Code

Use uni-app conditional compilation:
```javascript
// #ifdef H5
// H5-only code
// #endif

// #ifdef MP
// Mini program-only code
// #endif

// #ifdef APP-PLUS
// Native app-only code
// #endif
```

The `Form-type` header is automatically set based on platform for API requests.

### Code Splitting

Pages are organized as sub-packages (see `pages.json`). The `extension` sub-package contains auxiliary features to optimize main bundle size.

## Development Patterns

### Component Guidelines

- Global components are registered in `main.js` (skeleton, pageLoading, easyLoadimage, BaseMoney, BaseTag)
- Use PascalCase for component filenames (e.g., `GoodsList.vue`)
- Shared business logic should go in `mixins/` (SKU selection, debounce, share poster, etc.)

### API Usage Pattern

```javascript
import { getGoodsList } from '@/api/goods'

// In component methods
async loadGoods() {
  try {
    const res = await getGoodsList({ page: 1, limit: 10 })
    // Handle response
  } catch (e) {
    // Error is handled by request interceptor with toast
  }
}
```

### Payment Integration

The `components/payment/` component handles multiple payment methods:
- WeChat Pay (微信支付)
- Alipay (支付宝)
- Balance Payment (余额支付)
- Yuanbao Payment (元宝支付)

### Authentication Flow

Login logic is platform-specific and handled in `libs/login.js`:
- WeChat Mini Program: Uses `uni.login()` and backend code2session
- H5: WeChat OAuth flow (libs/wechat.js)
- App: Platform-specific OAuth

## Important Notes

### Token Management

- Token header name: `Authori-zation` (note the hyphen spelling)
- Token is stored in Cache and automatically injected by request interceptor
- Token name is configured in `config/app.js` as `TOKENNAME`

### Cache Strategy

Cache utilities are in `utils/cache.js`. Cache expiration is configurable via `EXPIRE` in `config/app.js` (0 = permanent).

### Production Build

The production build automatically:
- Disables source maps
- Removes console.log statements
- Removes debugger statements

This is configured in `vue.config.js` using Terser.

### Styling

- Use `rpx` units for responsive sizing (uni-app standard)
- Use Flex layout for responsive design
- Platform-specific styles may be needed for H5 vs native differences

## Common Issues

- **White screen after build**: Check page paths in `pages.json`, verify API URLs
- **WeChat login fails**: Verify AppID in `manifest.json`, check login flow in `libs/login.js`
- **API calls failing**: Check `HTTP_REQUEST_URL` in `config/app.js`, verify backend is running
- **Mini program size exceeded**: Utilize sub-packages, optimize images, remove unused code

## Related Documentation

- CRMEB Official Docs: https://doc.crmeb.com
- uni-app Docs: https://uniapp.dcloud.net.cn
- uView UI Docs: https://www.uviewui.com
