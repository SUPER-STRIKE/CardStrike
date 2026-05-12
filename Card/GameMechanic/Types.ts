/**
 * Types.ts — Core types shared across the GameMechanic module.
 *
 * Kiến trúc data-driven:
 *   - Cards là DỮ LIỆU: 1 list `EffectEntry` mỗi lá
 *   - Mechanics là HÀM ĐĂNG KÝ: `GM.Mechanics["SelfHealing"].apply(ctx, params)`
 *   - Conditions là PREDICATE: dùng bên trong AddProphecy
 *
 * IMPORTANT — HP semantics:
 *   - `player.hp`    = CURRENT HP, luôn nằm trong [0, maxHp]
 *   - `player.maxHp` = MAX HP, trần cho heal
 *   - % heal LUÔN dùng `maxHp` làm base (không phải currentHp)
 *   - Mọi Mechanic tự clamp; caller không cần lo
 */
namespace GM {
  /* ================================================================== */
  /*  Player & state                                                    */
  /* ================================================================== */
  export interface Player {
    name: string;
    hp: number;
    maxHp: number;
    mana: number;
    trees: number;
    incomingProphecies: PendingProphecy[];
  }

  export interface PendingProphecy {
    /** Index (0|1) của player ĐẶT prophecy. */
    owner: 0 | 1;
    /** Nhãn hiển thị (UI chip). */
    label: string;
    condition: ConditionSpec;
    thenEffects: EffectEntry[];
    elseEffects: EffectEntry[];
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
  export interface LogEntry { kind: LogKind; text: string; }
  export type LogFn = (kind: LogKind, text: string) => void;

  /* ================================================================== */
  /*  Context truyền vào mechanics & conditions                         */
  /* ================================================================== */
  /**
   * Context "self/opp" tương đối với người ĐANG kích hoạt mechanic:
   *   - Khi card được chơi:        self = người chơi card,    opp = đối thủ
   *   - Khi prophecy resolve:      self = OWNER của prophecy, opp = target (lượt vừa kết thúc)
   *   - Khi passive tick:          self = chủ passive,        opp = player còn lại
   */
  export interface EffectContext {
    selfIdx: 0 | 1;
    oppIdx: 0 | 1;
    self: Player;
    opp: Player;
    players: Player[];
    state: GameState;
    log: LogFn;
  }

  /* ================================================================== */
  /*  Effect entries (data-driven card definitions)                     */
  /* ================================================================== */
  /**
   * Mỗi lá bài khai báo list các effect entry này. Tag union để TS check.
   * Thêm mechanic mới → thêm 1 nhánh vào union.
   */
  export type EffectEntry =
    | { mechanic: "SelfDamage";       params: { amount: number } }
    | { mechanic: "SelfHealing";      params: HealParams }
    | { mechanic: "OpponentDamage";   params: { amount: number } }
    | { mechanic: "OpponentHealing";  params: HealParams }
    | { mechanic: "ManaGain";         params: { amount: number } }
    | { mechanic: "OpponentManaLoss"; params: { amount: number } }
    | { mechanic: "PlaceTree";        params: {} }
    | { mechanic: "AddProphecy";      params: AddProphecyParams };

  export type HealParams = { flat: number } | { pctOfMax: number };

  export interface AddProphecyParams {
    label: string;
    condition: ConditionSpec;
    thenEffects: EffectEntry[];
    elseEffects?: EffectEntry[];
  }

  /* ================================================================== */
  /*  Condition specs                                                   */
  /* ================================================================== */
  export type ConditionSpec =
    | { type: "OpponentPlayedAtLeast"; count: number }
    | { type: "OpponentPlayedAtMost";  count: number };

  /* ================================================================== */
  /*  Card definitions                                                  */
  /* ================================================================== */
  export interface CardDefinition {
    /** List effect chạy khi card được CHƠI (sau khi đã trừ cost). */
    effects: EffectEntry[];
  }
}
