import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

data_base_dir = '../../datasets/Movielens/'
data_dir = data_base_dir + 'Movielens Latest/ml-latest/'
data_dir2 = data_base_dir + 'Movielens Latest/ml-latest-small/'

genome_scores = data_dir + 'genome-scores.csv'
genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
ratings = data_dir + 'ratings.csv'
tags = data_dir + 'tags.csv'

# ratings_df = pd.read_csv(ratings, usecols=range(3), dtype={'userId':np.int64, 'movieId':np.int64, 'rating':np.float64}, low_memory=False)
ratings_df = pd.read_csv(ratings, usecols=range(3))
# ratings_df = ratings_df[ratings_df['userId'].isin(range(1, 10000))]
ratings_matrix_df = ratings_df.pivot(index='userId', columns='movieId', values='rating')
print('pivot successful')