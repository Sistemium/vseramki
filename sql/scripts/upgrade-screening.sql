meta.defineEntity 'Screening',
 'name;isDeleted'
;

meta.defineEntity 'BackMount',
 'name;isDeleted'
;


meta.defineEntity 'PassePartout',
 'name;isDeleted'
;

meta.defineEntity 'Article',
 'name;code,code,,nullable;packageRel;pieceWeight,pieceWeight,,nullable;'
  + 'lowPrice,price,,nullable;highPrice,price,,nullable;'
  + 'isDeleted',
 'Baguette,baguetteId,nullable;FrameSize,frameSizeId;'
 + 'Screening,screeningId,nullable;BackMount,backMountId,nullable;PassePartout,passePartoutId,nullable'
;

meta.createTable 'Screening',
  @forceDrop = 1
;

meta.createTable 'BackMount',
  @forceDrop = 1
;

meta.createTable 'PassePartout',
  @forceDrop = 1
;

alter table vr2.Article add foreign key (screeningId) references vr2.Screening;
alter table vr2.Article add foreign key (backMountId) references vr2.BackMount;
alter table vr2.Article add foreign key (passePartoutId) references vr2.PassePartout;

create or replace trigger bIU_vr2_Article
    before insert, update
    order 10 on vr2.Article
    referencing new as inserted old as deleted
    for each row
begin

  if inserted.code is null then

    set inserted.code = (
      select coalesce(cast (max(code) as int), 10000) + 1
      from vr2.Article
    );

  end if;

end;
