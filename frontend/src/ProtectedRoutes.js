import React from 'react'
import Permissions from './Permissions';
import {Redirect, Route} from 'react-router-dom';

export default function ProtectedRoutes({component: Component,role, ...rest}){
    
    return(
        <>
        {Permissions(role) && (
            <Route
            {...rest}
            render={(props) => (
              <>
                <Component {...props} />
              </>
            )}
          />
        )}

        {!Permissions(role) && (
          <Route
            render={() => (
              <>
                <Redirect to='/' /> 
              </>
            )}
          />
        )
        }

       </> 
    )



    
}