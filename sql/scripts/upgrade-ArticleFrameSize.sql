meta.defineType 'count:INT';

meta.defineEntity 'ArticleFrameSize',
 'count,,1;isDeleted',
 'Article,articleId;FrameSize,frameSizeId;'
;

meta.createTable 'ArticleFrameSize',
  @forceDrop = 1
;


meta.defineType 'multiType:SHORT';

meta.defineEntity 'Article',
 'name;code,code,,nullable;packageRel;pieceWeight,pieceWeight,,nullable;'
  + 'lowPrice,price,,nullable;highPrice,price,,nullable;'
  + 'multiType,,nullable;'
  + 'isDeleted',
 'Baguette,baguetteId,nullable;FrameSize,frameSizeId;'
 + 'Screening,screeningId,nullable;BackMount,backMountId,nullable;PassePartout,passePartoutId,nullable'
;

alter table vr2.Article add multiType TINY;

alter table vr2.Article alter multiType check (multiType in ('passePartout', 'multiFrame'));
