/**
 * Cards/CayCoThu.ts — "Cây cổ thụ"
 *
 * Cost: mana: 10, hpCost: 0
 *
 * Effect:
 *   1. PlaceTree (đặt 1 cây vào ô linh vật của chủ thẻ)
 *
 * Tick định kỳ ở Passives/TreeHeal.ts, dùng SelfHealing { pctOfMax: 0.05 }.
 */
namespace GM.CardDefs_CayCoThu {
  GM.Cards["Cây cổ thụ"] = {
    effects: [
      { mechanic: "PlaceTree", params: {} },
    ],
  };
}
