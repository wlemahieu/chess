# RdyChess - Online Multiplayer Chess

🎮 **[Play the Live Demo Here!](https://rdychess.com)**

A fully-featured chess game built with React, TypeScript, Zustand, and Firebase. Play locally on the same device or challenge friends online with real-time synchronization. This application implements complete chess rules including check, checkmate, stalemate, and special moves like pawn promotion.

## ✨ Key Features

- **🏠 Local Multiplayer** - Play with a friend on the same device
- **🌐 Online Multiplayer** - Challenge friends remotely with shareable game links
- **♟️ Complete Chess Rules** - Check, checkmate, stalemate, pawn promotion, and all standard moves
- **🔄 Real-time Sync** - Moves update instantly across all connected players
- **💾 Game History** - Track your active games with automatic reconnection
- **📱 Responsive Design** - Works on desktop and mobile devices
- **🎨 Multiple Themes** - Light and dark mode support

## 🏗️ Architecture Overview

This application follows a clean architecture pattern with clear separation of concerns:

- **State Management**: Zustand stores for different domains
- **Component Structure**: Atomic design with reusable components
- **Business Logic**: Separated utility functions for game rules
- **Type Safety**: Full TypeScript implementation with strict typing

## 📁 Project Structure

```
app/
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
│   │   ├── Modal.tsx                # Reusable modal wrapper
│   │   ├── GameModeSelection.tsx    # Local vs Online mode selection
│   │   ├── PlayerNameInput.tsx      # Player setup (local/online)
│   │   ├── OnlineWaitingRoom.tsx    # Waiting for opponent
│   │   ├── MyGames.tsx              # Game history display
│   │   ├── OptionsModal.tsx         # Game settings
│   │   ├── GameEndModal.tsx         # Checkmate/stalemate display
│   │   └── PawnPromotionModal.tsx   # Pawn promotion interface
│   │
│   ├── ui/             # UI elements
│   │   ├── TurnIndicator.tsx   # Visual turn indicator
│   │   ├── DraggingCursor.tsx  # Drag feedback
│   │   └── Navigation.tsx      # Top navigation bar
│   │
│   └── Game.tsx        # Main game orchestrator component
│
├── stores/             # Zustand state management
│   ├── types.ts           # Shared TypeScript types
│   ├── gameStore.ts       # Game flow state (turns, check, checkmate)
│   ├── boardStore.ts      # Board state and piece positions
│   ├── playerStore.ts     # Player information
│   ├── uiStore.ts         # UI state (selections, modals, preferences)
│   └── onlineGameStore.ts # Online multiplayer state and Firestore sync
│
├── utils/              # Business logic and utilities
│   ├── chessRules.ts      # Check, checkmate, stalemate detection
│   ├── pieceMovement.ts   # Movement calculation and validation
│   ├── movementRules.ts   # Piece-specific movement patterns
│   ├── boardSetup.ts      # Initial board configuration
│   ├── boardSetupPresets.ts # Test positions and scenarios
│   ├── gameHistory.ts     # LocalStorage game history management
│   └── constants.ts       # Game constants
│
├── hooks/              # Custom React hooks
│   └── useOnlineGameSync.ts # Firestore real-time sync and reconnection
│
├── firebase.client.ts  # Firebase/Firestore configuration
└── routes/            # React Router routes
    └── _index.tsx     # Main route
```

## 🎯 Key Files to Start With

### For Understanding the Game Logic:
1. **`app/utils/chessRules.ts`** - Core chess rules implementation
2. **`app/utils/pieceMovement.ts`** - How pieces move and capture
3. **`app/stores/boardStore.ts`** - Board state management and move execution

### For Understanding Online Multiplayer:
1. **`app/stores/onlineGameStore.ts`** - Online game state and Firestore operations
2. **`app/hooks/useOnlineGameSync.ts`** - Real-time synchronization logic
3. **`ONLINE_MULTIPLAYER.md`** - Detailed online multiplayer documentation
4. **`SECURITY.md`** - Security architecture and validation

### For Understanding the UI:
1. **`app/components/Game.tsx`** - Main game component with URL parameter handling
2. **`app/components/board/ChessBoard.tsx`** - Chess board rendering and interaction
3. **`app/components/modals/GameModeSelection.tsx`** - Mode selection screen

### For Understanding State Management:
1. **`app/stores/types.ts`** - All TypeScript type definitions
2. **`app/stores/gameStore.ts`** - Game flow and status
3. **`app/stores/uiStore.ts`** - UI state and user preferences
4. **`app/stores/onlineGameStore.ts`** - Online game state and Firestore sync

## 🔧 Technical Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Zustand** - State management
- **Firebase/Firestore** - Real-time database for online multiplayer
- **React Router** - Routing and navigation
- **Tailwind CSS v4** - Styling
- **Vite** - Build tool

## 🎮 Game Modes

### 🏠 Local Mode
- Two players on the same device
- No internet connection required
- Instant gameplay
- Perfect for quick matches with friends

### 🌐 Online Mode
- Play with friends remotely
- Shareable game links
- Real-time move synchronization
- Automatic reconnection
- Game history tracking
- Works across different devices

## ♟️ Chess Features

### Complete Rule Implementation
- All standard chess moves
- Legal move validation
- Check and checkmate detection
- Stalemate detection
- Pawn promotion
- Move history tracking

### UI Features
- Drag and drop piece movement
- Visual move indicators
- Turn indicators with player names
- Captured pieces display
- Dark/light theme support
- Responsive design for all screen sizes

### Online Features
- Game mode selection screen
- Player name customization
- Waiting room with shareable link
- "My Games" history viewer
- Automatic reconnection after refresh
- Real-time opponent move updates
- Connection status tracking

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Firebase project (for online multiplayer)

### Installation

```bash
# Install dependencies
npm install

# Start Firestore emulator (for local development)
npm run emulators

# In a separate terminal, start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck

# Linting
npm run lint
```

### Firebase Setup (for online multiplayer)

1. Create a Firebase project at https://console.firebase.google.com
2. Enable Firestore Database
3. Update `app/firebase.client.ts` with your Firebase config
4. Deploy Firestore security rules: `firebase deploy --only firestore:rules`

## 🎯 How to Play Online

### Creating a Game
1. Visit the app homepage
2. Click "Online Game"
3. Enter your name
4. Share the generated link with your friend
5. Wait for them to join

### Joining a Game
1. Click the game link your friend shared
2. Enter your name
3. Start playing immediately!

### Returning to Active Games
1. Visit homepage
2. Click "My Games" button
3. Select your active game from the list
4. Automatically reconnects you to the game

## 🏛️ Architecture Decisions

### State Management with Zustand
We use multiple Zustand stores to separate concerns:
- **gameStore**: Manages game flow, turns, and win conditions
- **boardStore**: Handles board state and piece movements (with Firestore sync in online mode)
- **playerStore**: Tracks player information
- **uiStore**: Controls UI state and user preferences
- **onlineGameStore**: Manages online multiplayer state and Firestore operations

This separation allows for:
- Better code organization
- Easier testing
- Independent state updates
- Clear domain boundaries
- Separation of local and online game logic

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

## 📚 Documentation

- **[README.md](README.md)** - This file, project overview and setup
- **[ONLINE_MULTIPLAYER.md](ONLINE_MULTIPLAYER.md)** - Online multiplayer implementation details
- **[SECURITY.md](SECURITY.md)** - Security architecture and best practices

## 🔒 Security

The online multiplayer mode implements defense-in-depth security:
- Multi-layer validation for all game actions
- Firestore as the single source of truth
- Player identity verification on every move
- LocalStorage used only for UI convenience, never for authorization

See [SECURITY.md](SECURITY.md) for detailed security documentation.

## 🤝 Contributing

When contributing to this codebase:
1. Follow the existing file structure
2. Add types to `stores/types.ts`
3. Keep components focused and single-purpose
4. Extract complex logic to utility functions
5. Update relevant Zustand stores for state changes
6. For online features, always validate against Firestore (see SECURITY.md)
7. Update documentation when adding new features

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

## 🐛 Known Limitations

- No time controls/chess clock (yet)
- No game chat (yet)
- No spectator mode (yet)
- No move undo/takeback (yet)
- No draw offers or resignation (yet)

## 🎯 Roadmap

- [ ] Add chess clock/time controls
- [ ] Implement game chat
- [ ] Add spectator mode
- [ ] Add move notation (PGN export)
- [ ] Implement game replay from move history
- [ ] Add draw offers and resignation
- [ ] Add game statistics/leaderboards
- [ ] Implement proper Firebase Authentication
- [ ] Add email game invitations
- [ ] Add push notifications for opponent moves

## 📧 Contact

For questions about the codebase architecture or implementation decisions, please open an issue in the repository.

## 📄 License

This project is open source and available under the MIT License.