meta.defineEntity 'User',
 'name;email,name,,nullable;phone,name,,nullable;isDeleted'
;

meta.createTable 'User',
  @forceDrop = 1
;
