const express = require('express');
const port = 4000
// creation de l'app web 
var app = express();
var sql = require('mssql');
var moment= require('moment');
var jwt= require('jsonwebtoken');
var bcrypt= require('bcrypt');
const { Client } = require('@elastic/elasticsearch')

app.use(express.json())

var cors = require('cors');    

app.use(cors({credentials: true, origin: 'http://localhost:3000', methods:["GET,HEAD,OPTIONS,POST,PUT"]}));

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

// configuration de  SQL SERVER 
var config = {
    server: "localhost\\MSSQLSERVER",
    database:"APP_WEB_DATA",
    user: "soukaina",
    password: "souka-23",
    port: 1433,
    options: {
        enableArithAbort: true,
        encrypt: true
    },
};

//connexion a Sql server
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
    const fonctions = JSON.stringify( req.body.fonctions);

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
            request.input("fonctions", sql.Text, fonctions);

            request.query(`use APP_WEB_DATA`, function(err,results){
                if(err){console.log(err)}
                else{
                    request.query(`select * from Comptes_Utilisateurs where ID=@id and nom_utilisateur like @utilisateur and  identifiant like @identifiant `, function(err, result) {
                        if(err){
                            console.log(err);
                            return (err);
                            
                        }
                        else {
                            if (!result.recordset.length){
                                request.query( `insert into Comptes_Utilisateurs (  nom_utilisateur, identifiant, pwd, hash, role, procedures, fonctions) values ( @utilisateur, @identifiant, @pwd, @hash, 'user', @procedures, @fonctions)`, function (err, insert){
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
                                request.query(`UPDATE Comptes_Utilisateurs SET nom_utilisateur=@utilisateur, identifiant=@identifiant, pwd=@pwd, hash=@hash,  role='user', procedures=@procedures, fonctions=@fonctions
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
            })         
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
    
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query('select * from Comptes_Utilisateurs where identifiant like @identifiant and pwd like @pwd ', function(err, result){
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
        }
    }) 
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

// use middleware verifyJwt
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
    
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query('select identifiant from Comptes_Utilisateurs where identifiant like @identifiant and id!=@id ', function(err, result) {

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
        }
    })
})

//search bar elasticsearch 
app.post('/search', function(req,res){
    const search=req.body.search
    client.search({
        index: 'metadonnees',
        body:{
            query: {
                multi_match: {
                    query: search,
                    fuzziness: "auto",
                    fuzzy_transpositions: true,
                    max_expansions: 50,
                    prefix_length: 1
                }
            },     
        }
    },
    function(error,data){
        if (error){
            console.log(error)
        }
        else{
           //console.log(data.body.hits.hits)
            const result=[]
            const obj_search=data.body.hits.hits
            obj_search.map(item=>{
                Object.keys(item).map(key=>{
                    if(key=='_source'){
                        result.push(item[key])
                    }
                })
                
            })
            res.send(result)
        }
    }) 

})

//Utilisateurs : Affichage de la liste des utilisateurs, affichage des procedures stockees

app.get('/list_users', function(req,res){
    var request= new sql.Request();

    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select ID, nom_utilisateur, identifiant from Comptes_Utilisateurs where role like 'user' `, function(err,result){
                if(err){
                    console.log(err);
                    return err;
                }
                else{
                    res.send(result.recordset);
                }
            })
        }
    })
})

//GET USER DATA BY ID
app.get('/get_user/:id', function(req,res){
    var request= new sql.Request();
    var id=req.params.id;
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select * from Comptes_Utilisateurs where ID=${id} `, function(err,result){
                if(err){
                    console.log(err);
                    return err;
                }
                else{
                    res.send(result.recordset[0]);
                }
            })
        }
    })
})

//Get BDD
app.get('/BDD', function(req,res){
    const request= new sql.Request()
    request.query(`SELECT name as bdd FROM sysdatabases WHERE name NOT IN('master', 'tempdb', 'model', 'msdb', 'APP_WEB_DATA') `, function(err, result){
        if(err){console.log(err)}
        else{
            res.send(result.recordset)
        }
    })
})



// GET LIST OF SP
app.get('/List_procedures', function(req,res){
    var request= new sql.Request();
    request.query(`CREATE TABLE #x(db SYSNAME, S SYSNAME, P SYSNAME);
                    DECLARE @sql NVARCHAR(MAX) = N'';
                    SELECT @sql += N'INSERT #x SELECT ''' + name + ''',S.name, P.name
                    FROM ' + QUOTENAME(name) + '.sys.schemas AS S
                    INNER JOIN ' + QUOTENAME(name) + '.sys.procedures AS P
                    ON P.schema_id = S.schema_id;
                    ' FROM sys.databases WHERE database_id > 5
                    EXEC sp_executesql @sql;
                    SELECT P FROM #x where LEFT(P, 3) NOT IN ('sp_', 'xp_', 'ms_') `, function(err,result){
                        if (err){console.log(err)}
                        else{
                            res.send(result.recordset)

                        }
                    })
    
})

//GET LIST OF FUNCTIONS

app.get('/List_fonctions', function(req,res){
    var request= new sql.Request();
    request.query(`CREATE TABLE #x(db SYSNAME, S SYSNAME, F SYSNAME, Type_fn SYSNAME);
    
                    DECLARE @sql NVARCHAR(MAX) = N'';
                    
                    SELECT @sql += N'INSERT #x SELECT ''' + name + ''',s.name, F.name, F.type
                    FROM ' + QUOTENAME(name) + '.sys.schemas AS s
                    INNER JOIN ' + QUOTENAME(name) + '.sys.Objects AS F
                    ON F.schema_id = s.schema_id;' 
                    FROM sys.databases WHERE database_id > 5
                    
                    EXEC sp_executesql @sql;
                    
                    SELECT F FROM #x where Type_fn in ('IF', 'TF', 'FT') `, function (err, result){
        if(err){
            console.log(err);
            return err;
        }
        else{
            res.send(result.recordset);
        }
    })
})

//show list of functions to user in checkbox
app.get('/appFonction/:baseDD', function(req,res){
    const request=new sql.Request();
    const role=req.roleUser;
    const id= req.userId;
    const bdd=req.params.baseDD;

       // liste des  procedures stockees
        if(role=='admin'){
            request.query(`use ${bdd}`, function (err, results){
                if(err){console.log(err)}
                else{
                    request.query(`SELECT SPECIFIC_NAME as F FROM INFORMATION_SCHEMA.ROUTINES WHERE SPECIFIC_CATALOG='${bdd}' AND ROUTINE_TYPE = 'function' AND LEFT(ROUTINE_NAME, 3) NOT IN ('fn_') `, function (err, results){
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
            
        }
        else{
            request.query(`use APP_WEB_DATA`, function(err,results){
                if(err){console.log(err)}
                else{
                    request.query(`SELECT fonctions as F from Comptes_Utilisateurs where ID=${id} `, function (err, results){
                        
                        if (err){
                            console.log(err);
                            return (err);
                        } 
            
                        // afficher le resultat de la procedure 
                        else{
                            
                            const proc=JSON.parse(results.recordset[0].F);
                            const values=[]
                            proc.map(item=>{
                                values.push({'F':item})               
                            })
                            res.send(values)
            
                        }
                    });
                }
            })
            
    }
  
})

//affichage des PS et fonction
app.get('/allData/:baseDD', function (req, res) {
    // creation de la requete SQL
    var request = new sql.Request();
    const role=req.roleUser;
    const id= req.userId;
    const bdd=req.params.baseDD;

   // liste des  procedures stockees
   if(role=='admin'){
       request.query(`use ${bdd}`, function(err,results){
           if(err){console.log(err)}
           else{
            request.query(`SELECT SPECIFIC_NAME as P FROM INFORMATION_SCHEMA.ROUTINES WHERE SPECIFIC_CATALOG='${bdd}' AND  ROUTINE_TYPE = 'PROCEDURE' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_') `, function (err, resultats){
                if (err) {
                    console.log(err)
                    return err
                }
    
                // afficher le resultat de la procedure 
                else{
    
                    request.query(`SELECT SPECIFIC_NAME as F FROM INFORMATION_SCHEMA.ROUTINES WHERE  ROUTINE_TYPE = 'function' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_', 'fn_') `, function (err, results){
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
       })
        

   }
   else{
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`SELECT procedures as P from Comptes_Utilisateurs where ID=${id} `, function (err, results){
                
                if (err){
                    console.log(err);
                    return (err);
                } 

                // afficher le resultat de la procedure 
                else{
                        request.query(`SELECT fonctions as F from Comptes_Utilisateurs where ID=${id} `, function (err, resultats){
                            
                            if (err){
                                console.log(err);
                                return (err);
                            } 
                
                            // afficher le resultat de la procedure 
                            else{
                                
                                const proc=JSON.parse(results.recordset[0].P);
                                const fct=JSON.parse(resultats.recordset[0].F)
                                const values=[]
                                proc.map(item=>{
                                    values.push({'P':item})               
                                })

                                fct.map(item=>{
                                    values.push({'F':item})
                                })
                                res.send(values)
                
                            }
                        });
                
                }
            });
        }
    })

   }
    
    
});

// affichage des PS
app.get('/appProcedure/:baseDD', function (req, res) {
        // creation de la requete SQL
        var request = new sql.Request();
        const role=req.roleUser;
        const id= req.userId;
        const bdd=req.params.baseDD;

       // liste des  procedures stockees
        if(role=='admin'){
            request.query(`use ${bdd}`, function(err,results){
               if(err){console.log(err)}
               else{
                request.query(`SELECT SPECIFIC_NAME as P FROM INFORMATION_SCHEMA.ROUTINES WHERE SPECIFIC_CATALOG='${bdd}' AND ROUTINE_TYPE = 'PROCEDURE' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_') `, function (err, results){
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
        }
        else{
            
            request.query(`use APP_WEB_DATA`, function(err,results){
                if(err){console.log(err)}
                else{
                    request.query(`SELECT procedures as P from Comptes_Utilisateurs where ID=${id} `, function (err, results){
                        
                        if (err){
                            console.log('ERROR2',err);
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
            })

       }
        
        
    });
})



//Metadata des procedures stockees

app.get('/page1/:name/:baseDD', function (req, res) {
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

app.get('/page_fct/:name/:baseDD', function (req, res) {
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
     AND LEFT(R.ROUTINE_NAME, 3) NOT IN ( 'fn_')
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
app.post('/set_data_fct/:name/:baseDD', function(req,res){
    var name =req.params.name;
    var baseDD =req.params.baseDD;
    const request=new sql.Request();
    request.input('data', sql.Text, JSON.stringify(req.body))
    
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select * from Parametrage_Interface_Utilisateur where functionName like '${name}'`, function(err, result) {
                if(err){
                    console.log(err);
                    return (err);
                    
                }
                else {
                    if (!result.recordset.length){
                        request.query( `insert into Parametrage_Interface_Utilisateur (functionName,databaseNamefct,functionData) values ( '${name}','${baseDD}', @data)`, function (err){
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
                        request.query(`UPDATE Parametrage_Interface_Utilisateur SET functionName='${name}',databaseNamefct='${baseDD}', functionData=@data 
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
        }
    })


});


//interface user 
app.post('/set_data/:name/:baseDD', function(req,res){
    var name =req.params.name;
    var baseDD =req.params.baseDD;
    const request=new sql.Request();
    request.input('data', sql.Text, JSON.stringify(req.body))
    
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select * from Parametrage_Interface_Utilisateur where procedureName like '${name}'`, function(err, result) {
                if(err){
                    console.log(err);
                    return (err);
                    
                }
                else {
                    if (!result.recordset.length){
                        request.query( `insert into Parametrage_Interface_Utilisateur (procedureName,databaseName,procedureData) values ( '${name}','${baseDD}', @data)`, function (err){
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
                        request.query(`UPDATE Parametrage_Interface_Utilisateur SET procedureName='${name}',databaseName='${baseDD}', procedureData=@data 
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
        }
    })


});

//execution requete de la liste box 
app.get ('/Get_options/:requete/:bdd', function(req, res){
    const request= new sql.Request();
    const requete=req.params.requete;
    const bdd=req.params.bdd;
    const statement=['update','insert','delete','drop','truncate','create','alter','backup']
    const split=requete.split(' ')
    for (let val in statement){
        console.log(statement[val])
        if(split[0].toLowerCase()=== statement[val]){
            res.send('request not allowed')
        }
        else{
            continue;
        }
        
    }

    request.query(`use ${bdd}`, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            request.query(requete, function(err, result){
                if(err){
                    console.log(err);
                }
                else{
                    res.send(result.recordset);
                }
            })
        }
    })
    
})
//affichage interface user graphe parametres procedure
app.get('/Get_values/:proc', function (req,res){
    const request= new sql.Request();
    var proc =req.params.proc;
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select procedureData  from Parametrage_Interface_Utilisateur
                            where procedureName like '${proc}' ` , function(err,values){
                if (err){
                    console.log(err);
                    }
                else{
                    const result= JSON.parse(values.recordset[0].procedureData)
                    res.send(result);
                    }
            });
        }
    })
    
})

//affichage interface user graphe parametres function
app.get('/Get_values_fct/:fct', function (req,res){
    const request= new sql.Request();
    var fct =req.params.fct;
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select functionData  from Parametrage_Interface_Utilisateur
                            where functionName like '${fct}' ` , function(err,values){
                if (err){
                    console.log(err);
                    }
                else{
                    const result= JSON.parse(values.recordset[0].functionData)
                    res.send(result);
                    }
            });
        }
    })
})




//Execution de la procedure stockee (***)
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
   
    request.query(`use ${req.body.bdd}`, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            request.query(query_, function(err, result){
                if(err){
                    console.log(err);
                }
                else{
                    res.send(result.recordset);
                }
            })
        }
    })

    
})

//Inserion des donnees du graphe
app.post('/setGraph/:proc', function(req,res){
    const request=new sql.Request();
    const proc=req.params.proc;
    request.input('dataGraph', sql.Text, JSON.stringify(req.body))
    
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select * from Parametrage_Graphe where procedureName like '${proc}'  `, function(err, result) {
                if(err){
                    console.log(err);
                    return (err);
                    
                }
                else {
                    if (!result.recordset.length){
                        request.query( `insert into Parametrage_Graphe (procedureName, dataGraph) values ('${proc}',@dataGraph)`, function (err){
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
                        request.query(`UPDATE Parametrage_Graphe SET procedureName='${proc}', dataGraph=@dataGraph
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
        }
    })


});


//Execution de la fonction table (***)
app.post('/set_function', function(req,res){
    const request=new sql.Request();
    let query_ = `SELECT * FROM `;
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

    request.query(`use ${req.body.bdd}`, function(err, result){
        if(err){
            console.log(err);
        }
        else{
            request.query(query_, function(err, result){
                if(err){
                    console.log(err);
                }
                else{
                    res.send(result.recordset);
                }
            })
        }
    })

    
})
//envoyer les parametres du graphes
app.post('/setGraphFct/:fct', function(req,res){
    const request=new sql.Request();
    const fct=req.params.fct;
    request.input('dataGraph', sql.Text, JSON.stringify(req.body))
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){
            console.log(err)
        }
        else{
            request.query(`select * from Parametrage_Graphe where functionName like '${fct}'  `, function(err, result) {
                if(err){
                    console.log(err);
                    return (err);
                    
                }
                else {
                    if (!result.recordset.length){
                        request.query( `insert into Parametrage_Graphe (functionName, dataGraphFct) values ('${fct}',@dataGraph)`, function (err){
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
                        request.query(`UPDATE Parametrage_Graphe SET functionName='${fct}', dataGraphFct=@dataGraph
                        where functionName like '${fct}'` , function(err){
                            if (err){
                                console.log(err);
                                return(err);
                            }
                            else {
                                res.send('success, update graph')
                            }

                        })
                    }
                    
                }
            });
        }
    })


});


//get result of graph for procedures
app.get('/getGraph/:name',function(req,res){
    const request= new sql.Request();
    const name=req.params.name;
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select dataGraph from Parametrage_Graphe where procedureName like '${name}' `, function(err,result){
                if(err){
                    console.log(err);
                    return(err);
                }
                else{
                    const resGraph= JSON.parse(result.recordset[0].dataGraph)
                    res.send(resGraph);
                }
            })
        }
    })
})

//get result of graph for functions
app.get('/getGraphFct/:name',function(req,res){
    const request= new sql.Request();
    const name=req.params.name;
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select dataGraphFct from Parametrage_Graphe where functionName like '${name}' `, function(err,result){
                if(err){
                    console.log(err);
                    return(err);
                }
                else{
                    const resGraph= JSON.parse(result.recordset[0].dataGraphFct)
                    res.send(resGraph);
                }
            })
        }
    })
})


//ajouter une procedure
app.post('/AjoutProcedure', function(req,res){
    const request=new sql.Request();
    
    request.input('name', sql.Text, req.body.name)
    request.input('bdd', sql.Text, req.body.bdd)
    request.input('procedure', sql.Text, req.body.procedure)
    
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select * from Creation_Procedure where nom_procedure like @name `, function(err, result) {
                if(err){
                    console.log(err);
                    return (err);
                    
                }
                else {
                    if (!result.recordset.length){
                        request.query( `insert into Creation_Procedure (nom_procedure, bdd, procedure_code) values (@name,@bdd, @procedure)`, function (err){
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
                        request.query(`UPDATE Creation_Procedure  SET nom_procedure=@name,bdd=@bdd, procedure_code=@procedure
                    
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
                    
                    
                }
                
            });
            let query_= 'execute CREATE_PS_FCT_DYNAMIQUE @procedure , @bdd'
                    request.query(query_ , function (err, result){

                        if (err) {console.log(err)}
                        else{
                            console.log('success procedure creation')
                        }
            
            });
        }
    })


});

//ajouter une procedure
app.post('/AjoutFonction', function(req,res){
    const request=new sql.Request();
    
    request.input('name', sql.Text, req.body.name)
    request.input('bdd', sql.Text, req.body.bdd)
    request.input('fonction', sql.Text, req.body.fonction)
    
    request.query(`use APP_WEB_DATA`, function(err,results){
        if(err){console.log(err)}
        else{
            request.query(`select * from Creation_Fonction where nom_fonction like @name `, function(err, result) {
                if(err){
                    console.log(err);
                    return (err);
                    
                }
                else {
                    if (!result.recordset.length){
                        request.query( `insert into Creation_Fonction (nom_fonction, bdd, fonction_code) values (@name,@bdd, @fonction)`, function (err){
                            if (err){
                                console.log(err);
                                return(err);
                            }
                            else {
                                res.send('success, insert fonction')
                            }

                        })
                    }
                    else{
                        request.query(`UPDATE Creation_Fonction  SET nom_fonction=@name,bdd=@bdd, fonction_code=@fonction
                        where nom_fonction like @name  ` , function(err){
                            if (err){
                                console.log(err);
                                return(err);
                            }
                            else {
                                res.send('success, update fonction')
                            }
                        })
                    }    
                }
                
            });
            let query_= 'execute CREATE_PS_FCT_DYNAMIQUE @fonction , @bdd'
                request.query(query_ , function (err, result){
                    if (err) {console.log(err)}
                    else{
                        console.log('success function creation')
                        }
                });
            }
        })


});

app.listen(port,  () => console.log(`server is running app on port ${port}`));
