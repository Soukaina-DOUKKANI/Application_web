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

            request.query(`select * from Users where ID=@id   `, function(err, result) {
                if(err){
                    console.log(err);
                    return (err);
                    
                }
                else {
                    if (!result.recordset.length){
                        request.query( `insert into Users (  nom_utilisateur, identifiant, pwd, hash, role) values ( @utilisateur, @identifiant, @pwd, @hash, 'user')`, function (err, insert){
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
                        request.query(`UPDATE Users SET nom_utilisateur=@utilisateur, identifiant=@identifiant, pwd=@pwd, hash=@hash,  role='user'
                        where ID=@id ` , function(err, update){
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
                        const {id, role}= result.recordset[0];
                        const token= jwt.sign({id , role}, "jwtSecret", {expiresIn: 60*60*4})
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

// affichage des metadata des PS
app.get('/app', function (req, res) {
        // creation de la requete SQL
        var request = new sql.Request();
        const role=req.roleUser;
        const id= req.userId;
       // liste des  procedures stockees
       if(role=='admin'){
            request.query("SELECT SPECIFIC_NAME as P FROM GI_BVC_DTM.INFORMATION_SCHEMA.ROUTINES WHERE ROUTINE_TYPE = 'PROCEDURE' AND LEFT(ROUTINE_NAME, 3) NOT IN ('sp_', 'xp_', 'ms_') ", function (err, results){
                if (err) console.log(err)

                // afficher le resultat de la procedure 
                res.send(results.recordset);
            });

       }
       else{
        request.query("SELECT SPECIFIC_NAME as P FROM GI_BVC_DTM.INFORMATION_SCHEMA.ROUTINES WHERE  SPECIFIC_NAME='Get_MASI_VOLUME_QUOTIDIEN' ", function (err, results){
            if (err) console.log(err)

            // afficher le resultat de la procedure 
            res.send(results.recordset);
        });

       }
        
        
    });
});

//liste des procedures stockees

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

//interface user 
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

//affichage interface user
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

app.listen(port,  () => console.log(`server is running app on port ${port}`));
