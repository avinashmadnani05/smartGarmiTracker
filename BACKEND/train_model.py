# train_model.py

from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import joblib
import numpy as np
from simulate import generate_dummy_data

# Generate dummy data
data = generate_dummy_data()

# Features and target
X = data[['avg_temp', 'vegetation_index', 'pollution_level']]
y = data['uhi_severity']

# Split into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Initialize and train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save the trained model
joblib.dump(model, 'uhi_model.pkl')
print("Model trained and saved as 'uhi_model.pkl'")

# Define the predict_uhi function
def predict_uhi(avg_temp, vegetation_index, pollution_level):
    """
    Predict UHI severity based on input features.
    """
    features = np.array([[avg_temp, vegetation_index, pollution_level]])
    prediction = model.predict(features)
    return prediction[0]
