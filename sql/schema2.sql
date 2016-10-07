grant connect to vr2;
grant dba to vr2;

create Domain WEIGHT as decimal (12,3);
create Domain PRICE4 as decimal (12,4);

util.setUserOption 'asamium.default.domain', 'vr2';

-- Types

meta.defineType 'name:STRING';
meta.defineType 'code:SHORT';
meta.defineType 'packageRel:INT';
meta.defineType 'borderWidth:INT';
meta.defineType 'pieceWeight:WEIGHT';
meta.defineType 'code:SHORT';
meta.defineType 'width:INT';
meta.defineType 'price:PRICE4';
meta.defineType 'length:INT';
meta.defineType 'src:STRING';

meta.defineType 'isDeleted:BOOL';

-- Entities

meta.defineEntity 'Material',
 'name;isDeleted'
;

meta.defineEntity 'FrameSize',
 'name;'+
 'width,length,,nullable;'+
 'height,length,,nullable;'+
 'isoCode,code,,nullable;'+
 'isDeleted'
;

meta.defineEntity 'Brand',
 'name;isDeleted'
;

meta.defineEntity 'Colour',
 'name;isDeleted'
;

meta.defineEntity 'Screening',
 'name;isDeleted'
;

meta.defineEntity 'BackMount',
 'name;isDeleted'
;

meta.defineEntity 'Surface',
 'name;isDeleted'
;

meta.defineEntity 'Baguette',
 'code;lastName,name;borderWidth;isDeleted',
 'Material,materialId;Brand,brandId,nullable;Colour,colourId,nullable;Surface,surfaceId,nullable'
;

meta.defineEntity 'BaguetteColour',
 'isDeleted',
 'Baguette,baguetteId;Colour,colourId'
;

meta.defineEntity 'Manufacturer',
 'name;isDeleted'
;


meta.defineEntity 'Article',
 'name;code,code,,nullable;packageRel;pieceWeight,pieceWeight,,nullable;'
  + 'lowPrice,price,,nullable;highPrice,price,,nullable;'
  + 'isDeleted',
 'Baguette,baguetteId,nullable;FrameSize,frameSizeId;'
  + 'Screening,screeningId,nullable;BackMount,backMountId,nullable'
;

meta.defineEntity 'ArticleImage',
  'thumbnailSrc,src;smallSrc,src;largeSrc,src;isDeleted',
  'Article,articleId'
;

meta.defineEntity 'BaguetteImage',
  'thumbnailSrc,src;smallSrc,src;largeSrc,src;isDeleted',
  'Baguette,baguetteId'
;

-- Tables

meta.createTable 'Material',
  @forceDrop = 1
;

meta.createTable 'Brand',
  @forceDrop = 1
;

meta.createTable 'Colour',
  @forceDrop = 1
;

meta.createTable 'Surface',
  @forceDrop = 1
;

meta.createTable 'Baguette',
  @forceDrop = 1
;

meta.createTable 'BaguetteColour',
  @forceDrop = 1
;

meta.createTable 'FrameSize',
  @forceDrop = 1
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

meta.createTable 'Manufacturer',
  @forceDrop = 1
;

meta.createTable 'Article',
  @forceDrop = 1
;

meta.createTable 'ArticleImage',
  @forceDrop = 1
;

meta.createTable 'BaguetteImage',
  @forceDrop = 1
;

alter table vr.Baguette add unique (brandId,materialId,colourId);
