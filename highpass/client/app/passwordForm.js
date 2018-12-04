

const handlePasswordForm = (e) => {
    e.preventDefault();

    if ($("#pass").val() == '' || $("#pass2").val() == '') {
        handleError("All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#passwordForm").attr("action"), $("#passwordForm").serialize(), handleSuccess);

    return false;
}

const PasswordForm = (props) => {
    return (
        <div>
            <form
                id="passwordForm"
                name="passwordForm"
                action="/changePassword"
                method="POST"
                className="mainForm ui form centered card"
                onSubmit={handlePasswordForm}>
                 <div className="content">
                    <div className="field">
                        <label for="title" className="passwordFormField" htmlFor="title"> Current Password: </label>
                        <input type="password" id="oldpassword" name="oldpassword" placeholder="Current Password" />
                    </div>
                </div>
                <div className="content">
                    <div className="field">
                        <label for="title" className="passwordFormField" htmlFor="title"> New Password: </label>
                        <input type="password" id="pass" name="pass" placeholder="New password" />
                    </div>
                </div>
                <div className="content">
                    <div className="field">
                        <label for="tag" className="passwordFormField" htmlFor="tag"> New Password: </label>
                        <input type="password" id="pass2" name="pass2" placeholder="Retype New password" />
                    </div>
                </div>
                <input type="hidden" name="_csrf" value={props.csrf} />
                <div className="extra content">
                    <input type="submit" value="Change Password" className="ui button formSubmit" />
                </div>
                <div class="ui error message"></div>
            </form>
        </div>
    );
};