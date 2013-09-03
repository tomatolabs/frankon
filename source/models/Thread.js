var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./Common').SchemaBuilder;
var Post = require('./Post').schema;
var schema = SchemaBuilder
    .i()
    .withBase()
    .withCreatedBy()
    .withCreatedOn()
    .withUpdatedBy()
    .withUpdatedOn()
    .withProperties({
        //short description as a title
        "title": String

        //original post
        , "op": {type: Number, ref: 'Post', required: true}

        , "posts": [{type: Number, ref: 'Post'}]

    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model('Thread', schema);
