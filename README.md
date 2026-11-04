# Marketplace Star Rating App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Playwright](https://img.shields.io/badge/Playwright-1.25.0-green.svg)](https://playwright.dev/)

A modern, accessible star rating custom field extension for Contentstack marketplace apps. This React-based application provides an intuitive rating interface that integrates seamlessly with Contentstack's content management system.

## ⭐ Features

- **Interactive Star Rating**: Intuitive click and hover interactions for rating selection
- **Half-Star Ratings**: Optional half-star precision for more granular ratings
- **TypeScript**: Fully typed for better development experience
- **Testing**: Comprehensive test suite with Playwright for E2E testing
- **Modern UI**: Clean, professional interface using Contentstack's Venus components
- **Display Modes**: Show ratings as stars, numbers, or both

## 📋 Prerequisites

- Node.js (v20 or higher)
- npm
- Contentstack account

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/contentstack/marketplace-starrating-app.git
cd marketplace-starrating-app

# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev

# Run E2E tests
npm run test:chrome
```

### Building for Production

```bash
# Build the application
npm run build

#Serve the application
npm run serve

```

## 🏗️ Project Structure

```
marketplace-starrating-app/
├── src/
│   ├── components/          # Reusable React components
│   ├── containers/          # Main app containers
│   │   ├── App/             # Main app component
│   │   ├── CustomField/     # Star rating custom field
│   │   └── 404/             # 404 error page
│   ├── common/
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom React hooks
│   │   ├── locales/         # Internationalization
│   │   ├── providers/       # Context providers
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   └── assets/              # Static assets
├── e2e/                     # End-to-end tests
├── public/                  # Public assets
└── config files...
```

## 🧪 Testing

This project includes comprehensive testing:

### E2E Tests

```bash
npm run test:chrome        # Run E2E tests in Chrome
npm run test:firefox       # Run E2E tests in Firefox
npm run test:safari        # Run E2E tests in Safari
```

### Code Quality

```bash
npm run lint               # Run ESLint
npm run lint:fix          # Fix linting issues
npm run typecheck         # TypeScript type checking
npm run format            # Format code with Prettier
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_STACK_API_KEY=your_stack_api_key
REACT_APP_ENVIRONMENT=your_environment
```

### App Configuration

The app configuration is defined in `update-app-info.json`:

```json
{
  "name": "Star Rating",
  "target_type": "stack",
  "ui_location": {
    "locations": [
      {
        "type": "cs.cm.stack.custom_field",
        "meta": [
          {
            "signed": true,
            "path": "/#/custom-field",
            "data_type": "json"
          }
        ]
      }
    ]
  }
}
```

## 🛠️ Development

### Adding New Features

1. Create feature branch from `main`
2. Implement your changes
3. Add tests for new functionality
4. Update documentation
5. Submit pull request

### Code Style

This project uses:

- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for git hooks
- **lint-staged** for pre-commit checks

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

## 🤝 Contributing

We welcome contributions! Please see the following guide for details.

### How to Contribute

1.  Fork the repository.
2.  Create a feature branch (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'feat: add amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Contentstack](https://www.contentstack.com/) for the amazing CMS platform.

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/contentstack/marketplace-starrating-app/issues)
- **Documentation**: [Contentstack Developer Hub](https://www.contentstack.com/docs/developers/developer-hub)
- **Marketplace**: [Contentstack Marketplace App Guide](https://www.contentstack.com/docs/developers/marketplace-apps/star-ratings)
- **Community**: [Contentstack Community](https://community.contentstack.com/)

---

Made with ⭐ by the Contentstack team
