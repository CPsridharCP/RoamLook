/*
*    Copyright 2019 Misty Robotics, Inc.
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*
*    http://www.apache.org/licenses/LICENSE-2.0
*
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/


// On seeing a known face Misty greets and smiles... while on seeing an unknown face misty takes a picture and saves it

misty.Debug("Centering Head");
misty.MoveHeadDegrees(0, 0, 0, 100);
misty.MoveArmDegrees("both", 90, 100);

misty.StartFaceRecognition();
registerFaceRec();
misty.Set("FaceDetectedAt",(new Date()).toUTCString());
misty.Set("Initiated",false);

// ------------------------------------------FaceRec-----------------------------------------------------

function registerFaceRec(){
    misty.AddPropertyTest("FaceRec", "PersonName", "exists", "", "string");
    misty.RegisterEvent("FaceRec", "FaceRecognition", 1000, false);
}

function _FaceRec(data){
    misty.Drive(0, 0);
    var faceDetected = data.PropertyTestResults[0].PropertyValue;
    if (faceDetected == "unknown person"){
        misty.ChangeLED(255, 0, 0);
        misty.DisplayImage("Disdainful.png");
        misty.PlayAudio("007-Surprised_Ahhh.wav");
        misty.TakePicture(false, "Intruder", 1200, 1600, false, true);
        misty.MoveArmDegrees("both", 0, 100);
    } else if (faceDetected == "YOUR NAME HERE") {
        misty.ChangeLED(148, 0, 211);
        misty.DisplayImage("Happy.png");
        misty.PlayAudio("015-Meow.wav"); // This line could be replaced with an api to call google voics / mistys text to speech
        misty.MoveArmDegrees("both", -26, 100);
    } else {
        misty.ChangeLED(148, 0, 211);
        misty.DisplayImage("Wonder.png");
        misty.PlayAudio("gtcu.wav");
        misty.MoveArmDegrees("both", -26, 100);
    }

    misty.Set("FaceDetectedAt",(new Date()).toUTCString());
    misty.Set("Initiated",true);
}

// ------------------------------------------Loop-----------------------------------------------------
misty.Drive(15,20);
while (true) {
    misty.Pause(100);
    if (misty.Get("Initiated") && secondsPast(misty.Get("FaceDetectedAt")) > 7.0){
        misty.DisplayImage("Homeostasis.png");
        misty.Set("Initiated",false);
        misty.MoveArmDegrees("both", 90, 100);
        misty.Drive(15,20);
        misty.Pause(1000);
        registerFaceRec();
        misty.ChangeLED(0, 255, 0);
    }
}

// ------------------------------------------Supporting Functions-----------------------------------------------------

function secondsPast(value){
	var timeElapsed = new Date() - new Date(value);
    timeElapsed /= 1000;
    return Math.round(timeElapsed); // seconds
}
