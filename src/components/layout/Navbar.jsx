import { NavLink } from 'react-router-dom'

function Navbar() {
    return (
        <div className="navbar bg-[#00AEEF] text-white p-2">
            <div className="navbar-start">
                <a className="text-xl font-bold">HV CN BCVT</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Trang chủ</NavLink></li>
                    <li><NavLink to="/user" className={({ isActive }) => isActive ? "active" : ""}>Thông tin</NavLink></li>
                </ul>
            </div>
            <div className="navbar-end">
                <button className="btn btn-ghost">Đăng xuất</button>
            </div>
        </div>
    )
}

export default Navbar