# GitGPT: Mobile Coding Assistant with GitHub Contextual Integration

Try out our app!
🔗 [Web App Simulator](https://gitgpt-amber.vercel.app)

![CMPT363-Part4-Team13-Poster](https://github.com/user-attachments/assets/bc64b6a2-cfb5-49f3-b2d6-babd836def5d)


## Introduction
GitGPT is an improvement of ChatGPT on mobile, where we aim to resolve the key pain points using ChatGPT for coding: The lack of context and inability to paste large code blocks or import files.

This ReadMe walks through 

(a) how to clone and run the project on personal devices, and 

(b) how to effectively navigate the application and use all features provided

### Contents

- [Cloning the project](#cloning-the-repository)
- [Project Setup and API Key](#project-setup-and-api-key)
- [Running the Project](#running-the-project)
- [Step-by-Step App Walkthrough](#step-by-step-app-walkthrough)

---

### Cloning the repository:

First clone the repository in your desired directory, in your terminal run:
    ```
    git clone https://github.com/Vancarii/gitgpt.git
    ```
Then run this to open the project in vs code:
    ```
    code .
    ```

### Project Setup and API Key:

1. Go to OpenAI website and create your own api key

2. Navigate to the ```server``` folder

    ```
    cd server
    ```

4. Create a file named ```.env``` in the server folder with the following contents:
  
    ```
    OPENAI_API_KEY=place_your_actual_openai_key_here
    ```

and replace the placeholder with the openai key you obtained in step 1 

4. Now in the terminal of the server folder run:

    ```
    npm install
    ```

5. Navigate back to the root folder of the project and run:

    ```
    npm install
    ```

---

# Running the Project

1. First navigate to the server folder and run the server:

   ```
   cd server          // navigate to server folder
   node server.js     // run the server
   ```

   Ensure the server is running of port 8081

2. Then to run the whole project in the root directory:

   ```
   cd ..       // navigate back to root directory
   npm start   // run the project
   ```

Once prompted to run the project on port 8082, select ```y``` for yes

You will now be prompted with the local host link for the web version, and also the QR code to open the expo app. If the expo app is installed, simply scan the QR code with your camera (for iOS) or use the expo app to scan (for Android).


# Step by Step App Walkthrough 

### Step 1: Login Process

Now that the app is up and running on either mobile or web, here are steps to navigate the app.

1. Tap the **top-right login button** to enter the login interface

<p align="center">
  <img src="https://github.com/user-attachments/assets/3ed3dfa4-26f9-4fe7-866b-38ed160d445f" width="150" />
</p>

3. Since our app checks for null input values, enter some text in the input boxes, for example:
  - username: ```user```
  - password: ```1234```

Then click ```Sign in```

<p align="center">
  <img src="https://github.com/user-attachments/assets/4ac8712b-4fc1-49ec-85f8-5a09023988a5" width="150" />
</p>

---

### Step 2: Connect GitHub Account

1. Connecting to GitHub now can be done in more than 1 way:
   - Click the ```GitHub Login``` button in the main chat interface
   - Go to the ```sidebar``` and click ```Linked Accounts```

<p align="center">
  <img width="150" src="https://github.com/user-attachments/assets/fa8e5b28-f1f4-46da-b53a-8c0acb186947" />
</p>

OR

<p align="center">
  <img width="150" alt="sidebar" src="https://github.com/user-attachments/assets/91dfe3cc-9aa5-4448-867e-e8f6ce57fbc7" />
  <img width="150" alt="sidebar-linked-acc" src="https://github.com/user-attachments/assets/d2b5ae73-3069-40b5-b901-ab930356847c" />
</p>





2. Click **Integrations** 

<p align="center">
  <img src="https://github.com/user-attachments/assets/f975ccd2-2279-44c0-abf7-65964c188d28" width="150" />
</p>
   
3. Tap the **GitHub** button to access the GitHub login interface

<p align="center">
  <img src="https://github.com/user-attachments/assets/11b70000-15ba-4a5c-a431-3de19ce42628" width="150" />
</p>

4. GitHub credentials are prefilled, click the **Sign In** button

<p align="center">
  <img src="https://github.com/user-attachments/assets/b045fafd-d705-45a6-a854-57604b994a3a" width="150" />
</p>

5. Navigate back using the back button at the top left corner of the screen

<p align="center">
  <img src="https://github.com/user-attachments/assets/b291221f-4f3e-47d9-883b-9433f933a1d3" width="150" />
</p>


---

### Step 3: Select GitHub Repository

1. After linking GitHub, click on **Import Repository** in the chat screen

<p align="center">
  <img src="https://github.com/user-attachments/assets/ce9d8121-2fdc-4155-8a65-e4372f629dfc" width="150" />
</p>

2. Select the first repository from the displayed list, **Repository 1**

<p align="center">
  <img src="https://github.com/user-attachments/assets/4ff9789c-5175-483b-96f6-3fe8b6f987db" width="150" />
</p>

---

### Step 4: Review and Edit Code

1. After selecting a repository, a **sample prompt** is provided in the prototype: tap the **Send button** in the bottom-right

<p align="center">
  <img src="https://github.com/user-attachments/assets/eaca4c91-d7b3-4b72-a65a-408031b0e7e7" width="150" />
</p>

2. Tap **Show Full Code** to open the code editing page

<p align="center">
  <img src="https://github.com/user-attachments/assets/967771e7-e660-4d75-988e-8692944f8b5a" width="150" />
</p>

3. Click **Accept Changes** above the code suggestions highlighted in blue

<p align="center">
  <img src="https://github.com/user-attachments/assets/f040cff2-c654-420d-b992-f7f9ac59ad11" width="150" />
</p>


---

### Step 5: Push Changes to GitHub

1. Click the **top-right upload icon**

<p align="center">
  <img src="https://github.com/user-attachments/assets/a318d52f-f3c6-4c1b-becf-7b1b523e6d7d" width="150" />
</p>

2. Select **Push to Main** from the dropdown menu

<p align="center">
  <img src="https://github.com/user-attachments/assets/b0447861-5401-4fc2-beea-0d2fa27328b1" width="150" />
</p>
   
3. After reviewing changes, tap the **Commit Changes** button at the bottom of the page

<p align="center">
  <img src="https://github.com/user-attachments/assets/b17584a8-8957-4d99-ac56-e24d44f85bf0" width="150" />
</p>

4. Click **Commit** in the popup dialog

<p align="center">
  <img src="https://github.com/user-attachments/assets/f1c62376-2917-4ca2-8b72-bc6b2aa05bcd" width="150" />
</p>

5. Your changes will be committed to your repository. Tap **Back to Chat** to return to the chat screen and complete the workflow

<p align="center">
  <img src="https://github.com/user-attachments/assets/4830429a-3243-490f-ba76-b5381850cc22" width="150" />
</p>

Thats it! You've completed the vertical functionality of our prototype.

---

## Additional Features

### View Edit History
- Tap the **History** button at the top toolbar section at any time to review past changes

<p align="center">
  <img src="https://github.com/user-attachments/assets/d0886344-adff-4ec8-9d51-129984bd087c" width="150" />
  <img src="https://github.com/user-attachments/assets/4cf9722d-8b1b-4b4e-b9ba-7ab5a52227d0" width="150" />
</p>

### **Mistake Recovery**
- Users can **undo an action** to revert accepted changes in the code editor
- The prototype tracks **changes made**, prompting users to push their updates in the chat screen

<p align="center">
  <img src="https://github.com/user-attachments/assets/d0886344-adff-4ec8-9d51-129984bd087c" width="150" />
  <img src="https://github.com/user-attachments/assets/5a0e5d5c-5bb9-4b9e-99fe-2d2d7a7003d3" width="150" />
</p>


### **Account and Session Management**
- Users can review the **Terms and Privacy Policy** anytime within the login session for **clarity and security**
- Users can view their chat history at any time within the sidebar window

<p align="center">
  <img src="https://github.com/user-attachments/assets/08aa46ba-7ef2-487e-8d07-060e1f3c97b3" width="400" />
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/1ab59d27-c442-420e-bc0c-a834dd2e31c8" width="150" />
  <img src="https://github.com/user-attachments/assets/a55258a9-dab6-4c33-a583-4be2a01da9df" width="150" />
</p>

### Mobile Keyboard Shortcuts
- Code editing is improved with common keyboard buttons easily accessible

<p align="center">
  <img src="https://github.com/user-attachments/assets/d9edd1eb-b1b1-4e13-9ea3-62aaa78e1255" width="150" />
</p>

