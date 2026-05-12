/**
 * Cards/TienTriHuyDiet.ts — "Tiên tri hủy diệt"
 *
 * Cost (trong CARD_DATA của cardTest.html / CardData.json):
 *   mana: 0, hpCost: 4
 *
 * Khai báo effect — KHÔNG có code logic, chỉ là dữ liệu compose từ Mechanics:
 *   1. AddProphecy: cuối lượt sau của opp, nếu opp đã đánh ≥ 1 bài thì
 *      → SelfHealing(8) cho chủ thẻ
 */
namespace GM.CardDefs_TienTriHuyDiet {
  GM.Cards["Tiên tri hủy diệt"] = {
    effects: [
      {
        mechanic: "AddProphecy",
        params: {
          label: "Hủy diệt",
          condition: { type: "OpponentPlayedAtLeast", count: 1 },
          thenEffects: [
            { mechanic: "SelfHealing", params: { flat: 8 } },
          ],
          elseEffects: [],
        },
      },
    ],
  };
}
