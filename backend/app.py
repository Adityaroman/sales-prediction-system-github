from flask import Flask, request, jsonify
import pickle
import os
import pandas as pd
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
try:
    with open(model_path, 'rb') as file:
        model = pickle.load(file)
except Exception as e:
    print(f'Failed to load model: {e}')
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not trained'}), 400

    data = request.get_json()

    required_fields = [
        'age', 'gender', 'maritalStatus', 'state',
        'productCategory', 'ageGroup', 'orders'
    ]

    missing_fields = [f for f in required_fields if f not in data]
    if missing_fields:
        return jsonify({'error': f'Missing fields: {", ".join(missing_fields)}'}), 400

    try:
        age = int(data['age'])
        orders = int(data['orders'])
    except (ValueError, TypeError):
        return jsonify({'error': 'Age and orders must be integers'}), 400

    # Prepare input matching training features
    input_data = {
        'age': age,
        'orders': orders,
        'gender_M': 1 if data['gender'] == 'M' else 0,
        'maritalStatus_Married': 1 if data['maritalStatus'] == 'Married' else 0,
        'state_Haryana': 1 if data['state'] == 'Haryana' else 0,
        'state_Karnataka': 1 if data['state'] == 'Karnataka' else 0,
        'state_Maharashtra': 1 if data['state'] == 'Maharashtra' else 0,
        'state_Uttar Pradesh': 1 if data['state'] == 'Uttar Pradesh' else 0,
        'productCategory_Clothing': 1 if data['productCategory'] == 'Clothing' else 0,
        'productCategory_Food': 1 if data['productCategory'] == 'Food' else 0,
        'productCategory_Home': 1 if data['productCategory'] == 'Home' else 0,
        'ageGroup_26-35': 1 if data['ageGroup'] == '26-35' else 0,
        'ageGroup_36-45': 1 if data['ageGroup'] == '36-45' else 0,
        'ageGroup_46-55': 1 if data['ageGroup'] == '46-55' else 0,
        'ageGroup_56-70': 1 if data['ageGroup'] == '56-70' else 0
    }

    input_df = pd.DataFrame([input_data])

    try:
        prediction = model.predict(input_df)[0]
        return jsonify({'prediction': float(prediction)})
    except Exception as e:
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
