grant connect to vr;
grant dba to vr;

create Domain WEIGHT as decimal (12,3);
create Domain PRICE4 as decimal (12,4);

util.setUserOption 'asamium.default.domain', 'vr';

meta.defineType 'name:STRING';
meta.defineType 'code:SHORT';
meta.defineType 'packageRel:INT';
meta.defineType 'borderWidth:INT';
meta.defineType 'pieceWeight:WEIGHT';
meta.defineType 'code:SHORT';
meta.defineType 'width:INT';
meta.defineType 'price:PRICE4';

meta.defineType 'isDeleted:BOOL';


meta.defineEntity 'Material',
 'name;isDeleted'
;

meta.defineEntity 'FrameSize',
 'name;isDeleted'
;

meta.defineEntity 'Brand',
 'name;isDeleted'
;

meta.defineEntity 'Category',
 'name;importName,name;isDeleted'
;

meta.defineEntity 'Colour',
 'name;isDeleted'
;

meta.defineEntity 'Article',
 'name;code;packageRel;pieceWeight;borderWidth;'
  + 'optPrice,price;specialPrice,price;buyPrice,price;isDeleted',
 'Category,categoryId;'
 + 'Material,materialId;'
 + 'Brand,brandId,nullable;'
 + 'FrameSize,frameSizeId,nullable;'
 + 'Colour,colourId,nullable'
;

meta.createTable 'FrameSize',
  @forceDrop = 1
;

meta.createTable 'Material',
  @forceDrop = 1
;

meta.createTable 'Brand',
  @forceDrop = 1
;

meta.createTable 'Category',
  @forceDrop = 1
;

meta.createTable 'Colour',
  @forceDrop = 1
;

meta.createTable 'Article',
  @forceDrop = 1
;


meta.defineType 'src:STRING';

meta.defineEntity 'ArticleImage',
  'thumbnailSrc,src;smallSrc,src;largeSrc,src;isDeleted',
  'Article,articleId'
;

meta.createTable 'ArticleImage',
  @forceDrop = 1
;

meta.defineEntity 'ArticleImported',
  'parentName,name;code,name;name;artCode,name,,nullable;packageRel,name;pieceWeight,name;materialName,name;borderWidth,name;'
 + 'optPrice,name;specialPrice,name;buyPrice,name'
;

meta.createTable 'ArticleImported',
  @forceDrop = 1
;
