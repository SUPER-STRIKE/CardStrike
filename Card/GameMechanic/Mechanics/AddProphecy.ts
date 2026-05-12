/**
 * Mechanics/AddProphecy.ts
 *
 * Params: AddProphecyParams = {
 *   label:        string             // hiển thị chip
 *   condition:    ConditionSpec      // điều kiện ở cuối lượt target
 *   thenEffects:  EffectEntry[]      // effects nếu condition TRUE
 *   elseEffects?: EffectEntry[]      // effects nếu condition FALSE (default [])
 * }
 *
 * Gắn 1 prophecy vào ô của `ctx.opp`. Cuối lượt opp, engine sẽ:
 *   1. Tạo context với self=OWNER, opp=TARGET
 *   2. Evaluate `condition` qua GM.evaluateCondition
 *   3. Apply thenEffects hoặc elseEffects qua GM.applyEffects
 */
namespace GM.Mechanics_AddProphecy {
  GM.Mechanics["AddProphecy"] = {
    apply(ctx, params: GM.AddProphecyParams) {
      const opp = ctx.opp;
      opp.incomingProphecies.push({
        owner:        ctx.selfIdx,
        label:        params.label,
        condition:    params.condition,
        thenEffects:  params.thenEffects,
        elseEffects:  params.elseEffects ?? [],
      });
      ctx.log(
        "proph",
        `   ↪ Đặt lời tiên tri "${params.label}" lên ${opp.name} ` +
        `(resolve cuối lượt sau của ${opp.name})`,
      );
    },
  };
}
