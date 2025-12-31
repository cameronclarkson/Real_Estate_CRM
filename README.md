# Real Estate CRM

A modern, Trello-like Kanban board application built with Next.js for managing real estate deals and properties through your sales pipeline.

## Features

- 📋 **Kanban Board Interface**: Drag-and-drop cards between different pipeline stages
- 🏠 **Real Estate Focused**: Track properties with detailed information including:
  - Property addresses and parcel numbers
  - Legal descriptions and acreage
  - Zoning and utilities information
  - Survey and environmental details
  - Financial information (purchase price, asking price, offers)
- 👥 **Contact Management**: Store client contact information for each deal
- 💬 **Comments & Collaboration**: Add comments and notes to cards
- 🏷️ **Labels**: Color-code and organize cards with custom labels
- 📅 **Due Dates**: Set and track important dates
- 💾 **Local Storage**: Data persists in your browser's local storage

## Pipeline Stages

The default board includes these stages:

1. **Prospect** - Initial leads and opportunities
2. **Gross Lead** - Qualified prospects
3. **Net Lead** - High-value opportunities
4. **Under Contract** - Deals in progress
5. **Closed** - Completed transactions

## Tech Stack

- **Framework**: Next.js 16.1.1 (React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Drag & Drop**: @dnd-kit/core & @dnd-kit/sortable
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/cameronclarkson/Real_Estate_CRM.git
cd Real_Estate_CRM
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   │   ├── Board.tsx
│   │   ├── Card.tsx
│   │   ├── List.tsx
│   │   └── CardDetailModal.tsx
│   ├── context/          # React context providers
│   │   └── BoardContext.tsx
│   └── lib/              # Utilities and types
│       ├── storage.ts    # LocalStorage helpers
│       └── types.ts      # TypeScript interfaces
├── public/               # Static assets
└── package.json
```

## Usage

1. **Create a List**: Click the "+ Add List" button to create a new pipeline stage
2. **Add Cards**: Click "+ Add Card" in any list to create a new property/deal card
3. **Edit Cards**: Click on any card to open the detail modal and edit all information
4. **Move Cards**: Drag and drop cards between lists to update their stage
5. **Add Comments**: Use the comment section in the card detail modal to add notes

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Data Storage

Currently, all data is stored in the browser's local storage. This means:
- Data persists across browser sessions
- Data is specific to each browser/device
- Clearing browser data will remove all saved information

For production use, consider integrating with a backend database or cloud storage solution.

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Submit a pull request

## License

This project is private and proprietary.

## Author

Cameron Clarkson

