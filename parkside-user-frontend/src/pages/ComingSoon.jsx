import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

const ComingSoon = () => {
    const [days, setDays] = useState(0)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [seconds, setSeconds] = useState(0)

    useEffect(() => {
        // Set background images
        const bgElements = document.querySelectorAll('[data-bg]')
        bgElements.forEach(element => {
            const bgImage = element.getAttribute('data-bg')
            element.style.backgroundImage = `url(${bgImage})`
        })

        // Setup countdown
        const targetDate = new Date()
        targetDate.setDate(targetDate.getDate() + 30) // 30 days from now

        const interval = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate - now

            setDays(Math.floor(distance / (1000 * 60 * 60 * 24)))
            setHours(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
            setMinutes(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)))
            setSeconds(Math.floor((distance % (1000 * 60)) / 1000))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="coming-soon-wrapper">
            <div className="hero-bg">
                <div className="bg" data-bg="/src/assets/images/bg/1.jpg"></div>
                <div className="overlay overlay-dark"></div>
            </div>
            <div className="container">
                <div className="coming-soon-content">
                    <div className="coming-soon-logo">
                        <img src="/src/assets/images/logo.png" alt="Parkside Hotel" />
                    </div>
                    <div className="section-title coming-soon-title">
                        <h2>Coming Soon</h2>
                        <p>Our website is under construction, we are working hard to give you the best experience.</p>
                        <div className="section-separator sect_se_transparent"><span><i className="fa-thin fa-gem"></i></span></div>
                    </div>
                    <div className="countdown-container">
                        <div className="countdown-item">
                            <span className="days">{days}</span>
                            <p>Days</p>
                        </div>
                        <div className="countdown-item">
                            <span className="hours">{hours}</span>
                            <p>Hours</p>
                        </div>
                        <div className="countdown-item">
                            <span className="minutes">{minutes}</span>
                            <p>Minutes</p>
                        </div>
                        <div className="countdown-item">
                            <span className="seconds">{seconds}</span>
                            <p>Seconds</p>
                        </div>
                    </div>
                    <div className="coming-soon-subscribe">
                        <h4>Subscribe to get notified</h4>
                        <form className="cs-form">
                            <input type="text" placeholder="Your Email" />
                            <button type="submit" className="btn float-btn color-bg">Submit</button>
                        </form>
                    </div>
                    <div className="coming-soon-social">
                        <ul>
                            <li><a href="#" target="_blank"><i className="fa-brands fa-facebook-f"></i></a></li>
                            <li><a href="#" target="_blank"><i className="fa-brands fa-x-twitter"></i></a></li>
                            <li><a href="#" target="_blank"><i className="fa-brands fa-instagram"></i></a></li>
                            <li><a href="#" target="_blank"><i className="fa-brands fa-tiktok"></i></a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ComingSoon 