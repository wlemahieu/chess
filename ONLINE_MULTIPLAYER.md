# Online Multiplayer Chess Implementation

This document describes the online multiplayer functionality for RdyChess.

## Overview

The app now supports two game modes:
- **Local Mode**: Two players on the same device (original functionality)
- **Online Mode**: Two players on different devices via Firestore real-time sync

## Architecture

### Core Components

1. **Game Mode Selection** (`GameModeSelection.tsx`)
   - First screen users see
   - Choose between Local or Online game

2. **Online Game Store** (`onlineGameStore.ts`)
   - Manages online game state
   - Handles Firestore operations (create, join, update)
   - Maintains player connection status
   - Syncs moves and board state

3. **Player Name Input** (`PlayerNameInput.tsx`)
   - Updated to handle both local and online modes
   - For online mode:
     - Host creates game and enters name (becomes White)
     - Guest joins via link and enters name (becomes Black)

4. **Online Waiting Room** (`OnlineWaitingRoom.tsx`)
   - Shown to host after creating game
   - Displays shareable game link
   - Waits for opponent to join
   - Auto-starts when guest joins

5. **Game Sync Hook** (`useOnlineGameSync.ts`)
   - Handles real-time Firestore synchronization
   - Manages reconnection logic
   - Updates local game state from Firestore
   - Handles heartbeat to keep connection alive

### Data Flow

#### Creating a Game
1. User selects "Online Game"
2. User enters their name
3. System creates Firestore document with auto-generated ID
4. User gets shareable URL: `https://rdychess.com?game={gameId}`
5. Waiting room displays while waiting for opponent

#### Joining a Game
1. Friend clicks shared link with `?game={gameId}` parameter
2. System detects game ID in URL
3. Friend enters their name
4. System joins game as Black player
5. Game starts immediately for both players

#### Making Moves
1. Player makes move on their device
2. Move is validated locally
3. Move is recorded in Firestore with:
   - From/to positions
   - Piece type and color
   - Timestamp
   - Captured piece (if any)
4. Board state is serialized and saved
5. Opponent's device receives update via Firestore listener
6. Opponent's board updates in real-time

### Firestore Data Structure

```typescript
// Collection: games/{gameId}
{
  gameId: string;                    // Auto-generated Firestore doc ID
  status: "waiting" | "active" | "completed";
  mode: "online";
  players: {
    white: {
      id: string;                    // localStorage player ID
      name: string;
      color: "white";
      isConnected: boolean;
      lastSeen: number;              // Timestamp
    },
    black: {
      id: string;
      name: string;
      color: "black";
      isConnected: boolean;
      lastSeen: number;
    } | null
  },
  currentTurn: "white" | "black";
  boardState: string;                // Serialized Map<BoardPosition, TileData>
  moveHistory: [
    {
      from: BoardPosition;
      to: BoardPosition;
      piece: PieceName;
      color: Color;
      timestamp: number;
      capturedPiece?: PieceName;
      promotion?: PieceName;
    }
  ],
  capturedPieces: {
    white: PieceName[];
    black: PieceName[];
  },
  inCheck: Color | null;
  checkmate: boolean;
  stalemate: boolean;
  createdAt: number;
  updatedAt: number;
  winner?: Color | "draw";
}
```

## Key Features

### Player Persistence
- Player IDs stored in localStorage as `chess_player_id`
- Allows reconnection after browser refresh/close
- Format: `player_{timestamp}_{random}`

### Connection Management
- Real-time connection status tracking
- Heartbeat every 30 seconds to update `lastSeen`
- Auto-reconnect on tab focus
- Clean disconnect on tab close

### Move Synchronization
- All moves validated locally before Firestore update
- Only current player can move their pieces in online mode
- Board state serialized and synced after each move
- Move history maintained for replay/debugging

### Reconnection Logic
- Game state persisted in Firestore
- Player can close browser and return to same game
- Game state automatically restored from Firestore
- Board, captured pieces, and game status all synced

## Security (Firestore Rules)

Current rules (development-friendly):
```
- Anyone can read games (to join/spectate)
- Anyone can create games
- Anyone can update games (will tighten with auth)
- Anyone can delete games (development only)
```

**Production TODO**: Implement proper authentication and restrict updates to game participants only.

## Testing Locally

1. Start Firestore emulator:
   ```bash
   npm run emulators
   ```

2. Run dev server:
   ```bash
   npm run dev
   ```

3. Test flow:
   - Open browser window 1: Select "Online Game" → Enter name → Get link
   - Copy link from waiting room
   - Open browser window 2 (incognito): Paste link → Enter name
   - Both windows should show active game
   - Make moves in either window
   - Verify moves sync to other window

## Recent Enhancements ✅

- ✅ **Game History Tracking** - All games saved to localStorage
- ✅ **My Games Modal** - View and resume active games
- ✅ **Automatic Reconnection** - Players can refresh browser and return to game
- ✅ **Multi-layer Security** - All Firestore writes validate player identity

## Future Enhancements

- [ ] Add game chat
- [ ] Add spectator mode
- [ ] Add game replay from move history
- [ ] Add time controls (chess clock)
- [ ] Add draw offers and resignation
- [ ] Add game statistics/leaderboards
- [ ] Add proper user authentication
- [ ] Add game invitations via email
- [ ] Add notification when opponent makes move
- [ ] Add "rematch" functionality
- [ ] Add disconnect timeout (auto-forfeit after X minutes)
- [ ] Add move animation sync
- [ ] Clean up completed games from localStorage (auto-archive)

## Files Modified/Created

### New Files
- `app/stores/onlineGameStore.ts` - Online game state management and Firestore sync
- `app/components/modals/GameModeSelection.tsx` - Mode selection UI with My Games button
- `app/components/modals/OnlineWaitingRoom.tsx` - Waiting room UI with shareable link
- `app/components/modals/MyGames.tsx` - Game history viewer
- `app/hooks/useOnlineGameSync.ts` - Firestore sync and reconnection hook
- `app/utils/gameHistory.ts` - LocalStorage game history management
- `SECURITY.md` - Security documentation

### Modified Files
- `app/stores/types.ts` - Added online game types and move history
- `app/stores/boardStore.ts` - Added Firestore sync on moves with security validation
- `app/stores/uiStore.ts` - Added showModeSelection state
- `app/components/modals/PlayerNameInput.tsx` - Added online mode support and reconnection
- `app/components/Game.tsx` - Added URL parameter handling and reconnection logic
- `firestore.rules` - Updated security rules
- `README.md` - Updated with online multiplayer documentation

## Troubleshooting

**Game not syncing?**
- Check Firestore emulator is running
- Check browser console for errors
- Verify game ID matches in both windows

**Can't join game?**
- Verify game ID in URL is correct
- Check game status (must be "waiting")
- Ensure game isn't already full (has black player)

**Moves not appearing on opponent's board?**
- Check network tab for Firestore errors
- Verify Firestore listener is active
- Check that `gameMode` is set to "online"
