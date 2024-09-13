export default function Footer() {
    return (
        <footer className="footer d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <p className="mb-0 text-body-secondary">© 2024 Company, Inc</p>
                    </div>
                    <div className="col">
                        <a href="/" className="d-flex align-items-center justify-content-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
                            <img src="./favicon.ico" alt="Logo" height="40px" width="40px" />
                        </a>
                    </div>
                    <div className="col">
                        <ul className="nav justify-content-end">
                            <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">首页</a></li>
                            <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">反馈</a></li>
                            <li className="nav-item"><a href="/" className="nav-link px-2 text-body-secondary">关于</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>
    );
}
