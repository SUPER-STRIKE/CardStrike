/**
 * Conditions/OpponentPlayedAtMost.ts
 *
 * Spec: { type: "OpponentPlayedAtMost", count: N }
 *
 * Trả về true nếu target đánh ≤ count bài. Đặc biệt count=0 = "không đánh bài
 * nào", dùng cho prophecy hòa bình.
 */
namespace GM.Conditions_OpponentPlayedAtMost {
  GM.Conditions["OpponentPlayedAtMost"] = (ctx, cond) => {
    if (cond.type !== "OpponentPlayedAtMost") return false;
    return ctx.state.cardsThisTurn <= cond.count;
  };
}
