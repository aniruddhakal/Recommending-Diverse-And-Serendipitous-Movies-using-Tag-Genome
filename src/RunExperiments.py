# class Serendipity
from ContentBased_Recommender import CB_ClusteringBased_Recommender
from sklearn.metrics import pairwise_distances
import numpy as np
import pandas as pd


data_base_dir = '../../datasets/Movielens/'
# data_dir2 = data_base_dir + 'Movielens Latest/ml-latest/'
data_dir3 = data_base_dir + 'ml-20m/'
data_dir = data_base_dir + 'serendipity-sac2018/'
data_dir2 = data_dir
answers = data_dir + 'answers.csv'

data_output_dir = data_base_dir + 'output/'

# genome_scores = data_dir + 'genome-scores.csv'
genome_scores = data_dir + 'tag_genome.csv'
genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
ratings = data_dir + 'ratings.csv'
tags = data_dir + 'tags.csv'
genres = data_dir + 'u.genre'

user_unstemmed_genome_vector = data_dir3 + 'user_unstemmed_genome_terms_df_gzip'
user_stemmed_genome_vector = data_dir3 + 'user_stemmed_genome_terms_df_gzip'


def main():
    user_genome_vector_df = pd.read_pickle(user_unstemmed_genome_vector, compression='gzip')
    print(user_genome_vector_df.head())

    user_terms = user_genome_vector_df.values
    # chunked_D = pairwise_distances_chunked(user_terms, metric='cosine')

    genome_scores_df = pd.read_csv(genome_scores)
    genome_scores_df = genome_scores_df.pivot(index='movieId', columns='tagId', values='relevance')
    # genome_score_movies = genome_scores_df['movieId'].unique()
    genome_score_movies = genome_scores_df.index.unique().values

    ratings_df = pd.read_csv(ratings, usecols=range(3),
                             dtype={'userId': np.int64, 'movieId': np.int64, 'rating': np.float64}, low_memory=False)
    # only keep ratings for which the genome scores exists
    ratings_df = ratings_df[ratings_df['movieId'].isin(genome_score_movies)]

    item_terms = genome_scores_df.values
    user_terms = user_genome_vector_df.values

    item_terms = genome_scores_df.values
    item_item_distances = pairwise_distances(item_terms, metric='cosine')
    item_item_similarity_df = pd.DataFrame(item_item_distances, index=genome_scores_df.index,
                                           columns=genome_scores_df.index)

    # recommender = ContentBased_Baseline_Recommender()
    recommender = CB_ClusteringBased_Recommender(ratings_df, genome_scores_df, user_genome_vector_df,
                                                 item_item_similarity_df)
    recommended_movies = recommender.recommend_movies(1)
    print(recommended_movies)


if __name__ == '__main__':
    main()