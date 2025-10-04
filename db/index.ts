import { sql, type SQL } from 'drizzle-orm/sql';
import { primaryKey, sqliteTable, unique } from 'drizzle-orm/sqlite-core';
import type { UUID } from 'node:crypto';

export const offers = sqliteTable('offers', (o) => ({
	/**
	 * https://{category}.woot.com/offers/{slug}
	 */
	slug: o.text({ mode: 'text' }).notNull().unique(),
	/**
	 * Woot-Off Special Event
	 *
	 * A Woot-Off lasts for an unannounced length, usually 24–72 hours.[7] During a Woot-Off, products usually sell out quickly, and when one product sells out, it is replaced within a minute or two by a new product. A percentage bar shows how much stock of the current product remains. However, Woot never gives the exact quantity available until after the item has sold out.
	 */
	woot_off: o.integer({ mode: 'boolean' }).default(false),
	url: o
		.text()
		.generatedAlwaysAs((): SQL => sql`format('https://woot.com/offers/%s', ${offers.slug}, ${offers.slug})`, { mode: 'virtual' })
		.$type<UUID>(),
	extended_warranty: o.text({ mode: 'text' }),
	id: o.blob({ mode: 'buffer' }).primaryKey(),
	id_utf8: o
		.text()
		.generatedAlwaysAs((): SQL => sql`lower(format('%s-%s-%s-%s-%s', substr(hex(${offers.id}),1,8), substr(hex(${offers.id}),9,4), substr(hex(${offers.id}),13,4), substr(hex(${offers.id}),17,4), substr(hex(${offers.id}),21)))`, { mode: 'virtual' })
		.$type<UUID>(),
	quantity_limit: o.integer({ mode: 'number' }),

	featured: o.integer({ mode: 'boolean' }).default(false),
	app_featured: o.integer({ mode: 'boolean' }).default(false),
}));

/**
 * It is an error to add types, constraints or PRIMARY KEY declarations to a CREATE VIRTUAL TABLE statement used to create an FTS5 table. Once created, an FTS5 table may be populated using INSERT, UPDATE or DELETE statements like any other table. Like any other table with no PRIMARY KEY declaration, an FTS5 table has an implicit INTEGER PRIMARY KEY field named rowid.
 * @link https://www.sqlite.org/fts5.html
 */
export const offers_content = sqliteTable('offers_content', (oc) => ({
	teaser: oc.text({ mode: 'text' }),
	write_up_intro: oc.text({ mode: 'text' }),
	snippet: oc.text({ mode: 'text' }),
	write_up_body: oc.text({ mode: 'text' }),
	subtitle: oc.text({ mode: 'text' }),
	full_title: oc.text({ mode: 'text' }),
	features: oc.text({ mode: 'text' }),
	specs: oc.text({ mode: 'text' }),
}));

export const offer_photos = sqliteTable('offer_photos', (op) => ({
	id: op.blob({ mode: 'buffer' }).primaryKey(),
	offer_id: op
		.blob({ mode: 'buffer' })
		.notNull()
		.references(() => offers.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	height: op.integer({ mode: 'number' }).notNull(),
	width: op.integer({ mode: 'number' }).notNull(),
	url: op.text({ mode: 'text' }).notNull(),
	caption: op.text({ mode: 'text' }),
	tags: op.text({ mode: 'json' }).$type<string[]>(),
}));

export const offer_items = sqliteTable(
	'offer_items',
	(oi) => ({
		id: oi.blob({ mode: 'buffer' }).primaryKey(),
		offer_id: oi
			.blob({ mode: 'buffer' })
			.notNull()
			.references(() => offers.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	}),
	(oi) => [
		//
		unique().on(oi.id, oi.offer_id),
	],
);

export const shipping_methods = sqliteTable(
	'shipping_methods',
	(sm) => ({
		offer_id: sm
			.blob({ mode: 'buffer' })
			.notNull()
			.references(() => offers.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
		excluded_states: sm.text({ mode: 'json' }).$type<string[]>(),
		excluded_postal_codes: sm.text({ mode: 'json' }).$type<string[]>(),
		exclude_po_box: sm.integer({ mode: 'boolean' }).default(false),
		name: sm.text({ mode: 'text' }),
	}),
	(oi) => [
		//
		primaryKey({ columns: [oi.offer_id, oi.name] }),
	],
);
