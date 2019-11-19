import React, { Component } from 'react';
import Cookies from 'js-cookie';
import Data from './Data';

//Creamos context que servirà para compartir el state en toda nuestra app sin tener que pasarlo por props.
const Context = React.createContext();


//La clase Provider es un HOC que returns a Provider componente el cual provee a toda la app del state y cualquier acciones o 
//event handlers que tienen que ser compartidas por los componentes via el requerido value prop.
//Todo lo que pongamos dentro de este componente sera compartido
export class Provider extends Component {

  state = {
    authenticatedUser: Cookies.getJSON('authenticatedUser') || null
  };

  constructor() {
    super();
    this.data = new Data(); //creamos una nueva instancia de Data para poder utilizar sus metodos.
  }

  render() {
    const { authenticatedUser } = this.state;
    const value = {
      authenticatedUser,
      data: this.data,
      actions: {
        signIn: this.signIn,
        signOut: this.signOut
      },
    };
    return (
      //este es el Provider component que englobará al resto de componentes i le pasara el state a través de value prop.
      <Context.Provider value={value}>
        {/* esto representa todos los componentes children que engloba el Provider */}
        {this.props.children}
      </Context.Provider>
    );
  }


  signIn = async (username, password) => {
    const user = await this.data.getUser(username, password);
    if (!Array.isArray(user)) { //if (user !== null) {
      this.setState(() => {
        console.log(user)
        user.password = password //añado password al authenticatedUser para poderlo enviar en futuras peticiones a la api.
        return {
          //user.password = password,
          authenticatedUser: user,
        };
      });
      const cookieOptions = {
        expires: 1 // 1 day
      };
      console.log(user)
      Cookies.set('authenticatedUser', JSON.stringify(user), cookieOptions);
    }
    return user;
  }

  signOut = () => {
    this.setState({ authenticatedUser: null });
    Cookies.remove('authenticatedUser');
  }
}

//crearemos el consumer y crearemos una función donde le pasaremos un componente para "subscribirlo" al context y quede
//englobado por el Consumer component.
export const Consumer = Context.Consumer;

/**
 * A higher-order component that wraps the provided component in a Context Consumer component.
 * @param {class} Component - A React component.
 * @returns {function} A higher-order component.
 */

export default function withContext(Component) {
  return function ContextComponent(props) {
    return (
      <Context.Consumer>
        {context => <Component {...props} context={context} />}
      </Context.Consumer>
    );
  }
}
