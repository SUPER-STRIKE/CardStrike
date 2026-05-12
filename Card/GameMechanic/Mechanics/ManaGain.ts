/**
 * Mechanics/ManaGain.ts
 *
 * Params: { amount: number }
 *
 * Cộng mana cho `ctx.self`. Hiện chưa có cap.
 */
namespace GM.Mechanics_ManaGain {
  GM.Mechanics["ManaGain"] = {
    apply(ctx, params: { amount: number }) {
      const me = ctx.self;
      if (!Number.isFinite(params.amount) || params.amount <= 0) return;
      const safe = Math.floor(params.amount);
      me.mana += safe;
      ctx.log("effect", `   ↪ ${me.name} +${safe} mana → ${me.mana.toLocaleString()}`);
    },
  };
}
