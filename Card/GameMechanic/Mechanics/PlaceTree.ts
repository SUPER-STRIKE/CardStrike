/**
 * Mechanics/PlaceTree.ts
 *
 * Params: {} (none)
 *
 * Đặt 1 cây vào ô linh vật của `ctx.self`. Cây stack tuyến tính.
 * Effect tick mỗi lượt → xem Passives/TreeHeal.ts.
 */
namespace GM.Mechanics_PlaceTree {
  GM.Mechanics["PlaceTree"] = {
    apply(ctx, _params: {}) {
      const me = ctx.self;
      me.trees += 1;
      ctx.log("effect", `   ↪ Đặt 1 🌳 vào ô linh vật của ${me.name} (tổng ${me.trees})`);
    },
  };
}
