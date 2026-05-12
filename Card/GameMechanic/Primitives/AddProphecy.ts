/**
 * AddProphecy.ts — Gắn 1 lời tiên tri vào ô của target.
 *
 * Resolver sẽ chạy ở cuối lượt tiếp theo của target
 * (xem `cardTest.html` -> `endTurn()` và Prophecies/*.ts).
 */
namespace GM {
  export function addProphecy(
    target: Player,
    owner: 0 | 1,
    mode: ProphecyMode,
  ): void {
    target.incomingProphecies.push({ owner, mode });
  }
}
