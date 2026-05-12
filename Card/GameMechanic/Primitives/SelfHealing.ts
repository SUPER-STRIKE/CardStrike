/**
 * SelfHealing.ts — Hồi HP cho player. Tự clamp tại player.maxHp.
 *
 * Spec hỗ trợ 2 dạng:
 *   - { flat: 8 }              → hồi 8 HP cố định
 *   - { pctOfMax: 0.05 }       → hồi 5% của MAX HP (luôn dùng maxHp,
 *                                 KHÔNG dùng currentHp)
 *
 * Quy tắc:
 *   - Số HP request được làm tròn xuống (Math.floor) để tránh phân số.
 *   - Nếu player đã full HP → return 0, không log gì.
 *   - Nếu request > (maxHp - hp) → chỉ heal đúng số còn thiếu.
 *   - player.hp luôn nằm trong [0, player.maxHp] sau khi gọi.
 *
 * Return: số HP thật sự đã hồi (≥ 0).
 */
namespace GM {
  export type HealSpec = { flat: number } | { pctOfMax: number };

  export function selfHealing(player: Player, spec: HealSpec): number {
    let requested: number;
    if ("flat" in spec) {
      if (!Number.isFinite(spec.flat) || spec.flat <= 0) return 0;
      requested = Math.floor(spec.flat);
    } else {
      if (!Number.isFinite(spec.pctOfMax) || spec.pctOfMax <= 0) return 0;
      // BASE = maxHp (NEVER currentHp). 0.05 of 100 maxHp = 5 even at 1 HP.
      requested = Math.max(1, Math.floor(player.maxHp * spec.pctOfMax));
    }

    const missing = player.maxHp - player.hp;
    if (missing <= 0) return 0;

    const actual = Math.min(requested, missing);
    player.hp += actual;
    return actual;
  }
}
