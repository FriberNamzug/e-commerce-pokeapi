import NavbarComponent from './NavbarComponent'
import FooterComponent from './FooterComponent'
import { Outlet } from 'react-router'

export default function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <header>
                <NavbarComponent />
            </header>
            <main id="main-content" className="flex-grow">
                <Outlet />
            </main>
            <FooterComponent />
        </div>
    )
}
