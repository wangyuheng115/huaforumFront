export default function NewButton() {
        const openNewArticlePage = () => {
            window.open('#/newarticle', '_blank');
        }
        return (
            <div className="row z-3 position-fixed bottom-0 end-0 m-5">
                <div className="col">
                    <div title="发布文章" id="NewArticle" className="btn btn-danger position-relative" style={{ borderRadius: "50%", width: "55px", height: "55px" }} onClick={openNewArticlePage}><h4 className="text-white position-absolute top-50 start-50 translate-middle"><i className="bi bi-file-earmark-richtext"></i></h4></div>
                </div>
                <div className="col">
                    <div id="NewButton" className="btn btn-danger position-relative" data-bs-toggle="button" style={{ borderRadius: "50%", width: "60px", height: "60px" }}><h3 className="text-white position-absolute top-50 start-50 translate-middle"><i className="bi bi-plus-circle "></i></h3></div>
                </div>
            </div>
        );
    }
