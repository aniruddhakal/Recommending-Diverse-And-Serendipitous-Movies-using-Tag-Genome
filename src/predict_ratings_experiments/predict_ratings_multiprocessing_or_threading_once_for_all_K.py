import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from time import time
import warnings
import sys
from sys import stdout
from sklearn.metrics import pairwise_distances, mean_absolute_error, mean_squared_error
import multiprocessing as mp
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

import threading
import matplotlib as mpl

# mpl.interactive(False)
plt.ioff()

print("total arguments: ", len(sys.argv))

if len(sys.argv) < 5:
    raise ValueError('Correct args: ug1 start_index end_index N_K_neighbour_ranges')

data_base_dir = '../../../datasets/Movielens/'
data_dir2 = data_base_dir + 'serendipity-sac2018/'
data_dir = data_base_dir + 'ml-20m/'
output_dir = data_dir + 'output2/'

genome_scores = data_dir + 'genome-scores.csv'
# genome_scores = data_dir + 'tag_genome.csv'
genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
ratings = data_dir + 'ratings.csv'
# ratings = data_dir + 'training.csv'
tags = data_dir + 'tags.csv'
# answers = data_dir + 'answers.csv'
genre_binary_terms = output_dir + 'movie_genre_binary_term_vector_df_bz2'
movies_lemmatized = output_dir + 'movies_lemmatized_genome_vector_df_bz2'

# data loading and preprocessing
target_df = pd.read_csv(genome_scores).pivot(index='movieId', columns='tagId',
                                             values='relevance')
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


class ContentBased_Recommender:
    def __init__(self, term_vector_df, ratings_df, K=5, metric='cosine', weighted=True):
        self.term_vector_df = term_vector_df
        self.K = K
        self.ratings_df = ratings_df
        self.weighted = weighted

        # preprocessing and other calculations
        self.term_vector_df.fillna(0, inplace=True)
        self.movie_movie_distances = term_vector_df

    def get_predicted_rating(self, user_id, candidate_movie_id, user_movies, K_ranges):
        # movies watched by user
        #         if user_movies is None:
        #             user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

        # hide candidate movie from the user
        u_movies = np.setdiff1d(user_movies, candidate_movie_id)

        # load user rating for watched movies other than the candidate movie
        # user_ratings =
        users_all_ratings_df = ratings_df[ratings_df['userId'] == user_id]
        users_all_ratings_df = users_all_ratings_df[
            users_all_ratings_df['movieId'].isin(u_movies)]

        # load similarities to the candidate movie
        users_all_ratings_df['sim_candidate_movie'] = self.movie_movie_distances.loc[
            candidate_movie_id, users_all_ratings_df['movieId']].values

        predicted_dict = dict()

        for K in K_ranges:
            predicted = self.predict_ratings(user_id,
                                             candidate_movie_id,
                                             users_all_ratings_df,
                                             K)
            predicted_dict[K] = predicted

        return predicted_dict

    def predict_ratings(self, user_id, candidate_movie_id,
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

        if np.isnan(predicted_rating):
            #             predicted_rating = 0
            print("Warning! Predicted NaN for user: ", user_id, ', candidate movie: ',
                  candidate_movie_id, '\nReplacing with 0.')
            predicted_rating = 0

        return predicted_rating

    def get_mae_mse(self, user_id, user_movies, K_ranges):
        t_futures = list()
        with ThreadPoolExecutor(max_workers=7) as t_pool:
            for candidate_movie_id in user_movies:
                # predicted, actual = self.get_predicted_actual(user_id, candidate_movie_id, user_movies,
                #                                               K)
                t_future = t_pool.submit(self.get_predicted_rating, user_id, candidate_movie_id,
                                         user_movies, K_ranges)

                t_futures.append(t_future)

        predicted_ratings_dict_list = list()

        # collect all prediction and actual dictionaries
        for t_future in t_futures:
            predicted_ratings_dict_list.append(t_future.result())

        k_predicted_ratings_list_dict = dict()

        for K in K_ranges:
            k_predicted_ratings_list_dict[K] = list()

        for d in predicted_ratings_dict_list:
            for K in K_ranges:
                # existing_list = k_predicted_ratings_list_dict[K]
                # existing_list.append(d[K])
                k_predicted_ratings_list_dict[K].append(d[K])

                # k_predicted_ratings_list_dict[K] = existing_list

        # load actual ratings only here rather than loading every time inside
        #  get_predicted_actual method
        actual_ratings = self.ratings_df[(self.ratings_df['userId'] == user_id) & (
            self.ratings_df['movieId'].isin(user_movies))]['rating'].values

        k_mae_dict = dict()
        k_mse_dict = dict()

        for K in K_ranges:
            predicted_rating_list = k_predicted_ratings_list_dict[K]

            # calculate MSE, MAE here
            absolute = np.absolute(np.array(predicted_rating_list) - actual_ratings)

            mae = np.sum(absolute) / len(predicted_rating_list)
            mse = np.sum(np.square(absolute)) / len(predicted_rating_list)

            k_mae_dict[K] = mae
            k_mse_dict[K] = mse

        return k_mae_dict, k_mse_dict


l1 = 'movies_lemmatized_threshold_'
l2 = '_float_movie_genomes_bz2'

# threshold_0.2_float_movie_genomes_bz2
l3 = 'threshold_'
l4 = '_float_movie_genomes_bz2'

# thresholds = [0.25, 0.4, 0.7]
thresholds = [0.4]

lemmatized_labels = [(l1 + str(x) + l2) for x in thresholds]

full_labels = [(l3 + str(x) + l4) for x in thresholds]

lemmatized_thresholded_dfs = list()
full_thresholded_dfs = list()

metric = 'cosine'

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


def update_progress(user_id, user_ids):
    progress = (np.where(user_ids == user_id)[0][0] + 1) / (len(user_ids))
    stdout.write('\rProgress: %f %%' % (progress * 100))
    stdout.flush()


count_df = ratings_df.groupby('userId').count()
# count_df.describe()

# # divide user groups into 4 based on the number of movies watched by them
user_group_1 = count_df[count_df['movieId'] <= 34].index.values
user_group_2 = count_df[(count_df['movieId'] <= 67) & (count_df['movieId'] > 34)].index.values
user_group_3 = count_df[(count_df['movieId'] <= 154) & (count_df['movieId'] > 67)].index.values
user_group_4 = count_df[count_df['movieId'] > 154].index.values

del count_df

print(user_group_1.size)
print(user_group_2.size)
print(user_group_3.size)
print(user_group_4.size)

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
    def update_mae_mse_list_dict(this, K_ranges, k_mae_dict, k_mse_dict, target_mae_list_dict,
                                 target_mse_list_dict):
        for K in K_ranges:
            if K not in target_mae_list_dict or K not in target_mse_list_dict:
                target_mae_list_dict[K] = list()
                target_mse_list_dict[K] = list()

            target_mae_list_dict[K].append(k_mae_dict[K])
            target_mse_list_dict[K].append(k_mse_dict[K])

    def run(this, K_ranges, ug, users_ndarray, start_range=0, end_range=None):
        print('running for K: ', K_ranges)
        if end_range is None:
            end_range = len(users_ndarray)

        # mae lists
        genre_mae_list_dict = dict()
        genome_full_mae_list_dict = dict()
        genome_lemmatized_mae_list_dict = dict()

        lemmatized_mae_list_dict = dict()
        full_mae_list_dict = dict()

        # mse lists
        genre_mse_list_dict = dict()
        genome_full_mse_list_dict = dict()
        genome_lemmatized_mse_list_dict = dict()

        lemmatized_mse_list_dict = dict()
        full_mse_list_dict = dict()

        user_ids = users_ndarray[start_range:end_range]
        for user_id in user_ids:
            start_time = time()
            # update_global_uid(user_id)
            update_progress(user_id, user_ids)
            # print('user_id', user_id)

            # movies watched by user
            user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

            if len(user_movies) <= 1:
                print("skipping user %d, because they've watched less movies" % user_id)
                continue

            k_mae_dict, k_mse_dict = genre_recommender.get_mae_mse(user_id, user_movies, K_ranges)
            this.update_mae_mse_list_dict(K_ranges, k_mae_dict, k_mse_dict, genre_mae_list_dict,
                                          genre_mse_list_dict)

            k_mae_dict, k_mse_dict = genome_full_recommender.get_mae_mse(user_id, user_movies,
                                                                         K_ranges)
            this.update_mae_mse_list_dict(K_ranges, k_mae_dict, k_mse_dict,
                                          genome_full_mae_list_dict,
                                          genome_full_mse_list_dict)

            k_mae_dict, k_mse_dict = genome_lemmatized_recommender.get_mae_mse(user_id, user_movies,
                                                                               K_ranges)
            this.update_mae_mse_list_dict(K_ranges, k_mae_dict, k_mse_dict,
                                          genome_lemmatized_mae_list_dict,
                                          genome_lemmatized_mse_list_dict)

            for i, t in enumerate(thresholds):
                k_mae_dict, k_mse_dict = full_recommenders[i].get_mae_mse(user_id, user_movies,
                                                                          K_ranges)
                this.update_mae_mse_list_dict(K_ranges, k_mae_dict, k_mse_dict,
                                              full_mae_list_dict,
                                              full_mse_list_dict)
                # TODO - because this logic does not account for multiple thresholds,
                #  considering single threshold only
                # full_mae_list.append(mae)
                # full_mse_list.append(mse)

                k_mae_dict, k_mse_dict = lemmatized_recommenders[i].get_mae_mse(user_id,
                                                                                user_movies,
                                                                                K_ranges)
                this.update_mae_mse_list_dict(K_ranges, k_mae_dict, k_mse_dict,
                                              lemmatized_mae_list_dict,
                                              lemmatized_mse_list_dict)
                # lemmatized_mae_list.append(mae)
                # lemmatized_mse_list.append(mse)

            finish_time = time() - start_time
            # TODO time taken per user
            # print("Total time taken for this user: %f seconds" % finish_time)

        for K in K_ranges:
            mae_df = pd.DataFrame()
            mae_df['genre_MAE'] = genre_mae_list_dict[K]
            mae_df['genome_full_MAE'] = genome_full_mae_list_dict[K]
            mae_df['genome_lemmatized_MAE'] = genome_lemmatized_mae_list_dict[K]

            mse_df = pd.DataFrame()
            mse_df['genre_MSE'] = genre_mse_list_dict[K]
            mse_df['genome_full_MSE'] = genome_full_mse_list_dict[K]
            mse_df['genome_lemmatized_MSE'] = genome_lemmatized_mse_list_dict[K]

            for i, t in enumerate(thresholds):
                mae_df[full_labels[i] + '_MAE'] = full_mae_list_dict[K]
                mse_df[full_labels[i] + '_MSE'] = full_mse_list_dict[K]

                mae_df[lemmatized_labels[i] + '_MAE'] = lemmatized_mae_list_dict[K]
                mse_df[lemmatized_labels[i] + '_MSE'] = lemmatized_mse_list_dict[K]

            mae_df.mean().plot(kind='barh',
                               title='K=' + str(K) + ', mean MAE, ' + ug, figsize=(20, 5))
            # figname = output_dir + 'K=' + str(K) + ', median MAE, ' + ug
            figname = './first1000_run3/' + 'K=' + str(K) + ', mean MAE, ' + ug
            plt.tight_layout()
            plt.savefig(fname=figname, dpi=150)
            # plt.show()
            mae_df.to_pickle(figname + '_df')

            # plt.clf()
            mse_df.mean().plot(kind='barh',
                               title='K=' + str(K) + ', mean MSE, ' + ug, figsize=(20, 5))

            # figname = output_dir + 'K=' + str(K) + ', median MSE, ' + ug
            figname = './first1000_run3/' + 'K=' + str(K) + ', mean MSE, ' + ug
            plt.tight_layout()
            plt.savefig(fname=figname, dpi=150)
            # plt.show()

            mse_df.to_pickle(figname + '_df')
            print("")


def run_parallel_for_users_range(ug, users_ndarray, K_ranges, start_range, end_range):
    start_time = time()
    # with ProcessPoolExecutor(max_workers=2) as executor:
    #     for index, K in enumerate(K_ranges):
    rp = RunPredictions()
    # TODO uncomment to run on Multiple Processors
    # executor.submit(rp.run, K, ug, users_ndarray, start_range, end_range)
    rp.run(K_ranges, ug, users_ndarray, start_range=start_range, end_range=end_range)

    finish_time = time() - start_time
    print("Total time taken: %f seconds" % finish_time)
    print("main thread...!")


def main():
    print("executing main method...")
    K_ranges = [10, 25, 50, 70]

    start_range = int(sys.argv[2])

    end_range = int(sys.argv[3])

    n_k_ranges = int(sys.argv[4])

    # user group
    ug = sys.argv[1]
    user_group = user_group_1

    if ug == 'ug2':
        print(ug)
        user_group = user_group_2
    elif ug == 'ug3':
        print(ug)
        user_group = user_group_3
    elif ug == 'ug4':
        print(ug)
        user_group = user_group_4

    # end_range = len(user_group)

    run_parallel_for_users_range(ug, user_group, K_ranges[:n_k_ranges], start_range, end_range)


if __name__ == '__main__':
    main()
