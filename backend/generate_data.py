import pandas as pd
import numpy as np
import os

np.random.seed(42)
n_rows = 10000

states = ['Delhi', 'Haryana', 'Karnataka', 'Maharashtra', 'Uttar Pradesh']
product_categories = ['Electronics', 'Clothing', 'Home', 'Food']
age_groups = ['18-25', '26-35', '36-45', '46-55', '56-70']
genders = ['M', 'F']
marital_statuses = ['Married', 'Single']

data = {
    'age': np.random.randint(18, 70, n_rows),
    'gender': np.random.choice(genders, n_rows),
    'maritalStatus': np.random.choice(marital_statuses, n_rows),
    'state': np.random.choice(states, n_rows),
    'productCategory': np.random.choice(product_categories, n_rows),
    'ageGroup': np.random.choice(age_groups, n_rows),
    'orders': np.random.randint(50, 500, n_rows),
    'sales': np.random.uniform(10000, 50000, n_rows)
}

df = pd.DataFrame(data)

# Save CSV to backend/data/sales_data.csv
output_path = os.path.join(os.path.dirname(__file__), 'data', 'sales_data.csv')
os.makedirs(os.path.dirname(output_path), exist_ok=True)
df.to_csv(output_path, index=False)

print(f'✅ Generated sales_data.csv with {n_rows} rows at:\n{output_path}')
