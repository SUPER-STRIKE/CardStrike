/**
 * Mechanics/OpponentHealing.ts
 *
 * Params: { flat: number } | { pctOfMax: number }
 *
 * Hồi HP cho `ctx.opp`. Tự clamp tại maxHp của opp.
 * (Hiếm dùng, chủ yếu cho các card "buff opponent" — drain, heal trade, ...)
 */
namespace GM.Mechanics_OpponentHealing {
  GM.Mechanics["OpponentHealing"] = {
    apply(ctx, params: GM.HealParams) {
      const t = ctx.opp;
      let requested: number;

      if ("flat" in params) {
        if (!Number.isFinite(params.flat) || params.flat <= 0) return;
        requested = Math.floor(params.flat);
      } else {
        if (!Number.isFinite(params.pctOfMax) || params.pctOfMax <= 0) return;
        requested = Math.max(1, Math.floor(t.maxHp * params.pctOfMax));
      }

      const missing = t.maxHp - t.hp;
      if (missing <= 0) return;

      const actual = Math.min(requested, missing);
      t.hp += actual;

      ctx.log("effect", `   ↪ ${t.name} hồi ${actual} HP → ${t.hp}/${t.maxHp}`);
    },
  };
}
