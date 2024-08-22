from flask import Flask, request, jsonify
import spacy
from flask_cors import CORS

# Load the spaCy model
nlp = spacy.load('en_core_web_sm')

# Create a Flask application
app = Flask(__name__)
CORS(app)  # This will enable CORS for all routes
@app.route('/extract_gpe', methods=['POST'])
def extract_gpe():
    # Get the text from the request
    data = request.get_json()
    text = data.get('text', '')

    # Process the text with spaCy
    doc = nlp(text)

    # Extract geographical entities (GPE)
    gpe_entities = [entity.text for entity in doc.ents if entity.label_ == 'GPE']

    # Return the entities as a JSON response
    return jsonify({'entities': gpe_entities})

if __name__ == '__main__':
    app.run(debug=True)
