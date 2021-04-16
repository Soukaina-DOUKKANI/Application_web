const express = require('express');
const port = 4000
// creation de l'app web 
var app = express();
var sql = require('mssql');
var moment= require('moment');
var jwt= require('jsonwebtoken');
var bcrypt= require('bcrypt');

app.use(express.json())

var cors = require('cors');    
const { request } = require('express');
app.use(cors({credentials: true, origin: 'http://localhost:3000', methods:["GET,HEAD,OPTIONS,POST,PUT"]}));


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


// Enregistrement des comptes Utilisateurs
app.post('/users', function(req,res){
    const request= new sql.Request();
    const id=req.body.id;
    const utilisateur= req.body.utilisateur;
    const identifiant= req.body.identifiant;
    const pwd = req.body.pwd;
    const procedures = JSON.stringify( req.body.procedures);

    bcrypt.hash(pwd, 12, function (err, hash){
        if(err){
            console.log(err);
            return err;

        }
        else{

            request.input("id", sql.Int, id);
            request.input("utilisateur", sql.Text, utilisateur);
            request.input("identifiant", sql.Text, identifiant);
            request.input("pwd", sql.Text, pwd );
            request.input("hash", sql.Text, hash);
            request.input("procedures", sql.Text, procedures);

            request.query(`select * from Users where ID=@id and nom_utilisateur like @utilisateur and  identifiant like @identifiant `, function(err, result) {
                if(err){
                    console.log(err);
                    return (err);
                    
                }
                else {
                    if (!result.recordset.length){
                        request.query( `insert into Users (  nom_utilisateur, identifiant, pwd, hash, role, procedures) values ( @utilisateur, @identifiant, @pwd, @hash, 'user', @procedures)`, function (err, insert){
                            if (err){
                                console.log(err);
                                return(err);
                            }
                            else {
                                res.send('success, insert user')
                            }

                        })
                    }
                    else{
                        request.query(`UPDATE Users SET nom_utilisateur=@utilisateur, identifiant=@identifiant, pwd=@pwd, hash=@hash,  role='user', procedures=@procedures
                        where ID=@id and nom_utilisateur like @utilisateur and  identifiant like @identifiant ` , function(err, update){
                            if (err){
                                console.log(err);
                                return(err);
                            }
                            else {
                                res.send('success, update user ')
                    }

                })
            }
            
        }
        });

    }
});
    
    
})

//Connexion 
app.post('/connexion', function (req,res) {
    var request=new sql.Request();
    const identifiant= req.body.identifiant;
    const pwd=req.body.pwd;
    
    request.input('identifiant', sql.Text, identifiant);
    request.input('pwd', sql.Text, pwd);

    request.query('select * from Users where identifiant like @identifiant and pwd like @pwd ', function(err, result){
        if(err){
            console.log(err);
            return err;
        }
        
        else{
            if(result.recordset.length > 0){
                bcrypt.compare(pwd, result.recordset[0].hash ,  (error, response)=>{
                    if (response){
                        const id=result.recordset[0].ID;
                        const role=result.recordset[0].role;
                        const values={id,role}
                        const token= jwt.sign(values, "jwtSecret", {expiresIn: 60*60*4})
                        res.json( { auth: true, token:token , response: {id, role}})

                    }
                    else{
                        res.json({auth: false, message: 'wrong pwd'})
                    }

                })
                
            }
            else{
                res.json({auth: false, message: 'wrong pwd/id combination'})

            }
        }    
    });    
});


//verifyJWT middleware

const verifyJwt = (req,res,next) =>{
    const token = req.headers.authorization;

    if (!token ){
        res.status(403).send('forbidden')
    }
    else{
        jwt.verify(token, "jwtSecret", (err, decoded)=>{
            if (err){
                console.log(err)
                res.status(403).send('token expired')
            }
            else{
                req.userId = decoded.id;
                req.roleUser=decoded.role;
                next();
                
                
            }
        })

    }

}

app.use(verifyJwt)



//Validate connexion
app.get('/IsConnected', function(req,res){
     res.send({isLoggedIn: true, role:req.roleUser})
})


//check Identifiant
app.get('/checkIdentifiant/:identifiant/:id', function (req,res){
    const identifiant= req.params.identifiant
    const id= req.params.id
    const request=new sql.Request();
    
    request.input('identifiant', sql.Text, identifiant)
    request.input('id', sql.Int, id)

    request.query('select identifiant from Users where identifiant like @identifiant and id!=@id ', function(err, result) {

        if (err){
            console.log(err)
            return err

        }
        else{
            if(result.recordset.length){
                res.send('abort')
            }
            else{
                res.send('proceed')
            }
        }
    })
})
//Utilisateurs : Affichage de la liste des utilisateurs, affichage des procedures stockees

app.get('/list_users', function(req,res){
    var request= new sql.Request();

    request.query(`select ID, nom_utilisateur, identifiant from Users where role like 'user' `, function(err,result){
        if(err){
            console.log(err);
            return err;
        }
        else{
            res.send(result.recordset);
        }
    })
})

app.get('/get_user/:id', function(req,res){
    var request= new sql.Request();
    var id=req.params.id;
    request.query(`select * from Users where ID=${id} `, function(err,result){
        if(err){
            console.log(err);
            return err;
        }
        else{
            res.send(result.recordset[0]);
        }
    })
})

//Get BDD
app.get('/BDD', function(req,res){
    const request= new sql.Request()
    request.query(`SELECT name as bdd FROM sysdatabases WHERE name NOT IN('master', 'tempdb', 'model', 'msdb') `, function(err, result){
        if(err){console.log(err)}
        else{
            res.send(result.recordset)
        }
    })
})
// get list of SP
app.get('/List_procedures', function(req,res){
    var request= new sql.Request();
    request.query("SELECT SPECIFIC_NAME as P FROM GI_BVC_DTM.INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'PROCEDURE' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_') ", function (err, result){
        if(err){
            console.log(err);
            return err;
        }
        else{
            res.send(result.recordset);
        }
    })
})

app.get('/appFonction', function(req,res){
    const request=new sql.Request();
    const role=req.roleUser;
    const id= req.userId;

       // liste des  procedures stockees
       if(role=='admin'){
            request.query("SELECT SPECIFIC_NAME as F FROM GI_BVC_DTM.INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'function' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_', 'fn_') ", function (err, results){
                if (err) {
                    console.log(err)
                    return err
                }

                // afficher le resultat de la procedure 
                else{
                    res.send(results.recordset);
                   
                }
            });

        }
    


})

//affichage des PS et fonction
app.get('/allData', function (req, res) {
    // creation de la requete SQL
    var request = new sql.Request();
    const role=req.roleUser;
    const id= req.userId;

   // liste des  procedures stockees
   if(role=='admin'){
        request.query("SELECT SPECIFIC_NAME as P FROM GI_BVC_DTM.INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'PROCEDURE' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_') ", function (err, resultats){
            if (err) {
                console.log(err)
                return err
            }

            // afficher le resultat de la procedure 
            else{

                request.query("SELECT SPECIFIC_NAME as F FROM GI_BVC_DTM.INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'function' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_', 'fn_') ", function (err, results){
                    if (err) {
                        console.log(err)
                        return err
                    }

                    // afficher le resultat de la procedure 
                    else{
                        const obj=resultats.recordset
                        const fonctions=results.recordset
                        fonctions.map(item=>{
                            obj.push(item)
                        })
                        res.send(obj)
                    
                    }
                })   
            }
        });

   }
   else{
    request.query(`SELECT procedures as P from Users where ID=${id} `, function (err, results){
        
        if (err){
            console.log(err);
            return (err);
        } 

        // afficher le resultat de la procedure 
        else{
            
            const proc=JSON.parse(results.recordset[0].P);
            const values=[]
            proc.map(item=>{
                values.push({'P':item})               
            })

            res.send(values)

        }
    });

   }
    
    
});

// affichage des PS
app.get('/app', function (req, res) {
        // creation de la requete SQL
        var request = new sql.Request();
        const role=req.roleUser;
        const id= req.userId;

       // liste des  procedures stockees
       if(role=='admin'){
            request.query("SELECT SPECIFIC_NAME as P FROM GI_BVC_DTM.INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'PROCEDURE' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_') ", function (err, results){
                if (err) {
                    console.log(err)
                    return err
                }

                // afficher le resultat de la procedure 
                else{
                    res.send(results.recordset);
                   
                }
            });

       }
       else{
        request.query(`SELECT procedures as P from Users where ID=${id} `, function (err, results){
            
            if (err){
                console.log(err);
                return (err);
            } 

            // afficher le resultat de la procedure 
            else{
                
                const proc=JSON.parse(results.recordset[0].P);
                const values=[]
                proc.map(item=>{
                    values.push({'P':item})               
                })

                res.send(values)

            }
        });

       }
        
        
    });
})



//Metadata des procedures stockees

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
            }else{
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

//Metadata des fonctions tables

app.get('/page_fct/:name', function (req, res) {
    // liste des  procedures stockees
    var name =req.params.name;
     var request = new sql.Request();
     request.query(`select 
     R.SPECIFIC_NAME             AS [SP_NAME]
     ,R.SPECIFIC_CATALOG          AS [DATABASE]
     ,R.SPECIFIC_SCHEMA          AS [SCHEMA]
     
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
     where R.ROUTINE_TYPE = 'function'
     AND LEFT(R.ROUTINE_NAME, 3) NOT IN ('xp_', 'ms_', 'fn_')
     AND R.ROUTINE_NAME='${name}'
     order by R.CREATED`, function (err, results){
         if (err) {
             console.log(err);
         }else{
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

//interface user  function
app.post('/set_data_fct/:name', function(req,res){
    var name =req.params.name;
    const request=new sql.Request();
    request.input('data', sql.Text, JSON.stringify(req.body))
    
    request.query(`select * from Valeur_Ajuste where functionName like '${name}'`, function(err, result) {
        if(err){
            console.log(err);
            return (err);
            
        }
        else {
            if (!result.recordset.length){
                request.query( `insert into Valeur_Ajuste (functionName,functionData) values ( '${name}', @data)`, function (err){
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
                request.query(`UPDATE Valeur_Ajuste SET functionName='${name}', functionData=@data 
                where functionName like '${name}'` , function(err){
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


//interface user 
app.post('/set_data/:name', function(req,res){
    var name =req.params.name;
    const request=new sql.Request();
    request.input('data', sql.Text, JSON.stringify(req.body))
    
    request.query(`select * from Valeur_Ajuste where procedureName like '${name}'`, function(err, result) {
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
                where procedureName like '${name}'` , function(err){
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

//execution requete de la liste box 
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
//affichage interface user graphe parametres procedure
app.get('/Get_values/:proc', function (req,res){
    const request= new sql.Request();
    var proc =req.params.proc;
    request.query(`select formdata  from Valeur_Ajuste
                    where procedureName like '${proc}' ` , function(err,values){
        if (err){
            console.log(err);
            }
        else{
            const result= JSON.parse(values.recordset[0].formdata)
            res.send(result);
            }
        });
    
})

//affichage interface user graphe parametres function
app.get('/Get_values_fct/:fct', function (req,res){
    const request= new sql.Request();
    var fct =req.params.fct;
    request.query(`select functionData  from Valeur_Ajuste
                    where functionName like '${fct}' ` , function(err,values){
        if (err){
            console.log(err);
            }
        else{
            const result= JSON.parse(values.recordset[0].functionData)
            res.send(result);
            }
        });
    
})

app.post('/setGraph/:proc', function(req,res){
    const request=new sql.Request();
    const proc=req.params.proc;
    request.input('dataGraph', sql.Text, JSON.stringify(req.body))
    
    request.query(`select * from Data_Graph where procedureName like '${proc}'  `, function(err, result) {
        if(err){
            console.log(err);
            return (err);
            
        }
        else {
            if (!result.recordset.length){
                request.query( `insert into Data_Graph (procedureName, dataGraph) values ('${proc}',@dataGraph)`, function (err){
                    if (err){
                        console.log(err);
                        return(err);
                    }
                    else {
                        res.send('success, insert graph')
                    }

                })
            }
            else{
                request.query(`UPDATE Data_Graph SET procedureName='${proc}', dataGraph=@dataGraph
                where procedureName like '${proc}'` , function(err){
                    if (err){
                        console.log(err);
                        return(err);
                    }
                    else {
                        res.send('success, update graph ')
                    }

                })
            }
            
        }
        });


});



//Execution de la procedure stockee
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
            query_ += ' ,@valeur'
            

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

//Execution de la fonction table
app.post('/set_function', function(req,res){
    const request=new sql.Request();
    let query_ = `SELECT * FROM `;
    console.log(req.body.nameProc)
    request.input('procedure', sql.Text, req.body.nameProc);
    query_ += `${req.body.nameProc} (`; 
    
    for (let i in req.body){
        if (i.toLowerCase()=='@date_in'){
            request.input('date', sql.Date, moment(req.body[i]).format('yyyy-MM-DD'));
            const parametre1=  moment(req.body[i]).format('yyyy-MM-DD')

            query_+= ` '${parametre1}'`; 


        }
    }
    for (let i in req.body){
        if (i.toLowerCase()=='@titre'){
            request.input('valeur', sql.VarChar, req.body[i])
            const parametre2= req.body[i]
            query_ += ` ,'${parametre2}'`  

        }
        
    }
    if (query_.slice(-1)!=')'){
        query_ += ' )'
    }
    console.log(query_)

    request.query(query_, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            console.log(result.recordset)
            res.send(result.recordset);
        }
    })

    
})
//envoyer les parametres du graphes
app.post('/setGraphFct/:fct', function(req,res){
    const request=new sql.Request();
    const fct=req.params.fct;
    request.input('dataGraph', sql.Text, JSON.stringify(req.body))
    console.log('ocococ',req.body)
    request.query(`select * from Data_Graph where functionName like '${fct}'  `, function(err, result) {
        if(err){
            console.log(err);
            return (err);
            
        }
        else {
            if (!result.recordset.length){
                request.query( `insert into Data_Graph (functionName, dataGraphFct) values ('${fct}',@dataGraph)`, function (err){
                    if (err){
                        console.log(err);
                        return(err);
                    }
                    else {
                        res.send('success, insert graph')
                    }

                })
            }
            else{
                request.query(`UPDATE Data_Graph SET functionName='${fct}', dataGraphFct=@dataGraph
                where functionName like '${fct}'` , function(err){
                    if (err){
                        console.log(err);
                        return(err);
                    }
                    else {
                        res.send('success, update graph ')
                    }

                })
            }
            
        }
        });


});

//create new database
app.post('/AjoutBDD',function(req,res){
    const request= new sql.Request();
    request.input('bdd', sql.Text, req.body.baseBDD)
    console.log(req.body.baseBDD)
    
    request.query(`create database   ${req.body.baseBDD} `, function(err,result){
        if(err){console.log(err)}
        else{
            
            request.query('select * from sys.databases where name like @bdd ', (err,resultat)=>{
                if(err){console.log(err)}
                else{
                    if(resultat.recordset.length){
                        res.send('database created successfully')
                            }
                    else{
                        res.send('no database')

                        }

                    }
            })
                  
            
            
        }
    })


})


//get result of graph
app.get('/getGraph/:name',function(req,res){
    const request= new sql.Request();
    const name=req.params.name;
    request.query(`select dataGraph from Data_Graph where procedureName like '${name}' `, function(err,result){
        if(err){
            console.log(err);
            return(err);
        }
        else{
            const resGraph= JSON.parse(result.recordset[0].dataGraph)
            res.send(resGraph);
        }
    })
})


//ajouter une procedure
app.post('/AjoutProcedure', function(req,res){
    const request=new sql.Request();
    
    request.input('name', sql.Text, req.body.name)
    request.input('bdd', sql.Text, req.body.bdd)
    request.input('procedure', sql.Text, req.body.procedure)
    
    request.query(`select * from procedures where nom_procedure like @name `, function(err, result) {
        if(err){
            console.log(err);
            return (err);
            
        }
        else {
            if (!result.recordset.length){
                request.query( `insert into procedures (nom_procedure, bdd, procedure_code) values (@name,@bdd, @procedure)`, function (err){
                    if (err){
                        console.log(err);
                        return(err);
                    }
                    else {
                        res.send('success, insert proc')
                    }

                })
            }
            else{
                request.query(`UPDATE procedures  SET nom_procedure=@name,bdd=@bdd, procedure_code=@procedure
               
                where nom_procedure like @name  ` , function(err){
                    if (err){
                        console.log(err);
                        return(err);
                    }
                    else {
                        res.send('success, update proc ')
                    }

                })
            }
            let query_= 'execute SP_builder @procedure , @bdd'
            request.query(query_ , function (err, result){

                if (err) {console.log(err)}
                else{
                    console.log('success procedure creation')
                    res.send('SP success');

                }
    
            });
            
        }
        
        });


});

app.listen(port,  () => console.log(`server is running app on port ${port}`));
