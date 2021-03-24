const express = require('express');
const port = 4000
// creation de l'app web 
var app = express();
var sql = require('mssql');
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
    request.input('procédure', sql.Text, req.body.procédure)
    request.input('param1', sql.Text, req.body.parameter1)
    request.input('param2', sql.Text, req.body.parameter2)
    request.input('request', sql.Text, req.body.request)

    request.query(`INSERT INTO [Valeur_Ajuste] (nom_procedure_initale,procédure, param1,  param2, request) 
                    VALUES  ('${name}', @procédure, @param1,  @param2,  @request)`, function(err, result) {
        if(err){
            return (err);
            console.log(err);
        }
        else {
            res.send('success'); 
        }
        });


    });


app.get('/Get_values/:proc', function (req,res){
    const request= new sql.Request();
    var proc =req.params.proc;
    request.query(`select nom_procedure_initale AS NOM_INITIAL,
                    procédure AS NOM_PROCEDURE,
                    param1 as PARAMETRE1,
                    param2 as PARAMETRE2
                    from Valeur_Ajuste
                    where nom_procedure_initale like'${proc}' ` , function(err,values){
        if (err){
            console.log(err);
            }
        else{
            res.send(values.recordset);
            }
        });
    
})


    
app.listen(port,  () => console.log(`server is running app on port ${port}`));
