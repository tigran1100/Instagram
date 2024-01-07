// Css
import "../css/404.css"

const Page_404 = () => {

    return (
        <>
            <div className="page-404">
                <div className="page-404-noise"></div>
                <div className="page-404-overlay"></div>
                <div className="page-404-terminal">
                    <h1>Error <span className="404-errorcode">404</span></h1>
                    <p className="page-404-output">The page you are looking for might have been removed, had its name changed or is temporarily unavailable.</p>
                    <p className="page-404-output">Please try to <a href="/">go back</a>.</p>
                    <p className="page-404-output">Good luck.</p>
                </div>
            </div>
        </>
    )
}

export default Page_404