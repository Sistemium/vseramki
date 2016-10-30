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
meta.defineType 'date:DATE';
meta.defineType 'count:INT';
meta.defineType 'comment:STRING,,nullable';
meta.defineType 'processing:CODE';
meta.defineType 'multiType:SHORT';

meta.defineType 'isDeleted:BOOL';
meta.defineType 'isValid:BOOL';

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
 'name;code;codeExternal,code;lastName,name,,nullable;borderWidth;isDeleted;isValid;nameExternal,name,,nullable',
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
  + 'multiType,,,nullable;'
  + 'isDeleted',
 'Baguette,baguetteId;FrameSize,frameSizeId;'
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

meta.defineEntity 'ArticleFrameSize',
 'count,,1;isDeleted',
 'Article,articleId;FrameSize,frameSizeId;'
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

meta.createTable 'ArticleFrameSize',
  @forceDrop = 1
;

drop table if exists [vr2].[Entity];

create table [vr2].[Entity] (
   id ID,
   [xid] CODE not null,
   [options] TEXT null,
   ts TS,
   cts CTS,
   primary key(id),
   unique(xid)
);


meta.defineEntity 'User',
 'name;email,name,,nullable;phone,name,,nullable;address,name,,nullable;isDeleted'
;

meta.createTable 'User',
  @forceDrop = 1
;

meta.defineEntity 'SaleOrder',
 'shipDate,date,,nullable;comment;' +
 'contactName,name;shipTo,name;email,name;phone,name;processing;isDeleted',
 'User,creatorId,nullable'
;

meta.defineEntity 'SaleOrderPosition',
 'count;price;priceOrigin,price;isDeleted',
 'SaleOrder,saleOrderId;Article,articleId'
;

meta.createTable 'SaleOrder',
  @forceDrop = 1
;

meta.createTable 'SaleOrderPosition',
  @forceDrop = 1
;
