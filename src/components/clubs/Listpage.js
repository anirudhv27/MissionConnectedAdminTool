import React, { Component } from 'react';
import firebase from '../config/Firebase';
import { Link } from 'react-router-dom';
import { Button, ButtonToolbar,Table} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class ListPage extends Component {

  constructor(props) {
    super(props);
    this.ref = firebase.firestore().collection('boards');
    this.unsubscribe = null;
    this.state = {
      boards: [],
      board: {},
      key: '',
      clubs: [],
      club: {},
      Emails: []
    };
    this.delete = this.delete.bind(this);

  }

  Notify(){
  toast.error('Document successfully deleted!', {
    position: toast.POSITION.TOP_RIGHT
  });;
}




getUserData = () => {
  let ref = firebase.database().ref("/schools/missionsanjosehigh/clubs");
  ref.on("value", snapshot => {
    const clubs = [];
    snapshot.forEach(childSnapShot => {
      const { club_name, club_preview, club_description,club_image_url } = childSnapShot.val();
      clubs.push({
        key: childSnapShot.key,
        club_name,
        club_preview,
        club_description,
        club_image_url
      });
    });
    this.setState({
      clubs
   });
  })
}

  componentDidMount() {
    firebase.database().ref().on('value', snap => console.log('from db', snap.val()));
    this.getUserData();
  }




deleteimage(club_image_url) {
  console.log("this image url will be deleted after proper Auth " );
 // firebase.storage().ref().child(club_image_url).delete();
  // this.state.clubs.map(club => {
  //   // let imagePath = club.club_image_url
  //   // let name = imagePath.substr(imagePath.indexOf('%2F') + 3, (imagePath.indexOf('?')) - (imagePath.indexOf('%2F') + 3));
  //   // name = name.replace('%20', ' ');
  //   // let storagePath = firebase.storage().ref();
  //   firebase.storage().ref().child(club_image_url).delete();
  // })
}

deleteEventsMatchingClub(event_club) {
  var eventKey;
  var db = firebase.database();
  var events = db.ref("/schools/missionsanjosehigh/events");
  events.orderByChild("event_club").equalTo(event_club)
    .on("value", function (snap) {
      eventKey = snap.key;
      console.log('eventKey = ' + eventKey);
      snap.forEach(function (e) {
        console.log('e.key = ' + e.key);
      db.ref("/schools/missionsanjosehigh/events/" + e.key)
      .remove()
      .then(() => {
        var db = firebase.database();
        let users = db.ref("/users/");

          users.on('value', function (snapshot) {
          snapshot.forEach(function (childSnapshot) {
            var userKey = childSnapshot.key;
            let userEvents = db.ref("/users/" + userKey + "/events");
            console.log("userEvents " + userEvents);

            userEvents.on('value', function (snapshotChild) {
              snapshotChild.forEach(function (event) {
                if (event.key === eventKey) {
                  db.ref("/users/" + userKey + "/events/" + event.key)
                    .remove()
                    .then(() => {
                      console.log('successfully deleted eventid = ' );
                    })
                    .catch((error) => {
                      console.error("Error removing event from the user: = ", error);
                    })
                }
              })
            })
          })
        })
      })
    })
      // .catch((error) => {
      //   console.error("Error removing document: ", error);
      // });
    });
}

deleteMatchingUserClub(club_id) {
  var db = firebase.database();
  let users = db.ref("/users/");

  users.on('value', function (snapshot) {
    snapshot.forEach(function (childSnapshot) {
      var userKey = childSnapshot.key;
      let userClubs = db.ref("/users/" + userKey + "/clubs");
      userClubs.on('value', function (snapshotChild) {
        snapshotChild.forEach(function (club) {
          if (club.key === club_id) {
            db.ref("/users/" + userKey + "/clubs/" + club.key)
              .remove()
              .catch((error) => {
                console.error("Error removing club from the user: ", error);
              });
          }
        })
      })
    })
  });
}

delete(e, id, club_image_url) {
  if(window.confirm('Are you sure to delete this product?')){
  this.deleteEventsMatchingClub(id);
  this.deleteMatchingUserClub(id);

  firebase.database().ref('/schools/missionsanjosehigh/clubs/' + id)
    .remove()
    .then(() => {
      this.deleteimage(club_image_url);
      this.Notify();
      console.log("Club successfully deleted!" );
      this.props.history.push("/listpage")
    }).catch((error) => {
      console.error("Error removing document: ", error);
    });
  }
}



render() {
  return (
    <div class="container">
      <Table responsive border striped>
        <thead>
          <tr>
            <th>Club Name</th>
            <th>Club Preview</th>
            <th>Club Description</th>
            <th>Club Image</th>
            <th>Operations</th>
          </tr>
        </thead>
        <tbody>
          {this.state.clubs.map(club =>
            <tr>
              <td><Link to={`/editpage/${club.key}`}>{club.club_name}</Link></td>
              <td>{club.club_preview}</td>
              <td>{club.club_description}</td>
              <td><img src={club.club_image_url} alt=""  className="img-thumbnail" width="80" height="80" /></td>
              <td>
                <ButtonToolbar>
                  <ToastContainer />
                  <div class="btn-group">
                  <div style={{"display": "-webkit-flex"}}>
                  <Button bsStyle="success" href={`/editpage/${club.key}`} >Edit</Button>
                  <Button bsStyle="danger" onClick={(e) => this.delete(e, club.key, club.club_image_url)}>Delete</Button>
                  </div>
                  </div>
                </ButtonToolbar>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
}
}

    export default ListPage;
