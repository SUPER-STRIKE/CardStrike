/**
 * Registry.ts — Các registry mà runtime tra cứu.
 *
 * Workflow ở browser (cardTest.html):
 *   1. Click card → engine đọc GM.Cards[card.name].effects
 *   2. Với mỗi entry: GM.Mechanics[entry.mechanic].apply(ctx, entry.params)
 *   3. Nếu mechanic là AddProphecy → push vào opp.incomingProphecies
 *   4. Cuối lượt target: evaluate condition qua GM.Conditions[c.type], apply
 *      then/elseEffects bằng cùng engine
 *   5. Đầu mỗi lượt: GM.TurnStartEffects[id](ctx) cho mọi passive id
 *
 * Cách đăng ký: file `.ts` chỉ cần gán vào map. Order load không quan trọng
 * (mọi entry hoàn tất trước khi user click bài).
 */
namespace GM {
  /** Hàm xử lý 1 mechanic. Params loose-typed; chữ ký mạnh nằm trong EffectEntry. */
  export interface Mechanic {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    apply(ctx: EffectContext, params: any): void;
  }

  /** Predicate cho prophecy. */
  export type ConditionFn = (ctx: EffectContext, cond: ConditionSpec) => boolean;

  export const Mechanics:        Record<string, Mechanic>          = {};
  export const Conditions:       Record<string, ConditionFn>       = {};
  export const Cards:            Record<string, CardDefinition>    = {};
  export const TurnStartEffects: Record<string, (ctx: EffectContext) => void> = {};

  /* ----------------------------------------------------------------- */
  /*  Engine helpers — dùng bởi cardTest.html & internal mechanics     */
  /* ----------------------------------------------------------------- */

  /** Chạy list effect entries lần lượt. Nếu mechanic không tồn tại → log warn. */
  export function applyEffects(effects: EffectEntry[], ctx: EffectContext): void {
    for (const e of effects) {
      const mech = Mechanics[e.mechanic];
      if (!mech) {
        ctx.log("proph", `(Không có mechanic "${e.mechanic}")`);
        continue;
      }
      try {
        mech.apply(ctx, e.params);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        ctx.log("proph", `(Lỗi mechanic "${e.mechanic}": ${msg})`);
      }
    }
  }

  /** Đánh giá 1 ConditionSpec. */
  export function evaluateCondition(cond: ConditionSpec, ctx: EffectContext): boolean {
    const fn = Conditions[cond.type];
    if (!fn) {
      ctx.log("proph", `(Không có condition "${cond.type}")`);
      return false;
    }
    return fn(ctx, cond);
  }

  /**
   * Helper tạo context dùng chung. `selfIdx` là người đang là "self" trong góc
   * nhìn của effect (chủ thẻ / chủ prophecy / chủ passive).
   */
  export function makeContext(state: GameState, selfIdx: 0 | 1, log: LogFn): EffectContext {
    const oppIdx: 0 | 1 = selfIdx === 0 ? 1 : 0;
    return {
      selfIdx,
      oppIdx,
      self: state.players[selfIdx],
      opp:  state.players[oppIdx],
      players: state.players,
      state,
      log,
    };
  }
}
