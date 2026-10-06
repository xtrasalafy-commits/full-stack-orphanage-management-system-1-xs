import "server-only";
import { desc, eq, getTableColumns } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "@/db";
import { basicNeeds, children, healthRecords, protectionCases } from "@/db/schema";
import type { ResourceKey, Row } from "@/lib/resources";

/* eslint-disable @typescript-eslint/no-explicit-any */
const tables: Record<ResourceKey, any> = {
  children,
  needs: basicNeeds,
  cases: protectionCases,
  checkups: healthRecords,
};

export function tableFor(key: ResourceKey): PgTable & { id: any } {
  return tables[key];
}

function flatten(r: any): Row {
  const { createdAt, ...rest } = r;
  void createdAt;
  return rest as Row;
}

export async function listResource(key: ResourceKey): Promise<Row[]> {
  const table = tables[key];
  if (key === "children") {
    const rows = await db.select().from(table).orderBy(desc(table.id));
    return rows.map(flatten);
  }
  const rows = await db
    .select({ ...getTableColumns(table), childName: children.fullName })
    .from(table)
    .leftJoin(children, eq(children.id, table.childId))
    .orderBy(desc(table.id));
  return rows.map(flatten);
}

export async function getResource(key: ResourceKey, id: number): Promise<Row | null> {
  const table = tables[key];
  if (key === "children") {
    const rows = await db.select().from(table).where(eq(table.id, id)).limit(1);
    return rows[0] ? flatten(rows[0]) : null;
  }
  const rows = await db
    .select({ ...getTableColumns(table), childName: children.fullName })
    .from(table)
    .leftJoin(children, eq(children.id, table.childId))
    .where(eq(table.id, id))
    .limit(1);
  return rows[0] ? flatten(rows[0]) : null;
}

export async function listChildOptions(): Promise<{ id: number; name: string }[]> {
  const rows = await db
    .select({ id: children.id, name: children.fullName, status: children.status })
    .from(children)
    .orderBy(children.fullName);
  return rows.map((r) => ({ id: r.id, name: r.name }));
}
