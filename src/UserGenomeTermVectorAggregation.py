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


def main():
    stemmed = 'stemmed'
    unstemmed = 'unstemmed'

    option = unstemmed

    if option == stemmed:
        target_file = 'user_stemmed_genome_terms_df_gzip'
    else:
        target_file = 'user_unstemmed_genome_terms_df_gzip'

    ratings_df = pd.read_csv(ratings, usecols=range(3),
                             dtype={'userId': np.int32, 'movieId': np.int32, 'rating': np.float64}, low_memory=False)
    movies_df = pd.read_csv(movies)
    all_user_ids = ratings_df['userId'].unique()
    all_movie_ids = movies_df[movies_df['genres'] != '(no genres listed)']['movieId'].unique()

    genome_scores_df = pd.read_csv(genome_scores)
    genome_scores_df = genome_scores_df[genome_scores_df['movieId'].isin(all_movie_ids)]

    file_name = "movies_genome_vector.csv"
    if option == stemmed:
        genomes_term_vector_df = pd.read_csv(data_dir + file_name, index_col=0)
    else:
        genomes_term_vector_df = genome_scores_df.pivot(index='movieId', columns='tagId', values='relevance')

    no_genre_movies = movies_df[movies_df['genres'] == '(no genres listed)']['movieId'].unique()

    # omit movies where value is (no genres listed)
    movies_with_genre = np.setdiff1d(ratings_df['movieId'].unique(), no_genre_movies)
    ratings_df = ratings_df[ratings_df['movieId'].isin(movies_with_genre)]

    def generate_user_genome_terms(user_id):
        user_id % 1000 == 0 and print(user_id)
        users_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

        return genomes_term_vector_df.loc[users_movies].mean()

    user_genome_terms_df = pd.DataFrame(index=all_user_ids)
    user_genome_terms_df[0] = ''

    start = time()
    user_genome_terms_df = user_genome_terms_df.apply(lambda x: generate_user_genome_terms(x.name), axis=1)
    finish = time() - start
    print("Total Time %s seconds" % str(finish))

    # save pickle file
    user_genome_terms_df.to_pickle(data_dir + target_file, compression='gzip')
    print(user_genome_terms_df.head())


if __name__ == '__main__':
    main()
