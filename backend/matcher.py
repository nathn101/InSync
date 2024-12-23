import pandas as pd
import numpy as np
import matplotlib as plt
import sklearn as sk
import seaborn as sns
import warnings

warnings.simplefilter(action='ignore', category=FutureWarning)

ratings_path = 'test_matching_data.xlsx'
genres_path = 'test_genres.xlsx'

# Load the data
ratings = pd.read_excel(ratings_path)
genres = pd.read_excel(genres_path)

print(ratings.head())
print(genres.head())

n_ratings = len(ratings)
n_genres = len(ratings['genre_id'].unique())
n_users = len(ratings['user_id'].unique())

print(f"Number of ratings: {n_ratings}")
print(f"Number of unique genres: {n_genres}")
print(f"Number of unique users: {n_users}")
print(f"Average ratings per user: {round(n_ratings/n_users, 2)}")
print(f"Average ratings per movie: {round(n_ratings/n_genres, 2)}")
