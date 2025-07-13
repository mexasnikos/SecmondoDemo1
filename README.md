# TravelSafe - Travel Insurance Website

A modern, responsive travel insurance website built with React TypeScript, similar to heymondo.com.

## Features

- 🏠 **Homepage**: Hero section, features, testimonials, and call-to-action
- 💰 **Quote Form**: Interactive form with dynamic pricing calculation
- 📋 **About Page**: Company information and coverage details
- 📞 **Contact Page**: Multiple contact methods and contact form
- 📱 **Responsive Design**: Mobile-first design that works on all devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Routing**: React Router DOM v6
- **Styling**: Modern CSS with Grid and Flexbox
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the project files
2. Navigate to the project directory:
   ```bash
   cd TravelInsurance_Demo_2
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── Header.tsx          # Navigation header
│   ├── Header.css
│   ├── Footer.tsx          # Footer component
│   └── Footer.css
├── pages/
│   ├── Home.tsx            # Homepage with hero and features
│   ├── Home.css
│   ├── Quote.tsx           # Quote form with pricing
│   ├── Quote.css
│   ├── About.tsx           # About page
│   ├── About.css
│   ├── Contact.tsx         # Contact page
│   └── Contact.css
├── App.tsx                 # Main app component with routing
├── App.css                 # Global styles
├── index.tsx               # Entry point
└── index.css               # Base styles
```

## Troubleshooting

### PowerShell Execution Policy Issues

If you encounter PowerShell execution policy errors on Windows:

1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
3. Alternatively, use cmd instead: `cmd /c "npm install"` and `cmd /c "npm start"`

### Alternative Running Methods

- Use VS Code integrated terminal with cmd
- Use Git Bash or WSL if available
- Run commands with `cmd /c` prefix

## Features Details

### Quote Form
- Destination and travel dates
- Number of travelers and age selection
- Coverage level options (Basic, Standard, Premium)
- Activity-based pricing adjustments
- Real-time price calculation

### Responsive Design
- Mobile-first approach
- Flexible grid layouts
- Touch-friendly interface
- Optimized for all screen sizes

## Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is for demonstration purposes.
