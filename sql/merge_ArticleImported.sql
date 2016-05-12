create or replace procedure vr.merge_ArticleImported (
) begin

  declare @colourRe string;

  set @colourRe = '(?<="\s)[^0-9(]*';

  merge into vr.Category as t using with auto name (
      select distinct
        regexp_substr(parentName,'[^\.]*$') as name,
        parentName as importName
      from vr.ArticleImported
    ) as i on t.name = i.name
    when not matched then insert
    when matched then update
  ;

  merge into vr.Material as t using with auto name (
      select distinct
        materialName as name
      from vr.ArticleImported
    ) as i on t.name = i.name
    when not matched then insert
    when matched then update
  ;

  merge into vr.Brand as t using with auto name (
      select distinct
        regexp_substr(name, '"[^"]*"') as name
      from vr.ArticleImported
      where name is not null
    ) as i on t.name = i.name
    when not matched then insert
    when matched then update
  ;

  merge into vr.Article t using with auto name (
      select
        code, name, packageRel, borderWidth,
        replace(replace (pieceWeight, ',', '.'),' ','') as pieceWeight,
        optPrice, specialPrice, buyPrice,
        (select id from vr.Category where importName = ai.parentName) as categoryId,
        (select id from vr.Material where name = ai.materialName) as materialId,
        (select id from vr.Brand where name = regexp_substr(ai.name, '"[^"]*"')) as brandId
      from vr.ArticleImported ai
    ) as i on i.code = t.code
    when not matched then insert
    when matched then update
  ;

  merge into vr.FrameSize as t using with auto name (
    select distinct
      regexp_substr(regexp_substr(name, '[^ ]*$'),'^[^\/]*') as name
      --TODO: width, height
    from vr.Article a
    where a.brandId is not null
      and a.name not like '%паспар%'
      and name is not null
  ) as i on i.name = t.name
    when not matched then insert
    when matched then update
  ;

  update vr.Article set frameSizeId = (
    select id from vr.FrameSize
    where Article.name like '%' + name + '%'
  ) where
    name not like '%паспар%'
  ;

  merge into vr.Colour as t using with auto name (
    select distinct
      trim(regexp_substr (name, @colourRe)) as name
    from vr.Article
    where name is not null
  ) as i on i.name = t.name
    when not matched then insert
    when matched then update
  ;

  update vr.Article set colourId = (
    select id from vr.Colour
    where name = regexp_substr (Article.name, @colourRe)
  );

end;
