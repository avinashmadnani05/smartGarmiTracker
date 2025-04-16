# dummy_data_generator.py

import numpy as np
import pandas as pd

def generate_dummy_data(num_samples=100):
    """
    Generate dummy environmental data for UHI prediction.
    """
    np.random.seed(42)  # For reproducibility

    avg_temp = np.random.normal(loc=30, scale=5, size=num_samples)  # Average temperature
    vegetation_index = np.random.uniform(low=0.0, high=1.0, size=num_samples)  # NDVI
    pollution_level = np.random.normal(loc=60, scale=15, size=num_samples)  # PM2.5 levels

    # Simulate UHI severity as a function of the above features
    uhi_severity = (
        0.5 * (avg_temp - 25) / 10 - 0.3 * vegetation_index + 0.2 * (pollution_level - 50) / 20
    )
    uhi_severity = np.clip(uhi_severity, 0, 1)  # Ensure values are between 0 and 1

    data = pd.DataFrame({
        'avg_temp': avg_temp,
        'vegetation_index': vegetation_index,
        'pollution_level': pollution_level,
        'uhi_severity': uhi_severity
    })

    return data

# Example usage
if __name__ == "__main__":
    dummy_data = generate_dummy_data()
    print(dummy_data.head())
