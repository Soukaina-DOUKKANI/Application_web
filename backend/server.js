const express = require('express');
const port = 4000
// creation de l'app web 
var app = express();
var sql = require('mssql');
var moment= require('moment');
app.use(express.json())
app.use(function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header('Access-Control-Allow-Headers', '*');
  next();
})
// configuration de la BDD SQL SERVER 
var config = {
    server: "localhost\\MSSQLSERVER",
    database: "GI_BVC_DTM",
    user: "soukaina",
    password: "souka-23",
    port: 1433,
    options: {
        enableArithAbort: true,
        encrypt: true
    },
};

//connexion a la BDD
sql.connect(config, function (err) {
    if (err) {
        console.log(err);
        return;
    }
app.get('/app', function (req, res) {
        // creation de la requete SQL
        var req = new sql.Request();
       // liste des  procedures stockees
        req.query("SELECT SPECIFIC_NAME as P FROM GI_BVC_DTM.INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'PROCEDURE' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_') ", function (err, results){
            if (err) console.log(err)

            // afficher le resultat de la procedure 
            res.send(results.recordset);
        });
        
    });
});

app.get('/page1/:name', function (req, res) {
       // liste des  procedures stockees
       var name =req.params.name;
        var request = new sql.Request();
        request.query(`select 
        R.SPECIFIC_NAME             AS [SP_NAME]
        ,R.SPECIFIC_CATALOG          AS [DATABASE]
        ,R.SPECIFIC_SCHEMA          AS [SCHEMA]
        ,ltrim(rtrim(substring(
           R.ROUTINE_DEFINITION,
            charindex('-- Description:',R.ROUTINE_DEFINITION) + len('-- Description:') + 1,
            charindex('--', R.ROUTINE_DEFINITION, charindex('-- Description:',R.ROUTINE_DEFINITION) + 2) - charindex('-- Description:',R.ROUTINE_DEFINITION) - len('-- Description:') - 3
        ))) as [SP_DESCRIPTION]
        ,ltrim(rtrim(substring(
           R.ROUTINE_DEFINITION,
            charindex('-- Author:',R.ROUTINE_DEFINITION) + len('-- Author:') + 1,
            charindex('--', R.ROUTINE_DEFINITION, charindex('-- Author:',R.ROUTINE_DEFINITION) + 2) - charindex('-- Author:',R.ROUTINE_DEFINITION) - len('-- Author:') - 3
        ))) as [Author_name]
        ,FORMAT (R.CREATED,'dd/MM/yyyy')                   AS [CREATE_DATE]
        ,FORMAT(R.LAST_ALTERED,'dd/MM/yyyy')              AS [MODIFY_DATE]
        ,P.PARAMETER_NAME            AS [NOM_PARAMETRE]
        ,P.DATA_TYPE                AS [TYPE_PARAMETRE]
        from INFORMATION_SCHEMA.PARAMETERS P
        join INFORMATION_SCHEMA.ROUTINES R
        on P.SPECIFIC_NAME= R.SPECIFIC_NAME
        where R.ROUTINE_TYPE = 'PROCEDURE'
        AND LEFT(R.ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_')
        AND R.ROUTINE_NAME='${name}'
        order by R.CREATED`, function (err, results){
            if (err) {
                console.log(err);
            }
            else {
                request.query(`select PARAMETER_NAME, DATA_TYPE
                FROM INFORMATION_SCHEMA.parameters
                WHERE SPECIFIC_NAME='${name}'`, function (err,result){
                    if (err) {console.log(err);}
                    else{
                        const obj_res = results.recordset[0];
                        obj_res.parameters = result.recordset;
                        res.send(obj_res);
                    }
                })
            }
        });

    });


app.post('/set_data/:name', function(req,res){
    var name =req.params.name;
    const request=new sql.Request();
    request.input('data', sql.Text, JSON.stringify(req.body))
    
    request.query(`select * from Valeur_Ajuste where procedureName='${name}'`, function(err, result) {
        if(err){
            console.log(err);
            return (err);
            
        }
        else {
            if (!result.recordset.length){
                request.query( `insert into Valeur_Ajuste (procedureName,formdata) values ( '${name}', @data)`, function (err){
                    if (err){
                        console.log(err);
                        return(err);
                    }
                    else {
                        res.send('success, insert')
                    }

                })
            }
            else{
                request.query(`UPDATE Valeur_Ajuste SET procedureName='${name}', formdata=@data 
                where procedureName='${name}'` , function(err){
                    if (err){
                        console.log(err);
                        return(err);
                    }
                    else {
                        res.send('success, update ')
                    }

                })
            }
            
        }
        });


    });


app.get('/Get_values/:proc', function (req,res){
    const request= new sql.Request();
    var proc =req.params.proc;
    request.query(`select formdata  from Valeur_Ajuste
                    where procedureName='${proc}' ` , function(err,values){
        if (err){
            console.log(err);
            }
        else{
            const result= JSON.parse(values.recordset[0].formdata)
            res.send(result);
            }
        });
    
})

app.get ('/Get_options/:requete', function(req, res){
    const request= new sql.Request();
    const requete=req.params.requete;
    request.query(requete, function(err, result){
        if(err){
            console.log(err);
            return(err);
        }
        else{
            res.send(result.recordset);
        }
    })
})

app.post('/set_procedure', function(req,res){
    const request=new sql.Request();
    let query_ = 'Execute';
    request.input('procedure', sql.VarChar, req.body.nameProc);
    query_ += ' @procedure'; 
    
    for (let i in req.body){
        if (i.toLowerCase()=='@date_in'){
            request.input('date', sql.Date, moment(req.body[i]).format('yyyy-MM-DD'));

            query_+= ' @date';

        }
    }
    for (let i in req.body){
        if (i.toLowerCase()=='@titre'){
            request.input('valeur', sql.VarChar, req.body[i])
            query_ += ' @valeur'
            

        }
    }
   
    request.query(query_, function(err, result){
        if(err){
            console.log(err);
        }
        else{

            res.send(result.recordset);
        }
    })

    
})
    
app.listen(port,  () => console.log(`server is running app on port ${port}`));
