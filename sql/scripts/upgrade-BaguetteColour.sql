meta.defineEntity 'Surface',
 'name;isDeleted'
;

meta.defineEntity 'BaguetteColour',
 'isDeleted',
 'Baguette,baguetteId;Colour,colourId'
;

meta.createTable 'Surface',
  @forceDrop = 1
;

meta.createTable 'BaguetteColour',
  @forceDrop = 1
;


meta.defineEntity 'Baguette',
 'code;lastName,name;borderWidth;isDeleted',
 'Material,materialId;Brand,brandId,nullable;Colour,colourId,nullable;Surface,surfaceId,nullable'
;


meta.defineEntity 'Article',
 'name;code,code,,nullable;packageRel;pieceWeight,pieceWeight,,nullable;'
  + 'lowPrice,price,,nullable;highPrice,price,,nullable;'
  + 'isDeleted',
 'Baguette,baguetteId,nullable;FrameSize,frameSizeId;'
 + 'Screening,screeningId,nullable;BackMount,backMountId,nullable'
;

alter table vr2.Baguette add foreign key (surfaceId) references vr2.Surface;
alter table vr2.Baguette drop foreign key brand;
alter table vr2.Baguette modify brandId null;
alter table vr2.Baguette add foreign key (brandId) references vr2.Brand;

alter table vr2.Baguette add code CODE;
alter table vr2.Baguette add lastName name;


alter table vr2.Article drop foreign key manufacturer;
alter table vr2.Article drop manufacturerId;
alter table vr2.Article drop foreign key passePartout;
alter table vr2.Article drop passePartoutId;
;
