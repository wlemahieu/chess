# Chess Game - React TypeScript Application

🎮 **[Play the Live Demo Here!](https://chess-117183803177.us-west1.run.app/)**

A fully-featured chess game built with React, TypeScript, and Zustand for state management. This application implements complete chess rules including check, checkmate, stalemate, and special moves like pawn promotion.

## 🏗️ Architecture Overview

This application follows a clean architecture pattern with clear separation of concerns:

- **State Management**: Zustand stores for different domains
- **Component Structure**: Atomic design with reusable components
- **Business Logic**: Separated utility functions for game rules
- **Type Safety**: Full TypeScript implementation with strict typing

## 📁 Project Structure

```
src/
├── components/          # React components organized by feature
│   ├── board/          # Chess board related components
│   │   ├── ChessBoard.tsx      # Main board container
│   │   ├── BoardTile.tsx       # Individual tile component
│   │   └── PieceDisplay.tsx    # Chess piece rendering
│   │
│   ├── game/           # Game status and information
│   │   ├── GameStatus.tsx      # Current turn and check status
│   │   └── CapturedPieces.tsx  # Display of captured pieces
│   │
│   ├── modals/         # Modal dialogs
│   │   ├── Modal.tsx            # Reusable modal wrapper
│   │   ├── OptionsModal.tsx     # Game settings
│   │   ├── GameEndModal.tsx     # Checkmate/stalemate display
│   │   ├── PawnPromotionModal.tsx # Pawn promotion interface
│   │   └── PlayerNameInput.tsx  # Initial player setup
│   │
│   ├── ui/             # UI elements
│   │   ├── TurnIndicator.tsx   # Visual turn indicator
│   │   ├── DraggingCursor.tsx  # Drag feedback
│   │   └── OptionsButton.tsx   # Settings button
│   │
│   └── Game.tsx        # Main game orchestrator component
│
├── stores/             # Zustand state management
│   ├── types.ts        # Shared TypeScript types
│   ├── gameStore.ts    # Game flow state (turns, check, checkmate)
│   ├── boardStore.ts   # Board state and piece positions
│   ├── playerStore.ts  # Player information
│   └── uiStore.ts      # UI state (selections, modals, preferences)
│
├── utils/              # Business logic and utilities
│   ├── chessRules.ts   # Check, checkmate, stalemate detection
│   ├── pieceMovement.ts # Movement calculation and validation
│   ├── movementRules.ts # Piece-specific movement patterns
│   ├── boardSetup.ts   # Initial board configuration
│   ├── boardSetupPresets.ts # Test positions and scenarios
│   └── constants.ts    # Game constants
│
└── App.tsx            # Application entry point
```

## 🎯 Key Files to Start With

### For Understanding the Game Logic:
1. **`src/utils/chessRules.ts`** - Core chess rules implementation
2. **`src/utils/pieceMovement.ts`** - How pieces move and capture
3. **`src/stores/boardStore.ts`** - Board state management and move execution

### For Understanding the UI:
1. **`src/components/Game.tsx`** - Main game component that orchestrates everything
2. **`src/components/board/ChessBoard.tsx`** - Chess board rendering and interaction
3. **`src/components/board/BoardTile.tsx`** - Individual tile behavior

### For Understanding State Management:
1. **`src/stores/types.ts`** - All TypeScript type definitions
2. **`src/stores/gameStore.ts`** - Game flow and status
3. **`src/stores/uiStore.ts`** - UI state and user preferences

## 🔧 Technical Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 🎮 Features

### Core Chess Functionality
- Complete chess rule implementation
- Legal move validation
- Check and checkmate detection
- Stalemate detection
- Pawn promotion
- Move history tracking

### UI Features
- Drag and drop piece movement
- Visual move indicators (optional)
- Turn indicators
- Captured pieces display
- Player name customization
- Multiple board setup presets for testing

### Developer Features
- Test board configurations
- Configurable visual aids
- Clean component architecture
- Fully typed with TypeScript

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npx tsc --noEmit

# Linting
npm run lint
```

## 🏛️ Architecture Decisions

### State Management with Zustand
We use multiple Zustand stores to separate concerns:
- **gameStore**: Manages game flow, turns, and win conditions
- **boardStore**: Handles board state and piece movements
- **playerStore**: Tracks player information
- **uiStore**: Controls UI state and user preferences

This separation allows for:
- Better code organization
- Easier testing
- Independent state updates
- Clear domain boundaries

### Component Structure
Components are organized by feature/domain rather than type:
- **board/**: Everything related to the chess board
- **game/**: Game status and information display
- **modals/**: All modal dialogs
- **ui/**: Reusable UI elements

### Business Logic Separation
All chess rules and game logic are extracted into utility functions:
- Pure functions for easier testing
- Reusable across different components
- Clear separation from UI logic

## 📝 Code Style Guidelines

- **Components**: Functional components with hooks
- **State**: Zustand stores with clear action names
- **Types**: Comprehensive TypeScript types in `stores/types.ts`
- **Styling**: Tailwind CSS with occasional inline styles for dynamic values
- **File Naming**: PascalCase for components, camelCase for utilities

## 🧪 Testing Board Setups

The application includes preset board configurations for testing:
- **Normal**: Standard chess starting position
- **Pawn Pre-Promotion**: Test pawn promotion scenarios
- **Endgame Practice**: Minimal piece endgame
- **Check Practice**: Test check/checkmate scenarios

Access these through the Options modal in the game.

## 🤝 Contributing

When contributing to this codebase:
1. Follow the existing file structure
2. Add types to `stores/types.ts`
3. Keep components focused and single-purpose
4. Extract complex logic to utility functions
5. Update relevant Zustand stores for state changes

## 📚 Learning Path

For junior engineers learning this codebase:

1. **Start with Types** (`src/stores/types.ts`)
   - Understand the data structures
   - Learn the domain terminology

2. **Follow a User Action**
   - Start at `BoardTile.tsx` click handler
   - Trace through to `boardStore.movePiece()`
   - See how state updates propagate

3. **Understand Game Rules**
   - Read `chessRules.ts` for rule implementation
   - Check `pieceMovement.ts` for movement logic

4. **Explore State Management**
   - See how different stores interact
   - Understand the separation of concerns

5. **Review Component Hierarchy**
   - Start with `Game.tsx`
   - Follow the component tree down

## 📧 Contact

For questions about the codebase architecture or implementation decisions, please open an issue in the repository.