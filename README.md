<h1 align="center"><b>AI-Powered Monitoring System</b></h1>
<p align="center">
    <img src="https://github.com/tanzimfh/4990-project/blob/main/initialLogo.png" alt="Project Logo" width="200" />
</p> 

<p align="center"><b>
Transforming old devices into an AI-driven monitoring system.
</b></p>

---

## 📖 Description

The **AI-Powered Monitoring System** is a software solution designed to provide real-time monitoring and alert capabilities using repurposed devices like old smartphones. The system streams live video to a web application where users can monitor their environment, record footage, and receive notifications for specific events such as motion or fire, detected by AI. 

Key components include:
- **Web Application**: A user-friendly interface for viewing live streams, managing recordings, and receiving alerts.
- **Device Integration**: Repurposing old phones as live streaming devices.
- **AI Model**: Real-time detection of motion, fire, and other specified events, with notifications sent to users.

---

## 🔄 Wireflow

> **Placeholder for Wireflow Images or Diagrams**

Include an overview of the wireflow here, showcasing the main screens and flow of the application. Add diagrams to help visualize the user journey within the system.

---

## 🚀 Features

- **Live Video Streaming**: Real-time monitoring from any camera-equipped device.
- **Event Detection and Notifications**: AI-driven detection of motion, fire, and custom events with instant notifications.
- **Video Recording**: Option to manually record or enable automatic recording based on motion detection.
- **Scalable Cloud Storage**: Videos are securely stored in the cloud, accessible anytime.
- **Data Security**: End-to-end encryption for all video streams and user data.

---

## 🛠️ Installation

### Prerequisites

- **Node.js** and **npm** (for frontend and backend setup)
- **Python** and **pip** (if using Flask/Django for backend)
- **Cloud Storage** (AWS, Google Cloud) for video storage

### Steps

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/AI-Powered-Monitoring-System.git
    cd AI-Powered-Monitoring-System
    ```

2. **Install Dependencies**:
   - **Frontend**:
     ```bash
     cd frontend
     npm install
     npm start
     ```
   - **Backend**:
     ```bash
     cd backend
     pip install -r requirements.txt  # or npm install if using Node.js
     python app.py  # or node app.js if using Node.js
     ```

3. **Configure Devices**:
   Follow the instructions in `devices/README.md` to configure your device for streaming.

4. **Run the Application**:
   Access the web app at `http://localhost:3000` (or the configured port).

---

## 🎯 Usage

1. **Login** to the web app and add your configured device.
2. **Start Monitoring**: View live video feed, record videos, and set up notifications.
3. **AI Alerts**: Get notifications when AI detects events like motion or fire.

---

## 🧠 AI Model

The AI model is designed to detect specific events like motion and fire in real-time. It is trained using **TensorFlow** or **PyTorch** and deployed on the backend to process video streams and send alerts when an event is detected.

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

## Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified, and the filenames include hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: This is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and transitive dependencies (webpack, Babel, ESLint, etc.) right into your project so you have full control over them. All commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point, you're on your own.

You don't have to use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However, we understand that this tool wouldn't be useful if you couldn't customize it when you are ready.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

- **Code Splitting**: [Code Splitting Documentation](https://facebook.github.io/create-react-app/docs/code-splitting)
- **Analyzing the Bundle Size**: [Bundle Size Documentation](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)
- **Making a Progressive Web App**: [PWA Documentation](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)
- **Advanced Configuration**: [Advanced Configuration Documentation](https://facebook.github.io/create-react-app/docs/advanced-configuration)
- **Deployment**: [Deployment Documentation](https://facebook.github.io/create-react-app/docs/deployment)
- **Troubleshooting `npm run build` fails to minify**: [Troubleshooting Documentation](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)

---
