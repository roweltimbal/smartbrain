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

// function App() {
//   return (
//     <div className="App">
//       <ParticlesBg color={["#E3F6FF"]} type="cobweb" num={60} bg={true} />
//       <Navigation />
//       <Logo />
//       <Rank />
//       <ImageLinkForm />
//       {/* <FaceRecognition /> */}
//     </div>
//   );
// }
// key: "fb5f40615e3441c2890508abb50e1d81",
//       appId: "faceDetector",
//       userId: "oj9pqtu0yr0u",

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageUrl: "",
      key: "fb5f40615e3441c2890508abb50e1d81",
      appId: "faceDetector",
      userId: "oj9pqtu0yr0u",
      displayImage: false,
      box: {},
      route: "signin",
      isSignedIn: false,
    };
  }
  // Routing Functions
  onRouteChange = (route) => {
    if (route === "signin") {
      this.setState({ isSignedIn: false });
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
    this.setState({ box: box }, () => {
      console.log(this.state.box);
    });
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
    const PAT = this.state.key;
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = this.state.userId;
    const APP_ID = this.state.appId;
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = "face-detection";
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
        Authorization: "Key " + PAT,
      },
      body: raw,
    };

    fetch(
      "https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs",
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
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
            <Rank />
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
          <Signin onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;
