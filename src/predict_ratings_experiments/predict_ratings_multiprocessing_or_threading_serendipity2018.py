import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from time import time
import warnings
import sys
from sklearn.metrics import pairwise_distances, mean_absolute_error, mean_squared_error
import multiprocessing as mp
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

import threading
import matplotlib as mpl

# mpl.interactive(False)
plt.ioff()

data_base_dir = '../../../datasets/Movielens/'
data_dir = data_base_dir + 'serendipity-sac2018/'
data_dir2 = data_base_dir + 'ml-20m/'
output_dir = data_dir + 'output/'

# genome_scores = data_dir + 'genome-scores.csv'
# genome_scores = data_dir + 'tag_genome.csv'
genome_scores = data_dir + 'mlLatestgenome-scores.csv'

genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
# ratings = data_dir + 'ratings.csv'
ratings = data_dir + 'training.csv'
tags = data_dir + 'tags.csv'
answers = data_dir + 'answers.csv'
genre_binary_terms = output_dir + 'movie_genre_binary_term_vector_df_bz2'
movies_lemmatized = output_dir + 'movies_lemmatized_genome_vector_df_bz2'

# data loading and preprocessing
target_df = pd.read_csv(genome_scores).pivot(index='movieId', columns='tagId',
                                             values='relevance')
target_df = target_df.fillna(0)
genome_scores_df = pd.DataFrame(pairwise_distances(target_df, metric='cosine'),
                                index=target_df.index,
                                columns=target_df.index)
del target_df

movies_with_genome = genome_scores_df.index.values

movies_df = pd.read_csv(movies)
movies_df = movies_df[movies_df['genres'] != '(no genres listed)']
movies_df = movies_df[movies_df['movieId'].isin(movies_with_genome)]
del movies_with_genome

all_movie_ids = movies_df['movieId'].unique()
del movies_df

ratings_df = pd.read_csv(ratings)
ratings_df = ratings_df[ratings_df['movieId'].isin(all_movie_ids)]
ratings_df = ratings_df.loc[:, ['userId', 'movieId', 'rating']]

all_user_ids = ratings_df['userId'].unique()

answers_df = pd.read_csv(answers)
count_df = answers_df.groupby('userId').count()
# count_df[count_df['movieId'] == 5]
all_answers_user_ids = count_df[count_df['movieId'] == 5].index.values


class ContentBased_Recommender:
    def __init__(self, term_vector_df, ratings_df, K=5, metric='cosine', weighted=True):
        self.term_vector_df = term_vector_df
        self.K = K
        self.ratings_df = ratings_df
        self.weighted = weighted

        # preprocessing and other calculations
        self.term_vector_df.fillna(0, inplace=True)
        self.movie_movie_distances = term_vector_df

    def get_predicted_actual(self, user_id, candidate_movie_id, user_movies, K):
        # movies watched by user
        #         if user_movies is None:
        #             user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

        # hide candidate movie from the user
        user_movies = np.setdiff1d(user_movies, candidate_movie_id)

        # load user rating for watched movies other than the candidate movie
        users_all_ratings_df = ratings_df[ratings_df['userId'] == user_id]
        users_all_ratings_df = users_all_ratings_df[
            users_all_ratings_df['movieId'].isin(user_movies)]

        # load similarities to the candidate movie
        users_all_ratings_df['sim_candidate_movie'] = self.movie_movie_distances.loc[
            candidate_movie_id, users_all_ratings_df['movieId']].values

        predicted, actual = self.predict_ratings_and_get_predicted_actual(user_id,
                                                                          candidate_movie_id,
                                                                          users_all_ratings_df, K)

        return predicted, actual

    def predict_ratings_and_get_predicted_actual(self, user_id, candidate_movie_id,
                                                 users_all_ratings_df,
                                                 K):
        user_ratings = users_all_ratings_df['rating'].values[:K]
        similarities = users_all_ratings_df['sim_candidate_movie'].values[:K]

        predicted_rating = 0
        if self.weighted:
            # weighted average
            predicted_rating = np.sum(user_ratings * similarities) / np.sum(similarities)
        else:
            # non-weighted average
            predicted_rating = np.sum(user_ratings) / len(user_ratings)

        actual_rating = self.ratings_df[(self.ratings_df['userId'] == user_id) & (
                self.ratings_df['movieId'] == candidate_movie_id)]['rating'].values[0]

        if np.isnan(predicted_rating):
            #             predicted_rating = 0
            predicted_rating = actual_rating

        # mae = mean_absolute_error([actual_rating], [predicted_rating])
        # mse = mean_squared_error([actual_rating], [predicted_rating])

        return predicted_rating, actual_rating

    def get_mae_mse(self, user_id, user_movies, K):
        # movies watched by user
        #         if user_movies is None:
        #             user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values
        predicted_rating_list = list()
        actual_rating_list = list()

        for candidate_movie_id in user_movies:
            predicted, actual = self.get_predicted_actual(user_id, candidate_movie_id, user_movies,
                                                          K)

            predicted_rating_list.append(predicted)
            actual_rating_list.append(actual)

        # calculate MSE, MAE here
        absolute = np.absolute(np.array(predicted_rating_list) - np.array(
            actual_rating_list))

        mae = np.sum(absolute) / len(predicted_rating_list)
        mse = np.sum(np.square(absolute)) / len(predicted_rating_list)

        return mae, mse


l1 = 'movies_lemmatized_threshold_'
l2 = '_float_movie_genomes_bz2'

# threshold_0.2_float_movie_genomes_bz2
l3 = 'threshold_'
l4 = '_float_movie_genomes_bz2'

thresholds = [0.25, 0.4, 0.7]
# thresholds = [0.25]

lemmatized_labels = [(l1 + str(x) + l2) for x in thresholds]

full_labels = [(l3 + str(x) + l4) for x in thresholds]

lemmatized_thresholded_dfs = list()
full_thresholded_dfs = list()

metric = 'cosine'

# load thresholded dataframes
for i, t in enumerate(thresholds):
    target_df = pd.read_pickle(output_dir + lemmatized_labels[i], compression='bz2')
    distances_df = pd.DataFrame(pairwise_distances(target_df, metric=metric), index=target_df.index,
                                columns=target_df.index)
    del target_df
    lemmatized_thresholded_dfs.append(distances_df)

    target_df = pd.read_pickle(output_dir + full_labels[i], compression='bz2')
    distances_df = pd.DataFrame(pairwise_distances(target_df, metric=metric), index=target_df.index,
                                columns=target_df.index)
    del target_df
    full_thresholded_dfs.append(distances_df)

# load term vectors
target_df = pd.read_pickle(genre_binary_terms, compression='bz2')
genre_binary_terms_df = pd.DataFrame(pairwise_distances(target_df, metric=metric),
                                     index=target_df.index,
                                     columns=target_df.index)
del target_df

target_df = pd.read_pickle(movies_lemmatized, compression='bz2')
movies_lemmatized_df = pd.DataFrame(pairwise_distances(target_df, metric=metric),
                                    index=target_df.index,
                                    columns=target_df.index)
del target_df

global_user_id = 0


def update_global_uid(uid):
    global_user_id = uid


# count_df = ratings_df.groupby('userId').count()
# # count_df.describe()
#
# # # divide user groups into 4 based on the number of movies watched by them
# user_group_1 = count_df[count_df['movieId'] <= 34].index.values
# user_group_2 = count_df[(count_df['movieId'] <= 67) & (count_df['movieId'] > 34)].index.values
# user_group_3 = count_df[(count_df['movieId'] <= 154) & (count_df['movieId'] > 67)].index.values
# user_group_4 = count_df[count_df['movieId'] > 154].index.values
#
# del count_df
#
# print(user_group_1.size)
# print(user_group_2.size)
# print(user_group_3.size)
# print(user_group_4.size)

warnings.filterwarnings('ignore')

labels = ['genre_binary', 'genome_full', 'genome_lemmatized']
all_movie_ids = genre_binary_terms_df.index.values

#     for index, K in enumerate(K_ranges):
genre_recommender = ContentBased_Recommender(genre_binary_terms_df, ratings_df,
                                             metric='jaccard', weighted=True)
genome_full_recommender = ContentBased_Recommender(genome_scores_df, ratings_df,
                                                   metric='cosine', weighted=True)
genome_lemmatized_recommender = ContentBased_Recommender(movies_lemmatized_df, ratings_df,
                                                         metric='cosine', weighted=True)

lemmatized_recommenders = list()
full_recommenders = list()

for i, t in enumerate(thresholds):
    full_recommenders.append(
        ContentBased_Recommender(full_thresholded_dfs[i], ratings_df, weighted=True))
    lemmatized_recommenders.append(
        ContentBased_Recommender(lemmatized_thresholded_dfs[i], ratings_df,
                                 weighted=True))

class RunPredictions:

    def run(this, K, ug, users_ndarray, start_range=0, end_range=None):
        print('running for K: %d' % K)
        if end_range is None:
            end_range = len(users_ndarray)

        # mae lists
        genre_mae_list = list()
        genome_full_mae_list = list()
        genome_lemmatized_mae_list = list()

        lemmatized_mae_list = list()
        full_mae_list = list()

        # mse lists
        genre_mse_list = list()
        genome_full_mse_list = list()
        genome_lemmatized_mse_list = list()

        lemmatized_mse_list = list()
        full_mse_list = list()

        for user_id in users_ndarray[start_range:end_range]:
            start_time = time()
            update_global_uid(user_id)
            print('user_id', user_id)

            # movies watched by user
            user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

            if len(user_movies) <= 1:
                continue

            mae, mse = genre_recommender.get_mae_mse(user_id, user_movies, K)
            genre_mae_list.append(mae)
            genre_mse_list.append(mse)

            mae, mse = genome_full_recommender.get_mae_mse(user_id, user_movies, K)
            genome_full_mae_list.append(mae)
            genome_full_mse_list.append(mse)

            mae, mse = genome_lemmatized_recommender.get_mae_mse(user_id, user_movies, K)
            genome_lemmatized_mae_list.append(mae)
            genome_lemmatized_mse_list.append(mse)

            for i, t in enumerate(thresholds):
                mae, mse = full_recommenders[i].get_mae_mse(user_id, user_movies, K)
                full_mae_list.append(mae)
                full_mse_list.append(mse)

                mae, mse = lemmatized_recommenders[i].get_mae_mse(user_id, user_movies, K)
                lemmatized_mae_list.append(mae)
                lemmatized_mse_list.append(mse)

            finish_time = time() - start_time
            print("Total time taken for this user: %f seconds" % finish_time)

        mae_df = pd.DataFrame()
        mae_df['genre_MAE'] = genre_mae_list
        mae_df['genome_full_MAE'] = genome_full_mae_list
        mae_df['genome_lemmatized_MAE'] = genome_lemmatized_mae_list

        mse_df = pd.DataFrame()
        mse_df['genre_MSE'] = genre_mse_list
        mse_df['genome_full_MSE'] = genome_full_mse_list
        mse_df['genome_lemmatized_MSE'] = genome_lemmatized_mse_list

        for i, t in enumerate(thresholds):
            mae_df[full_labels[i] + '_MAE'] = full_mae_list[i]
            mse_df[full_labels[i] + '_MSE'] = full_mse_list[i]

            mae_df[lemmatized_labels[i] + '_MAE'] = lemmatized_mae_list[i]
            mse_df[lemmatized_labels[i] + '_MSE'] = lemmatized_mse_list[i]

        mae_df.mean().plot(kind='barh',
                             title='K=' + str(K) + ', mean MAE, ' + ug, figsize=(20, 5))
        # figname = output_dir + 'K=' + str(K) + ', median MAE, ' + ug
        figname = './serendipity_new_genomes/' + 'K=' + str(K) + ', mean MAE, ' + ug
        plt.tight_layout()
        plt.savefig(fname=figname, dpi=150)
        mae_df.to_pickle(figname + '_df')

        # plt.clf()
        mse_df.mean().plot(kind='barh',
                             title='K=' + str(K) + ', mean MSE, ' + ug, figsize=(20, 5))

        # figname = output_dir + 'K=' + str(K) + ', median MSE, ' + ug
        figname = './serendipity_new_genomes/' + 'K=' + str(K) + ', mean MSE, ' + ug
        plt.tight_layout()
        plt.savefig(fname=figname, dpi=150)

        mse_df.to_pickle(figname + '_df')
        print("")


def run_parallel_for_users_range(ug, users_ndarray, K_ranges, start_range, end_range):
    with ProcessPoolExecutor(max_workers=4) as executor:
        # p_list = list()
        for index, K in enumerate(K_ranges):
            rp = RunPredictions()
            executor.submit(rp.run, K, ug, users_ndarray, start_range, end_range)
    #      p_list.append(e)

    #  for e in p_list:
    #      e.join()

    print("main thread")


def main():
    print("executing main method...")
    K_ranges = [10, 25, 50, 70]

    start_range = 0

    end_range = len(all_answers_user_ids)

    n_k_ranges = len(K_ranges)

    # user group
    ug = 'all_serendipity_answer_users'

    run_parallel_for_users_range(ug, all_answers_user_ids, K_ranges[:n_k_ranges], start_range, end_range)


if __name__ == '__main__':
    main()
