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
