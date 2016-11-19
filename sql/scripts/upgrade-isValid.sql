meta.defineType 'isValid:BOOL';

meta.defineEntity 'Baguette',
 'name;code;codeExternal,code;lastName,name,,nullable;borderWidth;isDeleted;isValid;nameExternal,name,,nullable',
 'Material,materialId;Brand,brandId,nullable;Colour,colourId,nullable;Surface,surfaceId,nullable'
;

alter table vr2.Baguette add codeExternal SHORT;
create index XK_Baguette_codeExternal on vr2.Baguette (codeExternal);

alter table vr2.Baguette add isValid BOOL null default 0;
alter table vr2.Baguette modify isValid not null;

alter table vr2.Baguette add nameExternal name null;
