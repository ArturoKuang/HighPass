const UpdateImageForm = (props) => {
    return (
        <div>
            <form
                id="updateImageForm"
                name="updateImage"
                action='/updateImage'
                method="POST"
                className="mainForm ui form centered card"
                onSubmit={handleUpdateImageForm}>
                <div className="content">
                    <div className="field">
                        <label for="title" className="updateImageField" htmlFor="title"> Title </label>
                        <input type="text" id="uploadTitle" name="title" placeholder="something cool..." />
                    </div>
                </div>
                <div className="content">
                    <div className="field">
                        <label for="tag" className="updateImageField" htmlFor="tag"> Tag </label>
                        <input type="text" id="uploadTag" name="tag" placeholder="wow amazing rit" />
                    </div>
                </div>
                <div className="content">
                    <div className="ui toggle checkbox">
                        <input type="checkbox" id="publicImageCheckBox" name="public"></input>
                        <label>Public</label>
                    </div>
                </div>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <input type="hidden" name="url" value={props.fileUrl} />
                <div className="extra content">
                    <input type="submit" value="Update" className="ui button formSubmit" />
                </div>
                <div class="ui error message"></div>
            </form>
        </div>
    );
};

const handleUpdateImageForm = (e) => {
    e.preventDefault();

    if($("#uploadTag")[0].value === '' || $("#uploadTitle")[0].value === ''){
        handleError("Empty tag and title");
        return false;
    }

    $("#updateImageForm").ajaxSubmit({

        error: function (xhr) {
            handleError(xhr.status);
        },

        success: function (response) {
            redirect(response);
        }

    });
    return false;
};

const EditPage = (props) => {
    return (
        <div>
            <BuildImagePreview imageURI={props.filePath}/>
            <UpdateImageForm fileUrl={props.filePath}/>
        </div>
    );
};

const CreateEditPage = (filePath) => {
    ReactDOM.render(
        <EditPage filePath={filePath} />,
          document.querySelector('#content')
      );    
};

const handleEdit = (e) => {
    e.preventDefault();
    const filePath = e.target.parentElement.parentNode.querySelector("#imageDisplay").src;

    ClearBody();
    CreateEditPage(filePath);
};

