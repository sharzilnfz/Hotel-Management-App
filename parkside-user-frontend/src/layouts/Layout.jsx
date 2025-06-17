import { Outlet } from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useEffect } from 'react'

const Layout = () => {
    useEffect(() => {
        // Load external scripts after component mounts
        const loadScripts = async () => {
            try {
                // First load jQuery
                const jqueryScript = document.createElement('script')
                jqueryScript.src = '/src/assets/js/jquery.min.js'
                jqueryScript.async = true
                document.body.appendChild(jqueryScript)

                // Wait for jQuery to load
                await new Promise((resolve) => {
                    jqueryScript.onload = resolve
                })

                // Then load plugins
                const pluginsScript = document.createElement('script')
                pluginsScript.src = '/src/assets/js/plugins.js'
                pluginsScript.async = true
                document.body.appendChild(pluginsScript)

                // Wait for plugins to load
                await new Promise((resolve) => {
                    pluginsScript.onload = resolve
                })

                // Finally load main scripts
                const scriptsScript = document.createElement('script')
                scriptsScript.src = '/src/assets/js/scripts.js'
                scriptsScript.async = true
                document.body.appendChild(scriptsScript)
            } catch (error) {
                console.error("Error loading scripts:", error)
            }
        }

        loadScripts()

        // Cleanup function to remove scripts when component unmounts
        return () => {
            const scripts = document.querySelectorAll('script[src^="/src/assets/js/"]')
            scripts.forEach(script => {
                document.body.removeChild(script)
            })
        }
    }, [])

    return (
        <div id="main">
            <Header />
            <Outlet />
            <Footer />
        </div>
    )
}

export default Layout 