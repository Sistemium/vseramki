meta.defineType 'date:DATE';
meta.defineType 'count:INT';
meta.defineType 'comment:STRING,,nullable';

meta.defineEntity 'SaleOrder',
 'shipDate,date,,nullable;comment;' +
 'contactName,name;shipTo,name;email,name;phone,name;isDeleted',
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
