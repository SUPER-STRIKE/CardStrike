/**
 * Conditions/OpponentPlayedAtLeast.ts
 *
 * Spec: { type: "OpponentPlayedAtLeast", count: N }
 *
 * Tại thời điểm evaluate (cuối lượt target), `state.cardsThisTurn` = số bài
 * target đã đánh trong lượt vừa rồi. Trả về true nếu ≥ count.
 *
 * Dùng cho prophecy "if đối thủ đánh ≥ N bài thì ...".
 */
namespace GM.Conditions_OpponentPlayedAtLeast {
  GM.Conditions["OpponentPlayedAtLeast"] = (ctx, cond) => {
    if (cond.type !== "OpponentPlayedAtLeast") return false;
    return ctx.state.cardsThisTurn >= cond.count;
  };
}
