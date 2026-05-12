/**
 * Cards/CayCoThu.ts — "Cây cổ thụ"
 *
 * Cost (handled bên ngoài, qua card.mana = 10): -10 mana
 * Effect: PlaceTree(self) → 1 cây vào ô linh vật. Cây tick mỗi lượt
 *         qua Passives/TreeHeal.ts.
 */
namespace GM.Cards.CayCoThuDef {
  GM.CardEffects["Cây cổ thụ"] = {
    onPlay({ selfIdx, players, log }) {
      const me = players[selfIdx];

      GM.placeTree(me);

      log(
        "effect",
        `   ↪ Đặt 1 🌳 vào ô linh vật của ${me.name} (tổng ${me.trees} cây)`,
      );
    },
  };
}
