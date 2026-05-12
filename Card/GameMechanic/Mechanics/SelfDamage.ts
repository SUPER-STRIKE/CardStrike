/**
 * Mechanics/SelfDamage.ts
 *
 * Params: { amount: number }
 *
 * Trừ HP của `ctx.self`. Tự clamp tại 0 (overkill bị cắt).
 * KHÔNG bao giờ làm HP âm.
 */
namespace GM.Mechanics_SelfDamage {
  GM.Mechanics["SelfDamage"] = {
    apply(ctx, params: { amount: number }) {
      const me = ctx.self;
      if (!Number.isFinite(params.amount) || params.amount <= 0) return;

      const before = me.hp;
      const actual = Math.min(Math.floor(params.amount), before);
      me.hp = before - actual;

      if (actual > 0) {
        ctx.log("cost", `   ↪ ${me.name} mất ${actual} HP → ${me.hp}/${me.maxHp}`);
      }
    },
  };
}
