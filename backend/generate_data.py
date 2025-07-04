import pandas as pd
import numpy as np
import os

np.random.seed(42)
n_samples = 10000
data = {
    'User_ID': range(1, n_samples + 1),
    'Age': np.random.randint(18, 70, n_samples),
    'Gender': np.random.choice(['M', 'F'], n_samples),
    'Marital_Status': np.random.choice(['Single', 'Married'], n_samples),
    'State': np.random.choice(['Delhi', 'Haryana', 'Karnataka', 'Uttar Pradesh', 'Maharashtra'], n_samples),
    'Product_Category': np.random.choice(['Electronics', 'Clothing', 'Home', 'Food'], n_samples),
    'Orders': np.random.randint(1, 10, n_samples),
    'Amount': np.random.randint(1000, 50000, n_samples)
}
df = pd.DataFrame(data)
os.makedirs('data', exist_ok=True)
df.to_csv('data/sales_data.csv', index=False)
print("Generated sales_data.csv")