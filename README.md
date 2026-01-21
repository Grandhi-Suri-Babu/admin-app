# Janam Content App

A React SPA for managing content metadata with multi-record support for News, Audio, Events, and Chat sections. This is to Upload the Data to Backend

## Project Structure

```
src/
├── components/
│   ├── Form/          # Form components (FormPage, RecordCard, RecordModal)
│   ├── Navbar/        # Navigation bar
│   └── Upload/        # Upload page (placeholder)
├── config/            # API configuration
├── data/              # Form field definitions & reference data
├── services/          # API service layer
├── tests/             # Unit tests
└── utils/             # Validators & payload transformer
```

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Features

- Multi-record form sections (News, Audio, Events, Chat)
- Form validation with error handling
- API integration with configurable endpoints
- 106 unit tests
