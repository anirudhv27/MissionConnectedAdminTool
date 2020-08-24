import React, { Component } from "react";
import firebase from "../config/Firebase";
import "firebase/storage";
import {
  ControlLabel,
  FormControl,
  Button,
  Image,
  Label,
} from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";

const storage = firebase.storage().ref();

class Edit extends Component {
  constructor(props) {
    super(props);
    //this.ref = firebase.firestore().collection('boards');
    this.state = {
      club_name: "",
      club_preview: "",
      club_description: "",
      club_image_url: "",
      url: "",
      clubofficers: "",
    };
  }

  handleChange = (e) => {
    if (e.target.files[0]) {
      const image = e.target.files[0];
      this.setState(() => ({ filename: image.name }));
      this.setState(() => ({ image }));
    }
  };

  handleUpload = () => {
    const { image } = this.state;
    const uploadTask = storage.child(`images/${image.name}`).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      (error) => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        storage
          .child("images/" + image.name)
          .getDownloadURL()
          .then((url) => {
            this.setState({ url });
          });
      }
    );
  };

  getUserData = () => {
    firebase
      .database()
      .ref("/schools/missionsanjosehigh/clubs/" + this.props.match.params.id)
      .on("value", (snapshot) => {
        const clubs = snapshot.val();
        this.setState({
          key: snapshot.key,
          club_name: clubs.club_name,
          club_preview: clubs.club_preview,
          club_description: clubs.club_description,
          url: clubs.club_image_url,
        });
      });
  };

  componentDidMount() {
    this.getUserData();
  }

  onChange = (e) => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState({ board: state });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { club_name, club_preview, club_description } = this.state;
    firebase
      .database()
      .ref("/schools/missionsanjosehigh/clubs/" + this.props.match.params.id)
      .update({
        club_name,
        club_preview,
        club_description,
        club_image_url: this.state.url,
      });
    this.props.history.push("/listpage");
  };

  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading"></div>
          <div class="panel-body">
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Club Name:</label>
                <input
                  type="text"
                  class="form-control"
                  name="club_name"
                  value={this.state.club_name}
                  onChange={this.onChange}
                  placeholder="Club Name"
                />
              </div>

              <div class="form-group">
                <label for="title">Club Preview:</label>
                <input
                  type="text"
                  class="form-control"
                  name="club_preview"
                  value={this.state.club_preview}
                  onChange={this.onChange}
                  placeholder="Club Preview"
                />
              </div>

              <div class="form-group">
                <label for="description">Club Description:</label>
                <textArea
                  class="form-control"
                  name="club_description"
                  value={this.state.club_description}
                  onChange={this.onChange}
                  placeholder="Club Description"
                  cols="80"
                  rows="3"
                >
                  {this.state.club_description}
                </textArea>
              </div>

              <div class="form-group">
                <div>
                  <Image
                    src={
                      this.state.url || "https://via.placeholder.com/400x300"
                    }
                    thumbnail
                    width="80"
                    height="80"
                  />
                  <ControlLabel
                    className="btn btn-success"
                    htmlFor="fileSelector"
                    style={{ marginLeft: "5px" }}
                  >
                    <FormControl
                      id="fileSelector"
                      type="file"
                      style={{ display: "none" }}
                      onChange={this.handleChange}
                    />
                    Choose Image
                  </ControlLabel>
                  <Label
                    type="file"
                    bsStyle="info"
                    style={{ marginLeft: "5px" }}
                  >
                    {this.state.filename}
                  </Label>
                  <Button
                    bsStyle="primary"
                    type="button"
                    onClick={this.handleUpload}
                    style={{ marginLeft: "5px" }}
                  >
                    Upload
                  </Button>
                </div>
                <label for="author">Club Image:</label>
                <input
                  type="text"
                  class="form-control"
                  name="club_image_url"
                  value={this.state.url}
                  onChange={this.onChange}
                  placeholder="Club Image"
                />
              </div>
              <button type="submit" class="btn btn-success">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Edit;
