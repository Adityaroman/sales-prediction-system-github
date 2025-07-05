from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model and encoders
try:
    model = joblib.load('sales_model.pkl')
    le_gender = joblib.load('le_gender.pkl')
    le_marital = joblib.load('le_marital.pkl')
    le_state = joblib.load('le_state.pkl')
    le_category = joblib.load('le_category.pkl')
    le_age_group = joblib.load('le_age_group.pkl')
except FileNotFoundError as e:
    print(f"Error: {e}")
    raise

# Age group validation
AGE_GROUP_RANGES = {
    '18-25': (18, 25),
    '26-35': (26, 35),
    '36-45': (36, 45),
    '46-55': (46, 55),
    '56-70': (56, 70)
}

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        print("Received data:", data)
        # Validate input
        required_fields = ['age', 'gender', 'maritalStatus', 'state', 'productCategory', 'ageGroup', 'orders']
        if not all(field in data for field in required_fields):
            return jsonify({'error': f'Missing required fields: {set(required_fields) - set(data)}'}), 400

        # Create DataFrame
        df = pd.DataFrame([data])
        # Convert numeric fields
        df['age'] = pd.to_numeric(df['age'], errors='coerce')
        df['orders'] = pd.to_numeric(df['orders'], errors='coerce')
        if df[['age', 'orders']].isna().any().any():
            return jsonify({'error': 'Invalid numeric values for age or orders'}), 400

        # Validate age vs. ageGroup
        age = df['age'].iloc[0]
        age_group = df['ageGroup'].iloc[0]
        if age_group not in AGE_GROUP_RANGES:
            return jsonify({'error': f'Invalid ageGroup: {age_group}, expected: {list(AGE_GROUP_RANGES.keys())}'}), 400
        min_age, max_age = AGE_GROUP_RANGES[age_group]
        if not (min_age <= age <= max_age):
            return jsonify({'error': f'Age {age} does not match ageGroup {age_group} (expected {min_age}-{max_age})'}), 400

        # Validate marital status (restrict for young ages)
        if age < 18 and df['maritalStatus'].iloc[0] == 'Married':
            return jsonify({'error': 'Invalid maritalStatus: Married not allowed for age < 18'}), 400

        # Normalize categorical inputs
        gender_map = {'Female': 'F', 'Male': 'M'}
        df['gender'] = df['gender'].map(gender_map).fillna(df['gender'])
        # Encode categorical variables
        try:
            if df['gender'].iloc[0] not in le_gender.classes_:
                return jsonify({'error': f'Invalid gender value: {df["gender"].iloc[0]}, expected: {le_gender.classes_}'}), 400
            if df['maritalStatus'].iloc[0] not in le_marital.classes_:
                return jsonify({'error': f'Invalid maritalStatus value: {df["maritalStatus"].iloc[0]}, expected: {le_marital.classes_}'}), 400
            if df['state'].iloc[0] not in le_state.classes_:
                return jsonify({'error': f'Invalid state value: {df["state"].iloc[0]}, expected: {le_state.classes_}'}), 400
            if df['productCategory'].iloc[0] not in le_category.classes_:
                return jsonify({'error': f'Invalid productCategory value: {df["productCategory"].iloc[0]}, expected: {le_category.classes_}'}), 400
            if df['ageGroup'].iloc[0] not in le_age_group.classes_:
                return jsonify({'error': f'Invalid ageGroup value: {df["ageGroup"].iloc[0]}, expected: {le_age_group.classes_}'}), 400

            # Create new DataFrame with encoded and renamed columns
            df_encoded = pd.DataFrame({
                'Age': df['age'],
                'Gender': le_gender.transform([df['gender'].iloc[0]])[0],
                'Marital_Status': le_marital.transform([df['maritalStatus'].iloc[0]])[0],
                'State': le_state.transform([df['state'].iloc[0]])[0],
                'Product_Category': le_category.transform([df['productCategory'].iloc[0]])[0],
                'Age_Group': le_age_group.transform([df['ageGroup'].iloc[0]])[0],
                'Orders': df['orders']
            })
        except ValueError as e:
            return jsonify({'error': f'Invalid categorical value: {str(e)}'}), 400

        # Select features in correct order
        features = ['Age', 'Gender', 'Marital_Status', 'State', 'Product_Category', 'Age_Group', 'Orders']
        df_encoded = df_encoded[features]
        print("Input features:", df_encoded.columns.tolist())
        # Predict
        prediction = model.predict(df_encoded)[0]
        return jsonify({'prediction': float(prediction)})
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)