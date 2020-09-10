function requestOrientationPermission() {
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    // iOS 13+
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          window.addEventListener("deviceorientation", (e) => {
            // do something with e
          });
        }
      })
      .catch(console.error);
    DeviceOrientationEvent.requestPermission()
      .then((response) => {
        if (response == "granted") {
          window.addEventListener("deviceorientation", (e) => {
            // do something with e
          });
        }
      })
      .catch(console.error);
  } else {
    // non iOS 13+
  }
}
