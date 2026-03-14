from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
import requests

app = Flask(__name__)
CORS(app)  # Enable CORS for Vue frontend



@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/discogs/collection', methods=['POST'])
def get_discogs_collection():
    """Fetch Discogs collection for a user"""
    data = request.get_json()
    username = data.get('username')
    api_key = data.get('apiKey', '')
    
    if not username:
        return jsonify({"error": "Username is required"}), 400
    
    # Build the Discogs API URL
    url = f"https://api.discogs.com/users/{username}/collection/folders/0/releases"
    params = {
        'page': 1,
        'per_page': 100,
        'sort': 'artist',
        'sort_order': 'asc'
    }
    
    # Set up headers
    headers = {
        'User-Agent': 'DiscogsCollectionApp/1.0'
    }
    
    # Add API key to headers if provided
    if api_key:
        headers['Authorization'] = f'Discogs token={api_key}'
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.HTTPError as e:
        return jsonify({
            "error": "Failed to fetch collection",
            "details": str(e),
            "status_code": response.status_code
        }), response.status_code
    except requests.exceptions.RequestException as e:
        return jsonify({
            "error": "Request failed",
            "details": str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)