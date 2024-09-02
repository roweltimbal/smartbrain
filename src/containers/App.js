import React, { Component } from "react";
import Navigation from "../components/Navigation/Navigation";
import Logo from "../components/Logo/Logo";
import ImageLinkForm from "../components/ImageLinkForm/ImageLinkForm";
import Rank from "../components/Rank/Rank";
import Signin from "../components/Signin/Signin";
import Register from "../components/Register/Register";
import "./App.css";
import ParticlesBg from "particles-bg";
import FaceRecognition from "../components/FaceRecognition/FaceRecognition";

const initialState = {
  input: "",
  imageUrl: "",
  appId: "faceDetector",
  userId: "oj9pqtu0yr0u",
  displayImage: false,
  box: {},
  route: "signin",
  isSignedIn: false,
  user: {
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  // loading user
  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  // Routing Functions
  onRouteChange = (route) => {
    if (route === "signout") {
      this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  // Helper functions
  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputimage");
    const width = Number(image.width);
    const height = Number(image.height);
    // to use the bounding boxes in reference to the image. Think of it as dots
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  // Listening for the textfield and button event
  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    this.returnRequestOptions();
    this.setState({ displayImage: true });
  };

  // API return function
  returnRequestOptions = () => {
    // Your PAT (Personal Access Token) can be found in the Account's Security section
    // const PAT = this.state.key;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = this.state.userId;
    const APP_ID = this.state.appId;
    // Change these to whatever model and image URL you want to use
    // const MODEL_ID = "face-detection";
    const IMAGE_URL = this.state.input;

    ///////////////////////////////////////////////////////////////////////////////////
    // YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
    ///////////////////////////////////////////////////////////////////////////////////

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: IMAGE_URL,
            },
          },
        },
      ],
    });

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: raw,
    };

    fetch(
      // "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
      // requestOptions
      "https://smartbrainbackend-9tg1.onrender.com/imageUrl",
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: requestOptions,
        }),
      }
    )
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          fetch("https://smartbrainbackend-9tg1.onrender.com/image", {
            method: "put",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((res) => res.json())
            .then((count) => {
              this.setState({
                user: {
                  ...this.state.user,
                  entries: count,
                },
              });
            })
            .catch((error) => console.log("Error updating entries: ", error));
        }
        this.displayFaceBox(this.calculateFaceLocation(result));
      })
      .catch((error) => console.log("error", error));
  };

  render() {
    return (
      <div className="App">
        <ParticlesBg color={["#E3F6FF"]} type="cobweb" num={60} bg={true} />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={this.state.isSignedIn}
        />
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              box={this.state.box}
              imageUrl={this.state.imageUrl}
              displayImage={this.state.displayImage}
            />
          </div>
        ) : this.state.route === "signin" ? (
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
