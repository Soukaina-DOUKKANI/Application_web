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
    index: 'gi_bvc_dtm'
}, function(error, response, status) {
    if (error) {
        console.log(error);
        return error;
    } 
    else {
        console.log("created a new index", response);
    }
});

/*

client.indices.delete({
    index: 'gi_bvc_dtm',
  }).then(function(resp) {
    console.log("index deleted successfully");
    console.log(JSON.stringify(resp, null, 4));
  }, function(err) {
    console.log(err);
  });
*/

