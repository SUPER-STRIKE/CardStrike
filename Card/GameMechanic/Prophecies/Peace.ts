/**
 * Prophecies/Peace.ts — "Tiên tri hòa bình"
 *
 * Điều kiện: cuối lượt của TARGET, nếu target KHÔNG đánh bài nào
 *            → OWNER hồi 8 mana.
 */
namespace GM.Prophecies.PeaceResolver {
  GM.ProphecyResolvers["peace"] = ({ target, owner, state, log }) => {
    if (state.cardsThisTurn === 0) {
      const gained = GM.manaGain(owner, 8);
      log(
        "effect",
        `Tiên tri hòa bình ✓ — ${target.name} không đánh bài ` +
        `→ ${owner.name} +${gained} mana`,
      );
    } else {
      log(
        "proph",
        `Tiên tri hòa bình ✗ — ${target.name} đã đánh ${state.cardsThisTurn} bài`,
      );
    }
  };
}
