import { Router, Route, Set } from '@redwoodjs/router'

const Routes = () => {
    return (
        <Router>
            <Route path="/" page={HomePage} name="home" />
        </Router>
    )
}

export default Routes
