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
        //short description as a title
        "name": String

        //long description as detailed forum information
        , "desc": String

        //sub forums of this forum
        , "children": [{type: Number, ref: 'Forum'}]

        //all threads which are related to this forum
        , "threads": [{type: Number, ref: 'Thread'}]

    })
    .build();

module.exports.schema = schema;
module.exports.model = mongoose.model('Forum', schema);
