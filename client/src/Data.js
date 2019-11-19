import config from './config';

export default class Data {
  //metodo generico que utilizaré para consultar la api.
  api(path, method = 'GET', body = null, requiresAuth = false, credentials = null) {
    const url = config.apiBaseUrl + path;

    const options = {
      method,
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
    };

    if (body !== null) {
      options.body = JSON.stringify(body);
    }
    // si la ruta a la api tiene que estar authenticada lo que haremos es codificar username y password.
    if (requiresAuth) {
      console.log(credentials.username)
      const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
      options.headers['Authorization'] = `Basic ${encodedCredentials}`; //añadimos la propiedad authorization en el header object, propiedad 
      //authorization tendra la credenciales para autenticar al user.
    }
    return fetch(url, options);
  }

  //metodo que utiliza api() para llamar a /api/users para consultar si el mail existe en la base de datos, si es que si
  //te devuelve el nombre y el apellido para ponerlo en el state del context como cookie. para mantener la session.
  async getUser(username, password) {
    const response = await this.api(`/users`, 'GET', null, true, { username, password });
    if (response.status === 200) {
      return response.json().then(data => data);
    }
    else if (response.status === 401) {
      const data = await response.json()
      return data.message; //cojo los errores de validación
    }
    else {
      throw new Error();
    }
  }

  async createUser(user) {
    const response = await this.api('/users', 'POST', user);
    if (response.status === 201) {
      return [];
    }
    else if (response.status === 400) {
      return response.json().then(data => {
        console.log(data)
        // return data.errors;
        return data.message;
      });
    }
    else {
      throw new Error();
    }
  }
}