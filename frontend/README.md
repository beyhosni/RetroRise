# RetroRise Frontend

Frontend application for the RetroRise sneaker drop platform.

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on http://localhost:8080

## Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Configure environment variables:
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at http://localhost:3000

## Build for Production

```bash
npm run build
# or
yarn build
```

The optimized production build will be in the `build` folder.

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── common/      # Shared components (Button, Input, Modal, etc.)
│   └── layout/      # Layout components (Header, Footer, etc.)
├── hooks/           # Custom React hooks
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   ├── auth/        # Authentication pages
│   └── customer/    # Customer pages
├── services/        # API services
├── store/           # Redux store configuration
│   └── slices/      # Redux slices
├── styles/          # Global styles and theme
├── App.js           # Main application component
└── index.js         # Application entry point
```

## Key Features

- Authentication with Keycloak
- Product browsing and search
- Shopping cart functionality
- Checkout with Stripe integration
- Order tracking
- Admin dashboard for managing drops, brands, and orders
- Responsive design
- State management with Redux Toolkit

## Environment Variables

- `REACT_APP_API_URL`: Backend API URL
- `REACT_APP_KEYCLOAK_URL`: Keycloak server URL
- `REACT_APP_KEYCLOAK_REALM`: Keycloak realm
- `REACT_APP_KEYCLOAK_CLIENT_ID`: Keycloak client ID
- `REACT_APP_STRIPE_PUBLIC_KEY`: Stripe public key for payments

## Technologies Used

- React 18
- React Router 6
- Redux Toolkit
- Styled Components
- Axios
- Keycloak JS
- Stripe
- React Query
- Framer Motion
- Lucide React (icons)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
