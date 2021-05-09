const { Client } = require('@elastic/elasticsearch')

const client = new Client({ 
    node: 'http://localhost:9200', 
    
})

client.ping({}, { requestTimeout: 20000 }, (err, response) => {
    if (err){
        console.log(err)
    }
    else{
        console.log('connected to elasticsearch')
    }
})




/*
client.indices.create({
    index: 'tables2'
    
}, function(error, response, status) {
    if (error) {
        console.log(error);
        return error;
    } 
    else {
        console.log("created a new index", response);
    }
});



client.indices.putSettings({
    index:'tables2',
    body:{
        analysis:{
            filter:{
                autocomplete_filter:{
                    type:"edge-ngram",
                    min_gram:1,
                    max_gram:20
                }
            }   
            
        },
         analyzer:{
            autocomplete:{
                type: "custom",
                tokenizer: "standard",
                filter: [
                    "lowercase",
                    "autocomplete_filter"
                ]

            }
        }    
    }
}).then(function(res){
    console.log('settings added successfully')
    console.log(res, res)
},function(err){
    console.log('err',err)
})
/*
client.indices.putMapping({
    index:'tables2',
    body:{
        
        properties:{
            table_name:{
                type: 'text',
                analyzer: 'autocomplete', 
                search_analyzer: 'standard'
                
            },
            DATABASE_NAME:{
                type: 'text',
                analyzer: 'autocomplete', 
                search_analyzer: 'standard'
                      
            },
            column_name:{
                type: 'text',
                analyzer: 'autocomplete', 
                search_analyzer: 'standard'
                      
            },
            table_description:{
                type: 'text',
                analyzer: 'autocomplete', 
                search_analyzer: 'standard'
                      
            },
            column_description:{
                type: 'text',
                analyzer: 'autocomplete', 
                search_analyzer: 'standard'
            },
            column_type:{
                type: 'text',
                analyzer: 'autocomplete', 
                search_analyzer: 'standard'
            }
        }
    }    
}).then(function(res){
    console.log('mapping added successfully')
    console.log(res)
},function(err){
    console.log('err',err)
})

/*
client.indices.delete({
    index: 'tables_metadata',
  }).then(function(resp) {
    console.log("index deleted successfully");
  }, function(err) {
    console.log(err);
  });

*/
