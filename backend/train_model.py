import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import pickle
import os

# Load data
data_path = os.path.join(os.path.dirname(__file__), 'data', 'sales_data.csv')
if not os.path.exists(data_path):
    raise FileNotFoundError(f'sales_data.csv not found at {data_path}')
data = pd.read_csv(data_path)

# Features and target
features = ['age', 'gender', 'maritalStatus', 'state', 'productCategory', 'ageGroup', 'orders']
X = pd.get_dummies(data[features], drop_first=True)
y = data['sales']

# Train model
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
model = LinearRegression()
model.fit(X_train, y_train)

# Save model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
with open(model_path, 'wb') as file:
    pickle.dump(model, file)

print(f'Model trained and saved as {model_path}')
print('Feature columns:', list(X.columns))
