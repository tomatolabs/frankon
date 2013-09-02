var mongoose = require('../../lib/mongoose');
var SchemaBuilder = require('./Common').SchemaBuilder;
var schema = SchemaBuilder
    .i()
    .withBase()
    .withCreatedBy()
    .withCreatedOn()
    .withUpdatedBy()
    .withUpdatedOn()
    .withProperties({

        //long description as detailed post content
        "content": String

    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model('Post', schema);
