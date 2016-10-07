meta.defineEntity 'Manufacturer',
 'name;isDeleted'
;

meta.createTable 'Manufacturer',
  @forceDrop = 1
;

meta.defineEntity 'Article',
 'name;code,code,,nullable;packageRel;pieceWeight,pieceWeight,,nullable;'
  + 'lowPrice,price,,nullable;highPrice,price,,nullable;'
  + 'isDeleted',
 'Baguette,baguetteId,nullable;FrameSize,frameSizeId;'
 + 'Screening,screeningId,nullable;BackMount,backMountId,nullable;PassePartout,passePartoutId,nullable;'
 + 'Manufacturer,manufacturerId,nullable'
;

alter table vr2.Article add foreign key (manufacturerId) references vr2.Manufacturer;

meta.defineEntity 'FrameSize',
 'name;'+
 'width,length,,nullable;'+
 'height,length,,nullable;'+
 'isoCode,code,,nullable;'+
 'isDeleted'
;

alter table vr2.FrameSize add isoCode code null;
