## Welcome to travel advisory
Travel advisory is a tool using nlp to extract locations from texts and display it (its use case is from comments in social media.)
![Screenshot 2024-08-22 231613](https://github.com/user-attachments/assets/569b27d2-b3ee-4689-ae35-bdb0f1d186e9)

## Getting started with the travel advisory:

```
pip install -r requirements.txt
```

Once the python dependencies have been installed, install the node modules:
```
npm install
```

Start the server:
```
python server.py
```

Start the app:
```
npm start
```

Create the .env file and add these variables:
```
REACT_APP_GOOGLE_MAPS_API_KEY
REACT_APP_FLASK_API_URL
```
*REACT_APP_GOOGLE_MAPS_API_KEY can be retrieved from https://developers.google.com/maps
*REACT_APP_FLASK_API_URL can be defaulted to your local host: http://127.0.0.1:5000
