meta.defineType 'json:TEXT';

meta.defineEntity 'Entity',
 'name;isDeleted;options,json'
;

meta.createTable 'Entity',
  @forceDrop = 1
;

create table [vr2].[Entity] (
   id ID,
   [xid] CODE not null,
   [options] TEXT null,
   ts TS,
   cts CTS,
   primary key(id),
   unique(xid)
)
