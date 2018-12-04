var username = "";
var timer = "";

const ImageGrid = function (props) {
  if (props.files.length === 0) {
    return (
      <div className="imageList">
        <h3 className="emptyDomo">No Images Yet</h3>
      </div>
    );
  }

  const ImageCards = props.files.images.map(function (file) {
    let filePath = `${file.url}`;
    let fileDate = file.fileDate.split('T')[0];

    let tagList = null;
    if (file.tags) {
      tagList = file.tags.split(' ').map((tag) => {
        return (
          <a className="ui label">
            <i className="tag icon"> {tag} </i>
          </a>
        );
      });
    }
    var fileKey = file.keyPath.split('/')[1];
    return (
      <div id={fileKey} key={fileKey} className="ui card">
        <div className="content">
          <div id="cardDate" className="right floated meta"> {fileDate}</div>
          <div id="cardTitle" className="left float meta">{file.title}</div>
        </div>
        <div className="content">
          <div className="image">
            <img id="imageDisplay" src={filePath} alt="d" className="ui medium image" />
          </div>
        </div>
        <div className="content">
          <button id="editButton" onClick={handleEdit} className="ui button">Edit</button>
          <button onClick={handleDelete} id="deleteButton" className="ui button">Delete</button>
        </div>
        <div className="content">
          {tagList}
        </div>
      </div>
    );
  });

  return (
    <div className="doubling grid container ui relaxed three cards">
      {ImageCards}
    </div>
  );
};


const handleDelete = (e, id) => {
  e.preventDefault();

  const fileID = e.target.parentElement.parentNode.id;

  sendAjax('DELETE', `/files/${fileID}?_method=DELETE`, null, function () {
    loadImagesFromServer();
  });
  return false;
};


const CreatePasswordPage = (csrf) => {
  ReactDOM.render(
    <PasswordForm csrf={csrf} />,
      document.querySelector('#content')
  );
};

const AccountView = (props) => {
  return (
    <div>
      <ImageGrid files={props.files} csrf={props.csrf} />
    </div>
  );
};

const AccountInfo = (props) => {
  return (
    <div>
      <h3 className="ui header">
        <i className="user icon"></i>
        <div className="content">
          {props.name} profile:
        </div>
      </h3>
    </div>
  );
};

const loadImagesFromServer = (csrf) => {
  sendAjax('GET', '/files', null, (data) => {
    ReactDOM.render(
      <ImageGrid files={data} csrf={csrf} />,
      document.querySelector('#content')
    );
  });
};

const loadUserInfo = (csrf) => {
  sendAjax('GET', '/getAccountInfo', null, (data) => {
    username = data.info.username;
    ReactDOM.render(
      <AccountInfo csrf={csrf} name={data.info.username} />,
      document.querySelector('#userInfo')
    );
  });
}

const CreateAccountPage = (csrf) => {
  ClearBody();
  loadUserInfo(csrf);

  ReactDOM.render(
    <AccountView csrf={csrf} files={[]} name="User" />,
    document.querySelector("#content")
  );
};

const ClearBody = () => {
  clearTimeout(timer);

  ReactDOM.render(
    <div></div>,
    document.querySelector('#userInfo')
  );

  ReactDOM.render(
    <div></div>,
    document.querySelector('#imagePreview')
  );

  ReactDOM.render(
    <div></div>,
    document.querySelector('#content')
  );
};

const setup = function (csrf) {
  const navUploadButton = document.querySelector("#navUploadButton");
  const navAccountButton = document.querySelector("#navAccountButton");
  const navExploreButton = document.querySelector("#navExploreButton");
  const navPassButton = document.querySelector("#navChangePassword");

  navUploadButton.addEventListener("click", (e) => {
    e.preventDefault();
    ClearBody();
    CreateUploadPage(csrf);
    return false;
  });

  navAccountButton.addEventListener("click", (e) => {
    e.preventDefault();
    ClearBody();
    CreateAccountPage(csrf);
    loadImagesFromServer(csrf);
    return false;
  });

  navExploreButton.addEventListener("click", (e) => {
    e.preventDefault();
    ClearBody();
    loadAllPublicImagesFromServer(csrf);
  });

  navPassButton.addEventListener("click", (e) => {
    e.preventDefault();
    ClearBody();
    CreatePasswordPage(csrf);
  });
  CreateAccountPage(csrf);
  loadImagesFromServer(csrf);
};


const getToken = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    setup(result.csrfToken);
  });
};

const getCSRF = () => {
  sendAjax('GET', '/getToken', null, (result) => {
    return result.csrfToken;
  });
};

$(document).ready(function () {
  getToken();
});