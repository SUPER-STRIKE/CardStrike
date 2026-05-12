/**
 * Registry.ts — Public registries the runtime looks up at play time.
 *
 * The HTML test harness reads:
 *   - GM.CardEffects[card.name].onPlay(ctx)        when a card is played
 *   - GM.ProphecyResolvers[pending.mode](ctx)      at end of target's turn
 *   - GM.TurnStartEffects[id](ctx)  for each id    at start of every turn
 *
 * To add new cards / prophecies / passives, just write to these maps from
 * a file inside Cards/, Prophecies/, or Passives/.
 */
namespace GM {
  export interface CardEffect {
    /** Called immediately after the card's mana/HP cost has been paid. */
    onPlay?(ctx: EffectContext): void;
  }

  export const CardEffects: Record<string, CardEffect> = {};

  export const ProphecyResolvers: Record<string, (ctx: ProphecyContext) => void> = {};

  export const TurnStartEffects: Record<string, (ctx: TurnStartContext) => void> = {};
}
