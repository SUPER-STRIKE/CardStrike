/**
 * Mechanics/OpponentManaLoss.ts
 *
 * Params: { amount: number }
 *
 * Trừ mana của `ctx.opp`. Clamp tại 0.
 */
namespace GM.Mechanics_OpponentManaLoss {
  GM.Mechanics["OpponentManaLoss"] = {
    apply(ctx, params: { amount: number }) {
      const t = ctx.opp;
      if (!Number.isFinite(params.amount) || params.amount <= 0) return;
      const safe = Math.floor(params.amount);
      const before = t.mana;
      t.mana = Math.max(0, before - safe);
      const actual = before - t.mana;
      ctx.log("effect", `   ↪ ${t.name} mất ${actual} mana → ${t.mana.toLocaleString()}`);
    },
  };
}
