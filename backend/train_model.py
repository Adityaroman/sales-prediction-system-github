import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor
import joblib

df = pd.read_csv('data/sales_data.csv')
df['Age_Group'] = pd.cut(df['Age'], bins=[18, 25, 35, 45, 55, 70], labels=['18-25', '26-35', '36-45', '46-55', '56-70'])

le_gender = LabelEncoder()
le_marital = LabelEncoder()
le_state = LabelEncoder()
le_category = LabelEncoder()
le_age_group = LabelEncoder()

df['Gender'] = le_gender.fit_transform(df['Gender'])
df['Marital_Status'] = le_marital.fit_transform(df['Marital_Status'])
df['State'] = le_state.fit_transform(df['State'])
df['Product_Category'] = le_category.fit_transform(df['Product_Category'])
df['Age_Group'] = le_age_group.fit_transform(df['Age_Group'])

X = df[['Age', 'Gender', 'Marital_Status', 'State', 'Product_Category', 'Age_Group', 'Orders']]
y = df['Amount']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = XGBRegressor(random_state=42)
model.fit(X_train, y_train)

joblib.dump(model, 'sales_model.pkl')
joblib.dump(le_gender, 'le_gender.pkl')
joblib.dump(le_marital, 'le_marital.pkl')
joblib.dump(le_state, 'le_state.pkl')
joblib.dump(le_category, 'le_category.pkl')
joblib.dump(le_age_group, 'le_age_group.pkl')
print("Model and encoders saved")