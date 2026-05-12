/**
 * SelfDamage.ts — Trừ HP của 1 player. Tự clamp tại 0 (không cho HP âm).
 *
 * Quy tắc:
 *   - amount  ≤ 0 hoặc NaN  → no-op, return 0
 *   - amount  > player.hp   → chỉ trừ tối đa player.hp (overkill bị cắt)
 *   - player.hp luôn nằm trong [0, player.maxHp] sau khi gọi
 *
 * Return: số HP thật sự đã bị trừ (luôn ≥ 0).
 */
namespace GM {
  export function selfDamage(player: Player, amount: number): number {
    if (!Number.isFinite(amount) || amount <= 0) return 0;
    const before = player.hp;
    const actual = Math.min(Math.floor(amount), before);
    player.hp = before - actual; // before - actual ≥ 0 by construction
    return actual;
  }
}
