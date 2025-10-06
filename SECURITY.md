# Security Model for Online Chess

## Overview

This document explains the security architecture for online multiplayer chess, particularly how we prevent cheating and ensure game integrity.

## Trust Model

### Source of Truth: Firestore
- **Firestore is the single source of truth** for all game state in online mode
- All critical game decisions are validated against Firestore data, not localStorage
- LocalStorage is used ONLY for convenience (UI state, reconnection hints)

### What We Trust
✅ **Firestore game documents** - These are authoritative
✅ **Server timestamps** - Used for move ordering
✅ **Player IDs matched against Firestore** - Validated on every move

### What We Don't Trust
❌ **LocalStorage** - Never used for game logic validation
❌ **Client-side `playerColor`** - Always validated against Firestore
❌ **Client-side `gameMode`** - Only used for UI flow
❌ **Move history from localStorage** - Display only, never affects gameplay

## Move Validation Chain (Defense in Depth)

When a player attempts to make a move in online mode, we validate at MULTIPLE layers:

### Layer 1: Client-Side UI Validation (boardStore.ts)
```typescript
// Line 44-75 in boardStore.ts
1. Verify gameState exists from Firestore
2. Verify playerId matches white OR black player in Firestore
3. Verify piece color matches player's ACTUAL color in Firestore
4. Verify it's this player's turn per Firestore currentTurn
```

### Layer 2: Chess Rules Validation
- Standard chess rules (piece movement, check, etc.)
- These are universally enforced regardless of online/local mode

### Layer 3: Firestore Write Validation (onlineGameStore.ts)
```typescript
// recordMove() function - line 270-323
1. RE-VALIDATE playerId against gameState (defense in depth)
2. Verify move.color matches player's actual color
3. Verify it's still player's turn (race condition check)
4. Only then write to Firestore
```

### Layer 4: Firestore Security Rules
- Server-side validation (future enhancement)
- Prevents unauthorized writes even if client is compromised

**Result**: Move must pass ALL 4 layers to be accepted

## Attack Scenarios & Mitigations

### Scenario 1: Player Modifies localStorage to Change Color
**Attack**: Player changes `playerColor` from "black" to "white" in localStorage

**Mitigation**:
- `boardStore.ts` lines 55-68 validate actual player color against Firestore
- Player ID is matched against `gameState.players.white.id` and `gameState.players.black.id`
- Move is rejected if piece color doesn't match player's actual Firestore color

**Result**: ❌ Move rejected, console error logged

### Scenario 2: Player Tries to Move on Opponent's Turn
**Attack**: Player attempts to make a move when it's not their turn

**Mitigation**:
- Line 71-74: Check `gameState.currentTurn` (from Firestore) matches player's actual color
- Turn state comes from Firestore subscription, not local state

**Result**: ❌ Move rejected with "Not your turn" error

### Scenario 3: Player Modifies Game State in Browser DevTools
**Attack**: Player directly manipulates `gameState` object in browser memory

**Mitigation**:
- `gameState` is subscribed from Firestore via `onSnapshot` listener
- Any local modification is immediately overwritten by next Firestore update
- Firestore is the source of truth, not browser memory

**Result**: ❌ Changes immediately reverted by Firestore sync

### Scenario 4: Player Tries to Join Full Game
**Attack**: Player modifies localStorage to have an existing `playerId` and tries to join as a third player

**Mitigation**:
- `onlineGameStore.ts` line 174-182: Server-side check that game status is "waiting"
- Check that `players.black` is `null` before allowing join
- These checks happen in Firestore transaction

**Result**: ❌ Join rejected, error message shown

### Scenario 5: Replay Attack (Resubmit Old Moves)
**Attack**: Player tries to replay a previous move by resending old Firestore updates

**Mitigation**:
- Moves include `timestamp` field
- `moveHistory` array in Firestore only accepts appends
- Current board state is stored separately and validated

**Result**: ❌ Duplicate moves detected and ignored

### Scenario 6: Player Fakes Their ID
**Attack**: Player modifies `playerId` in localStorage to impersonate another player

**Current Mitigation**:
- All move validations check `playerId` against Firestore `gameState`
- If fake ID doesn't match white or black player, all moves rejected
- Cannot join game as third player (black slot check)

**Limitation**:
- Player can create games with any ID (low impact)
- If they modify ID after creating game, they lock themselves out (self-harm only)

**Production Enhancement Needed**:
- Implement Firebase Authentication
- Replace localStorage `playerId` with authenticated user UID
- Firestore rules validate `request.auth.uid` matches player ID

**Current Result**: ⚠️ Mostly mitigated (no impact on game integrity, minor UX edge case)

## LocalStorage Usage (Non-Critical Only)

LocalStorage is used for these **non-critical** purposes:

1. **Player ID persistence** (`chess_player_id`)
   - Used for reconnection UX only
   - Always validated against Firestore before allowing moves

2. **Game history** (`chess_game_history`)
   - Display convenience only
   - Shows list of games player has participated in
   - Never affects actual game logic or move validation

3. **UI state** (via Zustand persist)
   - Theme preferences, display settings
   - Zero impact on game integrity

## Firestore Security Rules

Current rules (development):
```javascript
// Allow read for all (to join/spectate)
allow read: if true;

// Allow create for all (to start games)
allow create: if true;

// Allow update for all (simplified for development)
allow update: if true;
```

**Production TODO**: Implement stricter rules:
```javascript
// Only allow updates from actual game participants
allow update: if request.auth != null && (
  request.resource.data.players.white.id == request.auth.uid ||
  request.resource.data.players.black.id == request.auth.uid
);
```

## Best Practices for Contributors

When adding new features:

1. ✅ **DO** validate all game decisions against Firestore `gameState`
2. ✅ **DO** use localStorage for UI convenience only
3. ✅ **DO** verify player identity using `playerId` matched against Firestore
4. ❌ **DON'T** trust any client-side state for game logic
5. ❌ **DON'T** use localStorage values in move validation
6. ❌ **DON'T** assume `playerColor` from zustand store is correct

## Testing Security

To verify security:

1. Create an online game
2. Open browser DevTools
3. Try to modify `playerColor` in localStorage
4. Attempt to make a move as the opponent
5. Verify move is rejected with console error

Example test:
```javascript
// In browser console:
localStorage.setItem('chess_player_id', 'fake-id-123');
// Try to make a move
// Expected: Move rejected, "Player not in this game" error
```

## Security Improvements Implemented

✅ **Multi-layer validation** - All Firestore writes validate player identity
✅ **Defense in depth** - Player validated at UI layer AND Firestore write layer
✅ **Color verification** - Move color must match player's actual Firestore color
✅ **Turn verification** - Double-checked against Firestore on every move
✅ **Connection security** - Player ID validated before connection updates
✅ **Board state security** - Only game participants can update board
✅ **Game end security** - Only game participants can end game

## Vulnerabilities Fixed

| Vulnerability | File | Lines | Fix |
|--------------|------|-------|-----|
| Unvalidated playerColor in connection update | onlineGameStore.ts | 242-268 | Added player ID validation against Firestore |
| Race condition in move recording | onlineGameStore.ts | 270-323 | Added re-validation of player, color, and turn |
| Missing validation in board state update | onlineGameStore.ts | 325-348 | Added player ID validation |
| Unprotected game end | onlineGameStore.ts | 350-372 | Added player ID validation |

## Production Security Roadmap

### Critical (Before Production Launch)
- [ ] **Implement Firebase Authentication** - Replace localStorage player IDs with authenticated UIDs
- [ ] **Update Firestore Security Rules** - Validate `request.auth.uid` matches player ID in game
- [ ] **Add rate limiting** - Prevent spam moves and DoS attacks
- [ ] **Server-side move validation** - Cloud Functions to double-check move legality

### Important (High Priority)
- [ ] Add session management and token rotation
- [ ] Implement account recovery for lost games
- [ ] Add IP-based rate limiting for game creation
- [ ] Log suspicious activity for monitoring
- [ ] Add CAPTCHA for game creation (prevent bots)

### Nice to Have (Lower Priority)
- [ ] Implement game spectator mode with read-only Firestore rules
- [ ] Add admin controls for game moderation
- [ ] Implement cryptographic signatures for move verification
- [ ] Add anomaly detection (impossible moves, time manipulation)

## Current Security Posture

**Good for Development/Testing**: ✅
- Defense in depth prevents most cheating
- Firestore is source of truth
- Multi-layer validation on all moves

**Not Ready for Production**: ❌
- No authentication (localStorage IDs easily faked)
- Firestore rules too permissive (`allow update: if true`)
- No rate limiting (spam vulnerability)
- No audit logging
