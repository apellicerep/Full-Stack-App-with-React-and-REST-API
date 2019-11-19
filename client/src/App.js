import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './Components/Header';
import Courses from './Components/Courses';
//import CourseDetail from './Components/CourseDetail';
import CourseDetail2 from './Components/CourseDetail2';
import CourseUpdate from './Components/CourseUpdate';
import NotFound from './Components/NotFound';
import UserSignUp from './Components/UserSignUp';
import UserSignIn from './Components/UserSignIn';
import UserSignOut from './Components/UserSignOut';
import Authenticated from './Components/Authenticated';
import CreateCourse from './Components/CreateCourse';
import Forbidden from './Components/Forbidden';
import UnhandledError from './Components/UnhandledError'

import withContext from './Context';
import PrivateRoute from './PrivateRoute';

//Nos subscribimos al context y sus posibles cambios. por ejemplo en el context tenemo el user autenticado por ejemplo las
//funciones que necesiten consumir este dato como las llamadas a la api que necesiten la cabecera auth.

const HeaderWithContext = withContext(Header);
const AuthWithContext = withContext(Authenticated);
const UserSignUpWithContext = withContext(UserSignUp);
const UserSignInWithContext = withContext(UserSignIn);
const UserSignOutWithContext = withContext(UserSignOut);
const CourseUpdateWithContext = withContext(CourseUpdate);
//const CourseDetailWithContext = withContext(CourseDetail);
const CourseDetailWithContext = withContext(CourseDetail2); //!!!!cambiado por CourseDetail
const CreateCourseWithContext = withContext(CreateCourse);

export default () => (
  <Router>
    <div>
      <HeaderWithContext />
      {/* Renderizamos los componentes que consumen del Context, cuando REact renderize un componente que este suscrito al 
      context, leera el context value que le pasa el Provider*/}
      <Switch>
        <Route exact path="/" component={Courses} />
        <PrivateRoute exact path="/courses/create" component={CreateCourseWithContext} />
        <Route exact path="/courses/:id" component={CourseDetailWithContext} />
        <PrivateRoute exact path="/courses/:id/update" component={CourseUpdateWithContext} />
        {/* <PrivateRoute exact path="/courses/:id/update" component={CourseUpdate} /> */}
        <PrivateRoute path="/authenticated" component={AuthWithContext} />
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route exact path="/forbidden" component={Forbidden} />
        <Route component={NotFound} />
        {/* si no encuentra ninguna ruta se renderiza el NotFound */}
      </Switch>
    </div>
  </Router>
);