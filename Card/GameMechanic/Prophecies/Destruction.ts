/**
 * Prophecies/Destruction.ts — "Tiên tri hủy diệt"
 *
 * Điều kiện: cuối lượt của TARGET, nếu target đã đánh ≥ 1 bài
 *            → OWNER hồi 8 HP (clamped tại maxHp).
 */
namespace GM.Prophecies.DestructionResolver {
  GM.ProphecyResolvers["destruction"] = ({ target, owner, state, log }) => {
    if (state.cardsThisTurn >= 1) {
      const healed = GM.selfHealing(owner, { flat: 8 });
      log(
        "effect",
        `Tiên tri hủy diệt ✓ — ${target.name} đánh ${state.cardsThisTurn} bài ` +
        `→ ${owner.name} +${healed} HP (${owner.hp}/${owner.maxHp})`,
      );
    } else {
      log(
        "proph",
        `Tiên tri hủy diệt ✗ — ${target.name} không đánh bài nào`,
      );
    }
  };
}
