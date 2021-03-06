import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom';

import Header from './components/Header';
import Courses from './components/Courses';
//import CourseDetail from './Components/CourseDetail';
import CourseDetail2 from './components/CourseDetail2';
import CourseUpdate from './components/CourseUpdate';
import NotFound from './components/NotFound';
import UserSignUp from './components/UserSignUp';
import UserSignIn from './components/UserSignIn';
import UserSignOut from './components/UserSignOut';
// import Authenticated from './Components/Authenticated';
import CreateCourse from './components/CreateCourse';
import Forbidden from './components/Forbidden';
import UnhandledError from './components/UnhandledError'

import withContext from './Context';
import PrivateRoute from './PrivateRoute';

//Nos subscribimos al context y sus posibles cambios. por ejemplo en el context tenemo el user autenticado por ejemplo las
//funciones que necesiten consumir este dato como las llamadas a la api que necesiten la cabecera auth.

const HeaderWithContext = withContext(Header);
// const AuthWithContext = withContext(Authenticated);
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
        {/* <PrivateRoute path="/authenticated" component={AuthWithContext} /> */}
        <Route path="/signin" component={UserSignInWithContext} />
        <Route path="/signup" component={UserSignUpWithContext} />
        <Route path="/signout" component={UserSignOutWithContext} />
        <Route exact path="/forbidden" component={Forbidden} />
        <Route exact path="/error" component={UnhandledError} />
        <Route component={NotFound} />
        {/* si no encuentra ninguna ruta se renderiza el NotFound */}
      </Switch>
    </div>
  </Router>
);