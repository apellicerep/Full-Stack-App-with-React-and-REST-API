import React, { useState, useEffect } from 'react'

import { Link } from 'react-router-dom'



function CourseItem({ title, id }) {
    //console.log(id)
    return (

        < div className="grid-33">
            <Link to={`/courses/${id}`}><div className="course--module course--link">
                <h4 className="course--label">Course</h4>
                <h3 className="course--title">{title}</h3>
            </div></Link>
        </div >
    )
}


export default function Courses() {
    //let [loading, setLoading] = useState(true)
    let [{ loading, courses }, setCourses] = useState({ loading: true, courses: [] })


    //Por cada invocaion del useState se se renderizará el componente y el componente recibe props i estos cambian
    //tambien renderizará el componente. 
    //-primer render cuando monta el Componente
    //-cuando hacemos el set de courses 
    //-cuando hacemos el set de loading pero... (HE PUESTO EL LOADING I COURSES EN UN MIMSO STATE así solo se renderiza 2 en vez de 3)
    useEffect(() => {
        fetch('http://localhost:5000/api/courses')
            .then((response) => response.json())
            .then((data) => {
                setCourses({ loading: false, courses: data.courses })
                //setLoading(loading = false)

            })
    }, [])

    //useEffect nos permite replicar 3 lifecycle methods: 1.componentDidMount(), 2.componentDidUpdate, 3.componentWillMount
    //cuando se ejecuta useEffect?:
    //1- siempre se ejecutará cuando se monte por primera vez el componente.
    //2-y también se ejecutará siempre que se re-renderize el componente si no le pasamos el segundo parametro.
    //3-y tambien se ejecutará solo la primera vez que se monte el componente si ponemos como parametro [].
    //4-y Se ejecutará también cuanod se actualize el state o props que le pasemos al array como segundo parametro.


    return (
        <div className="bounds">
            {console.log("hola")}
            {(loading) ? <h1>Loading....</h1> :
                courses.map((course) =>
                    <CourseItem id={course.id} title={course.title} key={course.id} />)
            }
            <div className="grid-33">
                <Link to='/courses/create'><div className="course--module course--add--module">
                    <h3 className="course--add--title"><svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                        viewBox="0 0 13 13" className="add">
                        <polygon points="7,6 7,0 6,0 6,6 0,6 0,7 6,7 6,13 7,13 7,7 13,7 13,6 "></polygon>
                    </svg>New Course</h3>
                </div></Link>
            </div>

        </div >
    )
}