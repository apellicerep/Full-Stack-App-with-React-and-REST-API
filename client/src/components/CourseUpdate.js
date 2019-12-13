import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ErrorsDisplay from './ErrorsDisplay'

export default function CourseUpdate({ match, context, history }) {

    const courseIdParam = match.params.id
    const authenticatedUser = context.authenticatedUser
    let [course, setCourse] = useState({})
    let [loading, setLoading] = useState(true)
    let [errors, setErrors] = useState(null)



    const handleChange = (e) => {
        setCourse({
            ...course,
            [e.target.name]: e.target.value
        }
        )
    }

    const handleUpdate = async (e) => {
        e.preventDefault()
        const body = {
            title: course.title,
            description: course.description,
            estimatedTime: course.estimatedTime,
            materialsNeeded: course.materialsNeeded
        }
        console.log(authenticatedUser.email)
        try {
            const response = await context.data.api(`/courses/${courseIdParam}`,
                'PUT',
                body,
                true,
                {
                    username: authenticatedUser.email,
                    password: authenticatedUser.password

                })

            if (response.status === 400) {
                const data = await response.json()
                setErrors(errors = data.message)
            } else if (response.status === 404) {
                history.push('/notFound')
            } else {
                history.push(`/courses/${courseIdParam}`); //una vez actualizado el libro redirecciono a los detalles.
            }
        } catch (e) {
            console.error(e)
            history.push('/error');
        }

    }

    const fetchCourseId = async () => {

        const response = await context.data.api(`/courses/${courseIdParam}`,
            'GET',
            null,
            false
        )
        try {
            const data = await response.json()
            console.log(data.courseId.User.emailAddress)
            if (data.courseId.User.emailAddress === authenticatedUser.email) {
                const { title, description, estimatedTime, materialsNeeded, User: { firstName, lastName } } = data.courseId //destructuring info api.
                setCourse({ title, description, estimatedTime, materialsNeeded, firstName, lastName })
                setLoading(false)
            } else {
                history.push('/forbidden')
            }

        } catch (e) {
            console.error(e)
            history.push('/error');
        }
    }


    useEffect(() => {
        fetchCourseId()

    }, [])



    return (
        <div className="bounds course--detail">

            {(loading) ? <h4>Loading</h4> :
                <>
                    <h1>Update Course</h1>
                    <div>
                        {errors && <ErrorsDisplay errors={errors} />}
                        <form onSubmit={handleUpdate}>
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
                                <button className="button" type="submit">Update Course</button>
                                <Link to={`/courses/${courseIdParam}`}><button className="button button-secondary" >Cancel</button></Link>
                            </div>
                        </form>
                    </div>
                </>}
        </div >)
}