import {NavLink, routes} from '@redwoodjs/router'

type WrapperLayoutProps = {
  children?: React.ReactNode
}

const WrapperLayout = ({ children }: WrapperLayoutProps) => {
  return <>
  <header><nav><ul>
    <li><NavLink to={routes.home()} activeClassName="active">Home</NavLink></li>
    </ul></nav></header>
  {children}
  </>
}

export default WrapperLayout
