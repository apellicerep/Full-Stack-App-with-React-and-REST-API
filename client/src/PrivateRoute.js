import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Consumer } from './Context';

export default ({ component: Component, ...rest }) => {
  return (
    <Consumer>
      {context => ( //con render props consumo el value del context
        <Route
          {...rest}
          render={props => context.authenticatedUser ? (
            <Component {...props} />
          ) : (
              <Redirect to={{ //para acceder a la ruta primero tendran que loaguearse, una vez loagueados les redireccionará
                //direccion que pongamos como from. en el signin cogeremos esta dire y lo redireccionaremos de donde venía.
                pathname: '/signin',
                state: { from: props.location }
              }} />
            )
          }
        />
      )}
    </Consumer>
  );
};