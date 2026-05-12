/**
 * Mechanics/SelfHealing.ts
 *
 * Params: { flat: number } | { pctOfMax: number }
 *
 * Hồi HP cho `ctx.self`. Tự clamp tại maxHp.
 *
 *   - { flat: 8 }            → hồi 8 HP cố định
 *   - { pctOfMax: 0.05 }     → hồi floor(maxHp * 0.05). LUÔN dùng maxHp, KHÔNG
 *                              dùng currentHp (5% của 100 maxHp = 5 dù HP còn 1)
 *
 * Quy tắc:
 *   - Đã full HP   → return, không log
 *   - Heal > thiếu → chỉ heal đúng số thiếu
 */
namespace GM.Mechanics_SelfHealing {
  GM.Mechanics["SelfHealing"] = {
    apply(ctx, params: GM.HealParams) {
      const me = ctx.self;
      let requested: number;
      let label: string;

      if ("flat" in params) {
        if (!Number.isFinite(params.flat) || params.flat <= 0) return;
        requested = Math.floor(params.flat);
        label = `+${requested}`;
      } else {
        if (!Number.isFinite(params.pctOfMax) || params.pctOfMax <= 0) return;
        requested = Math.max(1, Math.floor(me.maxHp * params.pctOfMax));
        label = `+${requested} (${Math.round(params.pctOfMax * 100)}% maxHp)`;
      }

      const missing = me.maxHp - me.hp;
      if (missing <= 0) return;

      const actual = Math.min(requested, missing);
      me.hp += actual;

      ctx.log(
        "effect",
        `   ↪ ${me.name} hồi ${actual} HP ${label} → ${me.hp}/${me.maxHp}`,
      );
    },
  };
}
