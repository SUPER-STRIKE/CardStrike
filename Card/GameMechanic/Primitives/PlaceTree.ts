/**
 * PlaceTree.ts — Đặt 1 cây vào ô linh vật của player. Cây stack tuyến tính.
 */
namespace GM {
  export function placeTree(player: Player): void {
    player.trees += 1;
  }
}
