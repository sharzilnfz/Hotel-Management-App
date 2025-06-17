import { Link } from 'react-router-dom'
import { useEffect } from 'react'

const Rooms2 = () => {
    useEffect(() => {
        // Set background images
        const bgElements = document.querySelectorAll('[data-bg]')
        bgElements.forEach(element => {
            const bgImage = element.getAttribute('data-bg')
            element.style.backgroundImage = `url(${bgImage})`
        })
    }, [])

    return (
        <div className="content">
            <div className="breadcrumbs-wrap">
                <div className="container">
                    <Link to="/">Home</Link><span>Rooms Style 2</span>
                </div>
            </div>
            <div className="content-section">
                <div className="container">
                    <div className="section-title">
                        <h2>Rooms Style 2</h2>
                        <p>This page will display rooms in the second style variant</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Rooms2 