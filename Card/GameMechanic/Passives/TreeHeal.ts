/**
 * Passives/TreeHeal.ts
 *
 * Đăng ký vào GM.TurnStartEffects["tree"].
 *
 * Mỗi đầu lượt (cả 2 players), nếu `ctx.self.trees > 0`:
 *   Gọi mechanic SelfHealing với { pctOfMax: 0.05 } một lần cho mỗi cây.
 *   (Có thể gộp thành 1 lời gọi flat để log gọn hơn.)
 *
 * Dùng GM.Mechanics["SelfHealing"] luôn → tự động hưởng clamp tại maxHp.
 */
namespace GM.Passives_TreeHeal {
  const TREE_HEAL_PCT = 0.05;

  GM.TurnStartEffects["tree"] = (ctx) => {
    const me = ctx.self;
    if (me.trees <= 0) return;
    const perTree  = Math.max(1, Math.floor(me.maxHp * TREE_HEAL_PCT));
    const requested = perTree * me.trees;
    // delegate xuống SelfHealing để clamp tại maxHp + log thống nhất
    GM.Mechanics["SelfHealing"].apply(ctx, { flat: requested });
  };
}
