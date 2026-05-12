/**
 * Cards/TienTriHoaBinh.ts — "Tiên tri hòa bình"
 *
 * Cost: mana: 4, hpCost: 0
 *
 * Effect:
 *   1. AddProphecy: cuối lượt sau của opp, nếu opp đánh 0 bài thì
 *      → ManaGain(8) cho chủ thẻ
 */
namespace GM.CardDefs_TienTriHoaBinh {
  GM.Cards["Tiên tri hòa bình"] = {
    effects: [
      {
        mechanic: "AddProphecy",
        params: {
          label: "Hòa bình",
          condition: { type: "OpponentPlayedAtMost", count: 0 },
          thenEffects: [
            { mechanic: "ManaGain", params: { amount: 8 } },
          ],
          elseEffects: [],
        },
      },
    ],
  };
}
