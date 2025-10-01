import { PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core"
import { getUserPermissions } from "./getUserPermissions"
import { rulesToAST } from "@casl/ability/extra"
import { auth } from "../auth/auth"
import { CompoundCondition, Condition, FieldCondition } from "@ucast/core"
import { and, eq, or, SQL } from "drizzle-orm"

export function drizzleWhere<T extends TableConfig>(
  action: Parameters<ReturnType<typeof getUserPermissions>["rulesFor"]>[0],
  subject: Parameters<ReturnType<typeof getUserPermissions>["rulesFor"]>[1],
  user: typeof auth.$Infer.Session.user | undefined,
  table: PgTableWithColumns<T>
) {
  const ast = rulesToAST(getUserPermissions(user), action, subject)

  if (ast == null) return undefined

  return getConditionSql(ast, table)
}

function getConditionSql<T extends TableConfig>(
  condition: Condition,
  table: PgTableWithColumns<T>
): SQL | undefined {
  if (condition instanceof CompoundCondition) {
    switch (condition.operator) {
      case "and":
        return drizzleAnd(condition, table)
      case "or":
        return drizzleOr(condition, table)
      default: {
        throw new Error(
          `Unsupported compound condition operator: ${condition.operator}`
        )
      }
    }
  }

  if (condition instanceof FieldCondition) {
    switch (condition.operator) {
      case "eq": {
        return drizzleEq(condition, table)
      }
      default: {
        throw new Error(
          `Unsupported field condition operator: ${condition.operator}`
        )
      }
    }
  }
}

function drizzleEq<T extends TableConfig>(
  condition: FieldCondition,
  table: PgTableWithColumns<T>
) {
  return eq(table[condition.field], condition.value)
}

function drizzleAnd<T extends TableConfig>(
  condition: CompoundCondition,
  table: PgTableWithColumns<T>
) {
  return and(...condition.value.map(cond => getConditionSql(cond, table)))
}

function drizzleOr<T extends TableConfig>(
  condition: CompoundCondition,
  table: PgTableWithColumns<T>
) {
  return or(...condition.value.map(cond => getConditionSql(cond, table)))
}
