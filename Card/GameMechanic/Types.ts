/**
 * Types.ts — Core types shared across the GameMechanic module.
 *
 * IMPORTANT: HP semantics
 *   - `player.hp`    = CURRENT HP, always clamped to [0, maxHp]
 *   - `player.maxHp` = MAX HP, the upper bound for healing
 *   - All percentage-based heals/damages MUST use `maxHp` as their base,
 *     never `hp`.
 *   - Primitives clamp the result, callers don't need to.
 */
namespace GM {
  export interface Player {
    name: string;
    /** Current HP. Always in [0, maxHp]. */
    hp: number;
    /** Max HP. The ceiling that current HP cannot exceed. */
    maxHp: number;
    mana: number;
    trees: number;
    incomingProphecies: PendingProphecy[];
  }

  /** Identifier for a prophecy resolver. New modes can be registered freely. */
  export type ProphecyMode = string;

  export interface PendingProphecy {
    /** Index (0 | 1) of the player who CAST the prophecy. */
    owner: 0 | 1;
    mode: ProphecyMode;
  }

  export interface GameState {
    players: Player[];
    current: 0 | 1;
    turn: number;
    cardsThisTurn: number;
    log: LogEntry[];
    gameOver: boolean;
  }

  export type LogKind = "turn" | "play" | "effect" | "cost" | "proph";

  export interface LogEntry {
    kind: LogKind;
    text: string;
  }

  export type LogFn = (kind: LogKind, text: string) => void;

  /** Context passed to a card's onPlay handler. */
  export interface EffectContext {
    selfIdx: 0 | 1;
    oppIdx: 0 | 1;
    players: Player[];
    state: GameState;
    log: LogFn;
  }

  /** Context passed to a prophecy resolver at the end of the TARGET's turn. */
  export interface ProphecyContext {
    /** Player whose turn just ended (the one the prophecy was "watching"). */
    target: Player;
    /** Player who originally cast the prophecy. */
    owner: Player;
    state: GameState;
    log: LogFn;
  }

  /** Context passed to a turn-start passive (e.g. tree heal). */
  export interface TurnStartContext {
    owner: Player;
    state: GameState;
    log: LogFn;
  }
}
