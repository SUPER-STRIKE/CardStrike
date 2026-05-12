/**
 * Cards/TienTriHoaBinh.ts — "Tiên tri hòa bình"
 *
 * Cost (handled bên ngoài, qua card.mana = 4): -4 mana
 * Effect: AddProphecy("peace") → resolve cuối lượt sau của đối thủ
 */
namespace GM.Cards.TienTriHoaBinhDef {
  GM.CardEffects["Tiên tri hòa bình"] = {
    onPlay({ selfIdx, oppIdx, players, log }) {
      const me  = players[selfIdx];
      const opp = players[oppIdx];

      GM.addProphecy(opp, selfIdx, "peace");

      log(
        "proph",
        `   ↪ Lời tiên tri: nếu ${opp.name} KHÔNG đánh bài lượt sau ` +
        `→ ${me.name} hồi 8 mana`,
      );
    },
  };
}
