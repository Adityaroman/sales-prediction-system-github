import pandas as pd
import joblib
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBRegressor

# Load data
df = pd.read_csv('sales_data.csv')
# Validate age vs. ageGroup
AGE_GROUP_RANGES = {
    '18-25': (18, 25),
    '26-35': (26, 35),
    '36-45': (36, 45),
    '46-55': (46, 55),
    '56-70': (56, 70)
}
df = df[df.apply(lambda x: AGE_GROUP_RANGES[x['Age_Group']][0] <= x['Age'] <= AGE_GROUP_RANGES[x['Age_Group']][1], axis=1)]
# Remove young married customers
df = df[~((df['Age'] < 18) & (df['Marital_Status'] == 'Married'))]
# Scale sales if needed (e.g., if in cents)
df['Sales'] = df['Sales'] / 1000  # Adjust as needed
# Encode categorical variables
le_gender = LabelEncoder().fit(df['Gender'])
le_marital = LabelEncoder().fit(df['Marital_Status'])
le_state = LabelEncoder().fit(df['State'])
le_category = LabelEncoder().fit(df['Product_Category'])
le_age_group = LabelEncoder().fit(df['Age_Group'])
df['Gender'] = le_gender.transform(df['Gender'])
df['Marital_Status'] = le_marital.transform(df['Marital_Status'])
df['State'] = le_state.transform(df['State'])
df['Product_Category'] = le_category.transform(df['Product_Category'])
df['Age_Group'] = le_age_group.transform(df['Age_Group'])
# Features and target
features = ['Age', 'Gender', 'Marital_Status', 'State', 'Product_Category', 'Age_Group', 'Orders']
X = df[features]
y = df['Sales']
# Train model
model = XGBRegressor()
model.fit(X, y)
# Save model and encoders
joblib.dump(model, 'sales_model.pkl')
joblib.dump(le_gender, 'le_gender.pkl')
joblib.dump(le_marital, 'le_marital.pkl')
joblib.dump(le_state, 'le_state.pkl')
joblib.dump(le_category, 'le_category.pkl')
joblib.dump(le_age_group, 'le_age_group.pkl')