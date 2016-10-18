create table [vr2].[Entity] (
   id ID,
   [xid] CODE not null,
   [options] TEXT null,
   ts TS,
   cts CTS,
   primary key(id),
   unique(xid)
)
