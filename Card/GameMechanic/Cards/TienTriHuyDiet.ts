/**
 * Cards/TienTriHuyDiet.ts — "Tiên tri hủy diệt"
 *
 * Cost (handled bên ngoài, qua card.hpCost = 4): -4 HP của caster
 * Effect: AddProphecy("destruction") → resolve cuối lượt sau của đối thủ
 */
namespace GM.Cards.TienTriHuyDietDef {
  GM.CardEffects["Tiên tri hủy diệt"] = {
    onPlay({ selfIdx, oppIdx, players, log }) {
      const me  = players[selfIdx];
      const opp = players[oppIdx];

      GM.addProphecy(opp, selfIdx, "destruction");

      log(
        "proph",
        `   ↪ Lời tiên tri: nếu ${opp.name} đánh ≥1 bài lượt sau ` +
        `→ ${me.name} hồi 8 HP`,
      );
    },
  };
}
