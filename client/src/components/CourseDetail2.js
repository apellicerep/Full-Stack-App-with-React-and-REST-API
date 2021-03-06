import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'



//Component actions buttons
function ButtonsCRUD({ id, context, history, userOfCourse }) {
    const authenticatedUser = context.authenticatedUser
    console.log(authenticatedUser)


    const handleDelete = async () => {

        if (authenticatedUser) {

            const response = await context.data.api(`/courses/${id}`,
                'DELETE',
                null,
                true,
                {
                    username: authenticatedUser.email,
                    password: authenticatedUser.password
                })
            console.log(response)
            if (response.status === 204) {
                history.push('/')

            } else {
                history.push('/forbidden')
            }
        } else {
            const location = {
                pathname: '/signin',
                state: { from: `/courses/${id}` }
            }
            history.push(location)
        }
    }

    return (
        <div className="actions--bar">
            <div className="bounds">
                <div className="grid-100">
                    <span>
                        {authenticatedUser &&
                            (userOfCourse.emailAddress === authenticatedUser.email) &&
                            <>
                                {/* <Link to={`/courses/${id}/update`}> */}

                                <Link to={`/courses/${id}/update`}><div className="button"  >Update Course </div></Link>
                                <div className="button" onClick={handleDelete}>Delete Course</div>
                            </>
                        }
                    </span>

                    <Link to='/'><div className="button button-secondary">Return to List</div></Link>
                </div>
            </div>
        </div>
    )
}
//recibimos el id del curso que queremos visualizar a través de match es un objeto que nos proporciona el router
export default function CourseDetail({ match, context, history }) {
    const courseIdParam = match.params.id
    let [{ course, loading }, setCourse] = useState({ loading: true, course: {} })
    //let [userOfCourse, setUserOfCourse] = useState(null)
    //console.log(loading)


    useEffect(() => {
        fetch(`http://localhost:5000/api/courses/${courseIdParam}`) //pedimos api por los detalles de la peli sacamos el id con el router que nos lo pasa por props.
            .then((response) => {
                console.log(response)
                if (response.status === 404) { //error 404 no se considera como error en fetch por lo que tienes que code status te ha dade el response.
                    return history.push('/notFound')
                } else {
                    response.json().then((data) => {
                        console.log(data)
                        setCourse({ loading: false, course: data.courseId }) //actualizamos el state.
                        //setUserOfCourse(data.User)

                    }).catch((error) => {
                        console.error(error);
                        history.push('/error');
                    });
                }
            })

    }, [courseIdParam, history])

    //Function to create List from *Materials
    function convertMaterialsNeeded() {
        let jsxListMaterials = ""
        if (course.materialsNeeded == null) {
            return jsxListMaterials = null;
        }

        let test = course.materialsNeeded.split("*").slice(1)
        //al estar en Jsx tienes que pasarle un array de elementos sin strings.
        jsxListMaterials = test.map((item, index) => <li key={index}>{item}</li>)
        return jsxListMaterials
    }
    //Function to create paragraphs from "\n\n"
    function convertDescription() {
        let test2 = course.description.split("\n\n")
        const jsxDescription = test2.map((paragraph, index) => <p key={index}>{paragraph}</p>)
        return jsxDescription
    }



    return (
        <>

            {(loading) ? <h1>Loading</h1> :
                <>
                    <ButtonsCRUD id={courseIdParam} userOfCourse={course.User} context={context} history={history} />
                    <div className="bounds course--detail">
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <h3 className="course--title">{course.title}</h3>
                                <p>{`${course.User.firstName} ${course.User.lastName}`}</p>
                            </div>
                            <div className="course--description">

                                {convertDescription()}
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <h3>{course.estimatedTime}</h3>
                                    </li>
                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <ul>
                                            {convertMaterialsNeeded()}
                                        </ul>

                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>}
        </>

    )
}