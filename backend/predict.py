import pandas as pd
import joblib
import json
import sys
import os

def eda():
    try:
        df = pd.read_csv('data/sales_data.csv')
        print("EDA: Loaded sales_data.csv")
        df['Age_Group'] = pd.cut(df['Age'], bins=[18, 25, 35, 45, 55, 70], labels=['18-25', '26-35', '36-45', '46-55', '56-70'])
        sales_gen = df.groupby('Gender')['Amount'].sum().to_dict()
        sales_state = df.groupby('State')['Amount'].sum().sort_values(ascending=False).head(5).to_dict()
        sales_category = df.groupby('Product_Category')['Amount'].sum().sort_values(ascending=False).to_dict()
        sales_age_group = df.groupby('Age_Group')['Amount'].sum().to_dict()
        return {
            'sales_by_gender': sales_gen,
            'sales_by_state': sales_state,
            'sales_by_category': sales_category,
            'sales_by_age_group': sales_age_group
        }
    except Exception as e:
        return {"error": f"EDA error: {str(e)}"}

def predict(data):
    try:
        print("Predict: Loading model and encoders")
        model = joblib.load('sales_model.pkl')
        le_gender = joblib.load('le_gender.pkl')
        le_marital = joblib.load('le_marital.pkl')
        le_state = joblib.load('le_state.pkl')
        le_category = joblib.load('le_category.pkl')
        le_age_group = joblib.load('le_age_group.pkl')
        print("Predict: Model and encoders loaded")

        print(f"Predict: Input data: {data}")
        df = pd.DataFrame([{
            'Age': int(data['Age']),
            'Gender': le_gender.transform([data['Gender']])[0],
            'Marital_Status': le_marital.transform([data['Marital_Status']])[0],
            'State': le_state.transform([data['State']])[0],
            'Product_Category': le_category.transform([data['Product_Category']])[0],
            'Age_Group': le_age_group.transform([data['Age_Group']])[0],
            'Orders': int(data['Orders'])
        }])
        print("Predict: DataFrame created")
        prediction = model.predict(df)[0]
        print(f"Predict: Prediction made: {prediction}")
        return {"prediction": float(prediction)}
    except Exception as e:
        return {"error": f"Predict error: {str(e)}"}

if __name__ == "__main__":
    try:
        print(f"Main: Input arguments: {sys.argv}")
        input_data = json.loads(sys.argv[1])
        function = input_data.get("function")
        print(f"Main: Function: {function}")
        os.makedirs('../frontend/public', exist_ok=True)
        if function == "eda":
            result = eda()
            with open('../frontend/public/eda.json', 'w') as f:
                json.dump(result, f)
            print("Main: eda.json written")
        elif function == "predict":
            result = predict(input_data.get("data", {}))
            with open('../frontend/public/predict.json', 'w') as f:
                json.dump(result, f)
            print("Main: predict.json written")
        else:
            result = {"error": "Invalid function"}
        print(json.dumps(result))
    except Exception as e:
        result = {"error": f"Main error: {str(e)}"}
        print(json.dumps(result))