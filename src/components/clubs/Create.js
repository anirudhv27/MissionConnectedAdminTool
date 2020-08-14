import React, { Component } from 'react';
  import firebase from "../config/Firebase";
  import "firebase/storage";
  import {
  ControlLabel,
  FormControl,
  Button,
  Image,
  Label
  } from "react-bootstrap";
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


  const storage = firebase.storage().ref();

  class Create extends Component {

  constructor(props) {
    super(props);
    this.state = {
      club_name: '',
      club_preview: '',
      club_description: '',
      club_image_url: '',
      clubofficers: '',
      redirect: false,
      image: null,
      url: "",
      progress: 0,
      filename: "",
      user: ''
    };
  }

  componentDidMount() {
    firebase.database().ref().on('value', snap => console.log('from db', snap.val()));
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({
          user: user
        });
      } else {
        this.setState({
          user: false
        });
      }
    })
  }

  Notify() {
    toast.success('Clubdetails successfully added!', {
      position: toast.POSITION.TOP_RIGHT
    });;
  }

  handleChange = e => {
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
      snapshot => {
        // progress function ...
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        this.setState({ progress });
      },
      error => {
        // Error function ...
        console.log(error);
      },
      () => {
        // complete function ...
        storage
          .child("images/" + image.name)
          .getDownloadURL()
          .then(url => {
            this.setState({ url });
          });
      }
    );
  };


  onChange = (e) => {
    const state = this.state
    state[e.target.name] = e.target.value;
    this.setState(state);
  }


  onSubmit = (e) => {
    // console.log("submit pressed");
    if (this.state.club_name == "" ) {
        alert("Enter Club Name ! Make sure you enter all fields before you sumbit.");
        return false;
     } else if ( this.state.club_preview == "" ) {
        alert("Enter Club Preview ! Make sure you enter all fields before you sumbit.");
        return false;
     } else if ( this.state.club_description == "" ) {
        alert("Enter Club Description! Make sure you enter all fields before you sumbit.");
        return false;
     } else if ( this.state.url == "" ) {
        alert("Select and Upload Club Image Url! Make sure you enter all fields before you sumbit.");
        return false;
     }
    e.preventDefault();
    var clubsData = firebase.database().ref('schools/missionsanjosehigh/clubs').push({
      club_name: this.state.club_name,
      club_preview: this.state.club_preview,
      club_description: this.state.club_description,
      member_numbers: 1,
      isApproved: true,
      club_image_url: this.state.url
    })
    var clubKey = clubsData.getKey();

    var userKey = this.findUsersMatchingEmail(this.state.user.email);
    console.log('user_email = ' + this.state.user.email);
    console.log('userKey = ' + userKey);

    firebase.database().ref('users/' + userKey + '/clubs').update({
      [clubKey]: 'Officer'
    })

    this.props.history.push("/listpage")
  }



  findUsersMatchingEmail(email) {
    var userKey;
    var db = firebase.database();
    var users = db.ref("users/");
    users.orderByChild("email")
      .equalTo(email)
      .on("child_added", function (snap) {
        userKey = snap.key;
      });
    return userKey;
  }


  render() {
    return (
      <div class="container">
        <div class="panel panel-default">
          <div class="panel-heading">
          </div>
          <div class="panel-body">
            <form onSubmit={this.onSubmit}>
              <div class="form-group">
                <label for="title">Club Name:</label>
                <input type="text" class="form-control" name="club_name" value={this.state.club_name} onChange={this.onChange} placeholder="Club Name" />
              </div>

              <div class="form-group">
                <label for="title">Club Preview:</label>
                <input type="text" class="form-control" name="club_preview" value={this.state.club_preview} onChange={this.onChange} placeholder="Club Preview" />
              </div>


              <div class="form-group">
                <label for="description">Club Description:</label>
                <textArea class="form-control" name="club_description" value={this.state.club_description} onChange={this.onChange} placeholder="Club Description" cols="80" rows="3"></textArea>
              </div>

              <div class="form-group">
                <div>
                  <Image src={this.state.url || "https://via.placeholder.com/400x300"} thumbnail width="80" height="80" />
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
                    />Choose Image
                </ControlLabel>
                  <Label type="file" bsStyle="info" style={{ marginLeft: "5px" }}>
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
                <input type="text" class="form-control" name="club_image_url" value={this.state.url} onChange={this.onChange} placeholder="Club Image" />
              </div>
              <button type="submit" class="btn btn-success">Submit</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
  }

  export default Create;
