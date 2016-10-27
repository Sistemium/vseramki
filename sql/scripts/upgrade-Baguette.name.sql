meta.defineEntity 'Baguette',
 'name;code;lastName,name;borderWidth;isDeleted',
 'Material,materialId;Brand,brandId,nullable;Colour,colourId,nullable;Surface,surfaceId,nullable'
;

alter table vr2.Baguette add name NAME null;


update vr2.Baguette set name = trim(string(
  baguette.code + ' ',
  if brand.name is not null then ' "' + brand.name + '" ' endif,
  surface.name,
  ' ',
  colour.name
))
from vr2.Baguette
  left join vr2.Material
  left join vr2.Colour
  left join vr2.Brand
  left join vr2.Surface
where Baguette.name is null;

alter table vr2.Baguette modify name not null;
