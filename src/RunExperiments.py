# class Serendipity
from ContentBased_Recommender import CB_ClusteringBased_Recommender, ContentBased_Baseline_Recommender, \
    BaselineRecommender_VectorType
from sklearn.metrics import pairwise_distances
import numpy as np
import pandas as pd
from DataLoaderPreprocessor import DataLoaderPreprocessor

base_dir = '../../datasets/Movielens/'

ml20m = base_dir + 'ml-20m/'
serendipity2018 = base_dir + 'serendipity-sac2018/'

data_dir2 = serendipity2018
answers = serendipity2018 + 'answers.csv'

data_output_dir = base_dir + 'output/'


def main():
    dataset = 'ml20m'
    data_loader = DataLoaderPreprocessor(base_dir=base_dir, ml20m='ml-20m/',
                                         serendipity2018='serendipity-sac2018/')
    ratings_df, genome_scores_df, movies_df = data_loader.load_and_preprocess_data(dataset)

    # movie_genre_binary_terms_df, movies_genome_term_vector_df, user_int_genre_terms_df,\
    # user_lemmatized_genome_terms_df, user_full_genome_terms_df \

    user_id = 1
    K = 20

    movie_genre_binary_terms_df, movies_lemmatized_genome_term_vector_df,\
    user_int_genre_terms_df, user_genre_binary_term_vector_df, user_lemmatized_genome_terms_df, user_full_genome_terms_df \
        = data_loader.load_and_process_user_data(dataset)

    item_terms = movies_lemmatized_genome_term_vector_df.values
    item_item_distances = pairwise_distances(item_terms, metric='cosine')
    item_item_similarity_df = pd.DataFrame(item_item_distances, index=movies_lemmatized_genome_term_vector_df.index,
                                           columns=movies_lemmatized_genome_term_vector_df.index)
    recommender_lemmatized = CB_ClusteringBased_Recommender(ratings_df, movies_lemmatized_genome_term_vector_df,
                                                 user_lemmatized_genome_terms_df,
                                                 item_item_similarity_df)

    recommended_movies = recommender_lemmatized.recommend_movies(user_id, K=K)
    print("\nMain Model Lemmatized results:\n", recommended_movies)

    item_terms = genome_scores_df.values
    item_item_distances = pairwise_distances(item_terms, metric='cosine')
    item_item_similarity_df = pd.DataFrame(item_item_distances, index=genome_scores_df.index,
                                           columns=genome_scores_df.index)

    recommender_full = CB_ClusteringBased_Recommender(ratings_df, genome_scores_df,
                                                 user_full_genome_terms_df,
                                                 item_item_similarity_df)

    recommended_movies = recommender_full.recommend_movies(user_id, K=K)
    print("\nMain Model full-genome results:\n", recommended_movies)

    # vector_type = BaselineRecommender_VectorType.GENOME_FULL

    arr = ['genre_binary:\n', 'genre_integer:\n', 'genome_lemmatized:\n', 'genome_full:\n']
    for vector_type in [BaselineRecommender_VectorType.GENRE_BINARY, BaselineRecommender_VectorType.GENRE_INTEGER, BaselineRecommender_VectorType.GENOME_LEMMATIZED, BaselineRecommender_VectorType.GENOME_FULL]:
    # baseline_recommender = ContentBased_Baseline_Recommender(dataset):
        baseline_recommender = ContentBased_Baseline_Recommender(dataset, movie_genre_binary_terms_df, movies_lemmatized_genome_term_vector_df,
                     user_int_genre_terms_df, user_genre_binary_term_vector_df,
                     user_lemmatized_genome_terms_df, user_full_genome_terms_df, ratings_df,
                     genome_scores_df, movies_df)
        result = baseline_recommender.recommend_k_most_similar_movies(user_id, K, vector_type=vector_type)
        print(arr[vector_type - 1], result)


if __name__ == '__main__':
    main()
