var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./Common').SchemaBuilder;
var Comment = require('./Comment').schema;
var schema = SchemaBuilder
    .i()
    .withBase()
    .withCreatedBy()
    .withCreatedOn()
    .withUpdatedBy()
    .withUpdatedOn()
    .withProperties({
        //short description as a title
        "name": String//"Jawbone UP 2nd Generation - 你的生活小秘书"

        //long description as detailed forum information
        , "desc": String //"Jawbone UP 2nd Generation - 你的生活小秘书, Jawbone UP 2nd Generation - 你的生活小秘书"

        , "children": [{type: Number, ref: 'Forum'}]

        , "threads": [{type: Number, ref: 'Thread'}]

    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model('Forum', schema);
