import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import pairwise_distances_chunked
from sklearn.metrics import pairwise_distances
from time import time

data_base_dir = '../../datasets/Movielens/'
data_dir2 = data_base_dir + 'Movielens Latest/ml-latest/'
data_dir = data_base_dir + 'ml-20m/'

genome_scores = data_dir + 'genome-scores.csv'
genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
ratings = data_dir + 'ratings.csv'
tags = data_dir + 'tags.csv'
genres = data_dir + 'u.genre'

user_unstemmed_genome_vector = data_dir + 'user_unstemmed_genome_terms_df_gzip'
user_stemmed_genome_vector = data_dir + 'user_stemmed_genome_terms_df_gzip'

class ContentBasedRecommender:


    def __init__(self):
        pass


def main():
    user_genome_vector_df = pd.read_pickle(user_unstemmed_genome_vector, compression='gzip')
    print(user_genome_vector_df.head())

    user_terms = user_genome_vector_df.values
    # chunked_D = pairwise_distances_chunked(user_terms, metric='cosine')

    genome_scores_df = pd.read_csv(genome_scores)
    genome_scores_df = genome_scores_df.pivot(index='movieId', columns='tagId', values='relevance')

    item_terms = genome_scores_df.values
    user_terms = user_genome_vector_df.values

    item_terms = genome_scores_df.values
    item_item_distances = pairwise_distances(item_terms, metric='cosine')

    item_user_df = pd.DataFrame()

    chunked_D = pairwise_distances_chunked(item_terms, user_terms, metric='cosine')
    for ch in chunked_D:
    # print(ch.shape)
    #     ser = pd.Series(ch)
        df = pd.DataFrame(ch)
        item_user_df = item_user_df.append(df, ignore_index=True)

    print(item_user_df.head())
    print("wait")




if __name__ == '__main__':
    main()
