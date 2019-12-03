import React, { useState, useEffect } from 'react'
import ErrorsDisplay from './ErrorsDisplay.js'
import { Link } from 'react-router-dom'

export default function CourseUpdate({ match, context, history }) {
    //console.log(context.authenticatedUser.email)

    let [course, setCourse] = useState({ title: "", description: "", estimatedTime: "", materialsNeeded: "", firstName: "", lastName: "" })
    // let [loading, setLoading] = useState(true)
    let [errors, setErrors] = useState(null) //poner null va bien cuando hacemos conditional rendering.

    const handleChange = (e) => {
        setCourse({
            ...course, //no poodemos hacer como antes en el state de las clases, tenemos que copiar el state y despues sobrescribir el atributo que queramos cambiar.r
            [e.target.name]: e.target.value //hacemos merge de los valores de los input.
        }
        )
    }

    const handleCreate = (e) => {
        e.preventDefault()
        const body = course
        //console.log(context.authenticatedUser.email)
        context.data.api(`/courses`,
            'POST',
            body,
            true,
            {
                username: context.authenticatedUser.email,
                password: context.authenticatedUser.password
            }).then((response) => {
                if (response.status === 201) {
                    let location;
                    //quiero obtener el location que recibo de la ruta.
                    response.headers.forEach((i, key) => {
                        console.log(key)
                        if (key === 'location') {
                            location = i;
                        }
                    })
                    return history.push(location) //redirecciono al curso que acabo de crear
                }

                response.json().then((data) => {
                    if (data.message) {
                        setErrors(errors = data.message)
                    }
                })
            }).catch((error) => {
                console.error(error);
                history.push('/error');
            });

    }

    return (
        <div className="bounds course--detail">
            <>
                <h1>Create Course</h1>
                {errors && <ErrorsDisplay errors={errors} />}
                <div>
                    <form onSubmit={handleCreate}>
                        <div className="grid-66">
                            <div className="course--header">
                                <h4 className="course--label">Course</h4>
                                <div>
                                    <input id="title" name="title" type="text" className="input-title course--title--input" placeholder="Course title..."
                                        value={course.title} onChange={handleChange} />
                                </div>
                                <p>{`${course.firstName} ${course.lastName}`}</p>
                            </div>
                            <div className="course--description">
                                <div><textarea id="description" name="description" className="" value={course.description} onChange={handleChange} placeholder="Course description..."></textarea></div>
                            </div>
                        </div>
                        <div className="grid-25 grid-right">
                            <div className="course--stats">
                                <ul className="course--stats--list">
                                    <li className="course--stats--list--item">
                                        <h4>Estimated Time</h4>
                                        <div>
                                            <input id="estimatedTime" name="estimatedTime" type="text" className="course--time--input"
                                                placeholder="Hours" onChange={handleChange} value={course.estimatedTime} />
                                        </div>
                                    </li>

                                    <li className="course--stats--list--item">
                                        <h4>Materials Needed</h4>
                                        <div><textarea id="materialsNeeded" onChange={handleChange} value={course.materialsNeeded} name="materialsNeeded" className="" placeholder="List materials..."></textarea></div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="grid-100 pad-bottom">
                            <button className="button" type="submit">Create Course</button>
                            <Link to='/'><button className="button button-secondary" >Cancel</button></Link>
                        </div>
                    </form>
                </div>
            </>
        </div>)
}
