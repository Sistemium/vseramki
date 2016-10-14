meta.defineEntity 'Article',
 'name;code,code,,nullable;packageRel,,,nullable;pieceWeight,pieceWeight,,nullable;'
  + 'lowPrice,price,,nullable;highPrice,price,,nullable;'
  + 'isDeleted',
 'Baguette,baguetteId,nullable;FrameSize,frameSizeId;'
  + 'Screening,screeningId,nullable;BackMount,backMountId,nullable'
;

alter table vr2.Article modify packageRel null;
