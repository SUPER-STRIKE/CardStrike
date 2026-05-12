/**
 * Mechanics/OpponentDamage.ts
 *
 * Params: { amount: number }
 *
 * Trừ HP của `ctx.opp`. Tự clamp tại 0.
 */
namespace GM.Mechanics_OpponentDamage {
  GM.Mechanics["OpponentDamage"] = {
    apply(ctx, params: { amount: number }) {
      const t = ctx.opp;
      if (!Number.isFinite(params.amount) || params.amount <= 0) return;

      const before = t.hp;
      const actual = Math.min(Math.floor(params.amount), before);
      t.hp = before - actual;

      if (actual > 0) {
        ctx.log("effect", `   ↪ ${t.name} mất ${actual} HP → ${t.hp}/${t.maxHp}`);
      }
    },
  };
}
