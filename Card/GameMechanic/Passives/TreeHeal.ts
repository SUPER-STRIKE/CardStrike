/**
 * Passives/TreeHeal.ts — Cây cổ thụ heal định kỳ
 *
 * Mỗi lượt (cả 2 players), mỗi cây trong ô linh vật của 1 player hồi
 *   5% của MAX HP của chính player đó.
 *
 * Stack tuyến tính: 3 cây = 15% maxHp/lượt.
 * Tự clamp tại maxHp (do SelfHealing primitive xử lý).
 */
namespace GM.Passives.TreeHealTick {
  const TREE_HEAL_PCT = 0.05;

  GM.TurnStartEffects["tree"] = ({ owner, log }) => {
    if (owner.trees <= 0) return;
    const perTree = Math.max(1, Math.floor(owner.maxHp * TREE_HEAL_PCT));
    const requested = perTree * owner.trees;
    const actual = GM.selfHealing(owner, { flat: requested });
    if (actual > 0) {
      log(
        "effect",
        `🌳 ${owner.trees} cây của ${owner.name} hồi ${actual} HP ` +
        `(${perTree}/cây) → ${owner.hp}/${owner.maxHp}`,
      );
    }
  };
}
