

const CreateUploadPage = (csrf) => {
    ClearBody();

    ReactDOM.render(
        <UploadForm csrf={csrf} />,
        document.querySelector("#content")
    );
};

const handleImageForm = (e) => {
    e.preventDefault();

    if ($("#file").val() == '' || $("#uploadTag").val() == '' || $("#uploadTitle").val() == '') {
        handleError("error missing fields");
        return false;
    }

    $("#uploadForm").ajaxSubmit({

        error: function (xhr) {
            handleError(xhr.status);
        },

        success: function (response) {
            redirect(response);
        }

    });
    return false;
};

const UploadForm = (props) => {
    let actionURL = `/uploadImage?_csrf=#${props.csrf}`;
    return (
        <div>
            <form
                id="uploadForm"
                name="uploadForm"
                action={actionURL}
                method="POST"
                enctype="multipart/form-data"
                className="mainForm ui form centered card"
                onSubmit={handleImageForm}>
                <div className="content">
                    <div className="field">
                        <label for="title" className="uploadFormField" htmlFor="title"> Title </label>
                        <input type="text" id="uploadTitle" name="title" placeholder="something cool..." />
                    </div>
                </div>
                <div className="content">
                    <div className="field">
                        <label for="tag" className="uploadFormField" htmlFor="tag"> Tag </label>
                        <input type="text" id="uploadTag" name="tag" placeholder="scenic rit memes" />
                    </div>
                </div>
                <div className="content">
                    <div className="ui toggle checkbox">
                        <input type="checkbox" name="public"></input>
                        <label>Public</label>
                    </div>
                </div>
                <div className="content">
                    <div className="field">
                        <label for="file" className="uploadFormField">Choose File</label>
                        <input type="file" name="file" id="file" className="" onChange={readImageURL} />
                    </div>
                </div>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <div className="extra content">
                    <input type="submit" value="Upload" className="ui button formSubmit" />
                </div>
                <div class="ui error message"></div>
            </form>
        </div>
    );
};

const readImageURL = (input) => {
    if (input.target.files && input.target.files[0]) {
        let reader = new FileReader();

        reader.onload = function (e) {
            e.preventDefault();
            ReactDOM.render(
                <BuildImagePreview imageURI={e.target.result} />,
                document.querySelector("#imagePreview")
            );
        };

        reader.readAsDataURL(input.target.files[0]);
    }
};


const BuildImagePreview = (props) => {
    let imageURI = props.imageURI;
    if (imageURI !== null && imageURI !== undefined) {
        return (
            <div className="ui card centered">
                <div className="ui medium rounded image">
                    <img className="thumbnail" src={imageURI}></img>
                </div>
            </div>
        );
    }
    return (
        <div>No picture</div>
    );
};