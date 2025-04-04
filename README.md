# GitGPT: Mobile Coding Assistant with GitHub Contextual Integration

Built with React Native, OpenAI API, and demo deployed on Vercel.

Try out our app simulator!
🔗 [Web App Simulator](https://gitgpt-amber.vercel.app)

![CMPT363-Part4-Team13-Poster](https://github.com/user-attachments/assets/bc64b6a2-cfb5-49f3-b2d6-babd836def5d)


## Introduction
GitGPT is an improvement of ChatGPT on mobile, where we aim to resolve the key pain points using ChatGPT for coding: The lack of context and inability to paste large code blocks or import files.

There are 2 main tasks that our prototype implements:
    
   1. Importing a repository for contextual information
   2. Editing code and pushing back to the repository

This ReadMe walks through 

(a) how to clone and run the project on personal devices, and 

(b) how to effectively navigate the application and use all features provided

I suggest using the web app simulator as it already lins an OpenAI API key, you can try out the online simulator [HERE](https://gitgpt-amber.vercel.app)

Otherwise you would be required to create your own API key. You can follow the steps below.

### Contents

- [Cloning the project](#cloning-the-repository)
- [Project Setup and API Key](#project-setup-and-api-key)
- [Running the Project](#running-the-project)
- [Step-by-Step App Walkthrough](#step-by-step-app-walkthrough)
- [Additional Features](#additional-features)

---

# Cloning the repository:

First clone the repository in your desired directory, in your terminal run:

    git clone https://github.com/Vancarii/gitgpt.git

Then run this to open the project in vs code:

    code .

# Project Setup and API Key:

Before setting up the project, ensure you have Node installed to use ```npm```, or alternatively you can use ```yarn```

1. Go to OpenAI website and create your own api key

2. Navigate to the ```server``` folder

    ```
    cd server
    ```

4. Create a file named ```.env``` in the server folder with the following contents:
  
    ```
    OPENAI_API_KEY=actual_openai_key_here
    ```

and replace ```actual_openai_key_here``` with the openai key you obtained in step 1 

4. Now in the terminal of the **server** folder run:

    ```
    npm install
    ```

5. Navigate back to the **root** folder of the project and run:

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

### Task 1: Login, Connect GitHub, Import Repository

#### Step 1: Login Process

Now that the app is up and running on either mobile or web, here are steps to navigate the app.

1. Tap the ```top-right login button``` to enter the login interface

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

#### Step 2: Connect GitHub Account

1. Connecting to GitHub now can be done in 2 way:
   - (Shorter method) Click the ```GitHub Login``` button in the main chat interface

<p align="center">
  <img width="150" src="https://github.com/user-attachments/assets/fa8e5b28-f1f4-46da-b53a-8c0acb186947" />
</p>

   - OR: Go to the ```menu``` sidebar and click ```Linked Accounts```, then click on ```Connect``` in the GitHub tab

<p align="center">
  <img width="150" alt="sidebar" src="https://github.com/user-attachments/assets/91dfe3cc-9aa5-4448-867e-e8f6ce57fbc7" />
  <img width="150" alt="sidebar-linked-acc" src="https://github.com/user-attachments/assets/d2b5ae73-3069-40b5-b901-ab930356847c" />
    <img width="150" alt="integrations" src="https://github.com/user-attachments/assets/9a23c3ee-8b7c-4373-9efd-6369d1b18786" />
</p>

2. Enter a simple text into the input boxes (ex. username: user, password: 1234) and click on the ```Connect to GitHub``` button to sign in

<p align="center">
  <img width="150" alt="githublogin" src="https://github.com/user-attachments/assets/661d9606-5068-4b0e-bfbb-ad9d96ed177a" />
</p>

You will then be brought back to the home chat screen


#### Step 3: Select GitHub Repository

1. After linking GitHub, click on ```Import Repository``` in the chat screen

<p align="center">
  <img width="150" alt="import-repo" src="https://github.com/user-attachments/assets/61462bf4-917e-4f41-ae97-ad38a1fe58b7" />
</p>

2. Select any repository from the displayed list, for example: ```react-native-app```

<p align="center">
  <img width="150" alt="repos" src="https://github.com/user-attachments/assets/790e0d59-815c-4fd7-90bb-3103f508f986" />
</p>

---

### Task 2: Get AI Code Suggestions, Edit code, Push to Repository

#### Step 4: Review and Edit Code

1. Now that the app has context, you can provide a prompt in the text box at the bottom. An example prompt would be:
   
   ```
   Give me a short for loop in python
   ```

<p align="center">
  <img width="150" alt="prompt" src="https://github.com/user-attachments/assets/475372b2-3a31-42fa-aabb-2917f46c2e6b" />
</p>

2. Next, you can review the suggested code and its explanations, then click ```View Code Editor``` to open the code editing page

<p align="center">
  <img width="150" alt="prompted" src="https://github.com/user-attachments/assets/b9ed2c4d-c02d-49b5-b1b1-71ce4e1ca2e1" />
</p>




3. Click ```Accept``` to write in the new code suggestions into the file.

<p align="center">
  <img width="150" alt="code-editor" src="https://github.com/user-attachments/assets/ab975be7-3c7a-4e6d-b7ba-24e44f79d798" />
</p>


---

#### Step 5: Push Changes to GitHub

1. Click the ```top-right upload icon```

<p align="center">
 <img width="200" alt="m" src="https://github.com/user-attachments/assets/821d18dc-e299-431d-aa12-f40a4f89ce4e" />

</p>

2. Select ```Push to Main``` from the dropdown menu

<p align="center">
  <img width="150" alt="commit" src="https://github.com/user-attachments/assets/4ebb3e1d-3c9a-49e6-9801-d930296922b2" />
</p>
   
3. Input your commit message, then tap the ```Commit Changes``` button at the bottom of the page

<p align="center">
  <img width="150" alt="committing" src="https://github.com/user-attachments/assets/47cf33b1-35fb-4f1a-badb-aa45a57a5dfd" />
</p>

4. Click ```Commit``` in the popup dialog

<p align="center">
    <img width="300" alt="confirm" src="https://github.com/user-attachments/assets/a4df9b03-d767-4a1d-a756-43cc92c677b3" />
</p>

5. Your changes will be committed to your repository. Tap ```Back to Chat``` to return to the chat screen and complete the workflow

<p align="center">
  <img width="150" alt="committed" src="https://github.com/user-attachments/assets/7423ab29-7969-49bc-8f9a-8636add7953e" />
</p>

Thats it! You've completed the 2 main tasks of our application.

---

# Additional Features

- Personalization: Users are able to see their own account details and also toggle light mode and dark mode

<p align="center">
    <img  width="150" alt="account" src="https://github.com/user-attachments/assets/df5dd65a-d429-4d28-8890-68b60ca7f485" />
    <img width="150" alt="lightmode" src="https://github.com/user-attachments/assets/84771c0d-a951-483b-b55e-18b7de84edfe" />
</p>

- Error handling and prevention:
  - If prompts are sent without network connect, users will be notified of the error and suggested to check their network
  - If users try to login with null input boxes, it prompts them to input a value
  - History shows any older changes made allowing users to revert back to an older version if errors were made
  - Users are shown a guide to effectively navigate the new code editor screen and inform them of possible actions


- System feedback:
    - functionalities not yet implemented (not part of the main 2 tasks) are shown a popup for feedback
    - After accepting the new changes or editing the text in the file, there will be a M shown beside the filename, indicating the file has new changes saved. You will also be able to undo and redo, and view the history of changes made.

  
<p align="center">
    <img margin="10px" width="150" alt="networkerror" src="https://github.com/user-attachments/assets/811cc4ef-ae77-4735-b122-9bb796b72d47" />
    <img width="150" alt="login-error" src="https://github.com/user-attachments/assets/604c2630-3ad3-4662-b68c-0240e991fdb1" />
    <img width="300" alt="history" src="https://github.com/user-attachments/assets/1641d006-79c2-4eaa-b840-91d0a4e9e808" />
</p>


<p align="center">
    <img width="300" alt="guide" src="https://github.com/user-attachments/assets/4d696a08-b402-44a7-8f61-d262d30c3efe" />
    <img width="300" alt="not-implemented" src="https://github.com/user-attachments/assets/802cd826-8c2c-4c78-9a0c-e0ae745d2903" />
</p>
<p align="center">
        <img width="200" alt="m" src="https://github.com/user-attachments/assets/e5d0fa3d-d5c5-4dac-89df-9816cc637191" />

</p>

