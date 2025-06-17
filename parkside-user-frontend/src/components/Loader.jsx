import { useEffect, useState, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import './Loader.css'

const Loader = () => {
    const [loading, setLoading] = useState(true) // Start with loading true
    const location = useLocation()

    // Use layout effect for immediate UI updates before browser painting
    useLayoutEffect(() => {
        // Force loader to show immediately on route change
        setLoading(true)

        // Add a class to the body to indicate loading
        document.body.classList.add('page-loading')

        // Prevent scroll during loading
        document.body.style.overflow = 'hidden'

        // This ensures the loader is visible for navigation
        return () => {
            // Clean up when unmounting or before next effect run
            document.body.style.overflow = ''
        }
    }, [location])

    // Use regular effect for the delayed hiding of the loader
    useEffect(() => {
        // Keep the loader visible for 2.5 seconds
        const timer = setTimeout(() => {
            setLoading(false)
            document.body.classList.remove('page-loading')
            document.body.style.overflow = ''
        }, 2500) // Show loader for 2.5 seconds

        return () => {
            clearTimeout(timer)
        }
    }, [location])

    return (
        <div className={`loader-wrap ${loading ? 'visible' : 'vissza'}`}>
            <div className="loader-item">
                <div className="cd-loader-layer" data-frame="25">
                    <div className="loader-layer"></div>
                </div>
                <span className="loader"><i className="fa-thin fa-gem"></i></span>
            </div>
        </div>
    )
}

export default Loader 