/**
 * ManaGain.ts — Cộng mana cho player. Hiện chưa có cap.
 *
 * Quy tắc:
 *   - amount  ≤ 0 hoặc NaN → no-op, return 0
 *   - Làm tròn xuống để giữ integer
 *
 * Return: số mana đã cộng.
 */
namespace GM {
  export function manaGain(player: Player, amount: number): number {
    if (!Number.isFinite(amount) || amount <= 0) return 0;
    const safe = Math.floor(amount);
    player.mana += safe;
    return safe;
  }
}
