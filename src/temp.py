import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from time import time
import swifter

data_base_dir = '../../datasets/Movielens/'
data_dir2 = data_base_dir + 'Movielens Latest/ml-latest/'
data_dir = data_base_dir + 'ml-20m/'

genome_scores = data_dir2 + 'genome-scores.csv'
genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
ratings = data_dir + 'ratings.csv'
tags = data_dir + 'tags.csv'
genres = data_dir + 'u.genre'
user_genome_terms_df = pd.read_pickle(data_dir + 'user_stemmed_genome_terms_df_gzip', compression='gzip')
print(user_genome_terms_df)