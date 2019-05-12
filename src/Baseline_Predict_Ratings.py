import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.metrics import pairwise_distances
from sklearn.metrics import mean_absolute_error, mean_squared_error

data_base_dir = '../../../datasets/Movielens/'
data_dir = data_base_dir + 'serendipity-sac2018/'
data_dir2 = data_base_dir + 'ml-20m/'
output_dir = data_dir + 'output/'

# genome_scores = data_dir + 'genome_scores.csv'
genome_scores = data_dir + 'tag_genome.csv'
# genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
# ratings = data_dir + 'ratings.csv'
ratings = data_dir + 'training.csv'
# tags = data_dir + 'tags.csv'
answers = data_dir + 'answers.csv'
genre_binary_terms = output_dir + 'movie_genre_binary_term_vector_df_bz2'
movies_lemmatized = output_dir + 'movies_lemmatized_genome_vector_df_bz2'


class ContentBased_Recommender:
    def __init__(self, term_vector_df, ratings_df, K=5, metric='cosine'):
        self.term_vector_df = term_vector_df
        self.K = K
        self.ratings_df = ratings_df

        # preprocessing and other calculations
        self.term_vector_df.fillna(0, inplace=True)
        self.movie_movie_distances = pd.DataFrame(
            pairwise_distances(self.term_vector_df, metric=metric), index=self.term_vector_df.index,
            columns=self.term_vector_df.index)

    def get_mae_mse(self, user_id, candidate_movie_id, user_movies, K=None, weighted=True):
        # movies watched by user
        #         if user_movies is None:
        #             user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

        # hide candidate movie from the user
        user_movies = np.setdiff1d(user_movies, candidate_movie_id)

        # load user rating for watched movies other than the candidate movie
        # user_ratings =
        users_all_ratings_df = self.ratings_df[self.ratings_df['userId'] == user_id]
        users_all_ratings_df = users_all_ratings_df[
            users_all_ratings_df['movieId'].isin(user_movies)]

        # load similarities to the candidate movie
        users_all_ratings_df['sim_candidate_movie'] = self.movie_movie_distances.loc[
            candidate_movie_id, users_all_ratings_df['movieId']].values[0]

        mae, mse = self.predict_ratings_and_get_mae_mse(user_id, candidate_movie_id,
                                                        users_all_ratings_df, K)

        return mae, mse

    def get_mae_mse_forKRange(self, user_id, candidate_movie_id, user_movies, weighted=True):
        # movies watched by user
        #         if user_movies is None:
        #             user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

        # hide candidate movie from the user
        user_movies = np.setdiff1d(user_movies, candidate_movie_id)

        # load user rating for watched movies other than the candidate movie
        # user_ratings =
        users_all_ratings_df = self.ratings_df[self.ratings_df['userId'] == user_id]
        users_all_ratings_df = users_all_ratings_df[
            users_all_ratings_df['movieId'].isin(user_movies)]

        # load similarities to the candidate movie
        users_all_ratings_df['sim_candidate_movie'] = self.movie_movie_distances.loc[
            candidate_movie_id, users_all_ratings_df['movieId']].values[0]

        mae_dict = dict()
        mse_dict = dict()

        for k in self.K:
            # TODO can fork from here, fork the below method
            mae, mse = self.predict_ratings_and_get_mae_mse(user_id, candidate_movie_id,
                                                            users_all_ratings_df, k, weighted)

            mae_dict[k] = mae
            mse_dict[k] = mse

        return mae_dict, mse_dict

    def predict_ratings_and_get_mae_mse(self, user_id, candidate_movie_id, users_all_ratings_df,
                                        K=5, weighted=True):
        user_ratings = users_all_ratings_df['rating'].values[:K]
        similarities = users_all_ratings_df['sim_candidate_movie'].values[:K]

        predicted_rating = 0
        if weighted:
            # weighted average
            predicted_rating = np.sum(user_ratings * similarities) / np.sum(similarities)
        else:
            # non-weighted average
            predicted_rating = np.sum(user_ratings) / len(user_ratings)

        actual_rating = self.ratings_df[(self.ratings_df['userId'] == user_id) & (
                self.ratings_df['movieId'] == candidate_movie_id)]['rating'].values[0]

        if np.isnan(predicted_rating):
            predicted_rating = 0

        mae = mean_absolute_error([actual_rating], [predicted_rating])
        mse = mean_squared_error([actual_rating], [predicted_rating])

        return mae, mse

    def get_average_mae_mse(self, user_id, user_movies, K=None, weighted=True):
        # movies watched by user
        #         if user_movies is None:
        #             user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

        mae_list = list()
        mse_list = list()

        for candidate_movie_id in user_movies:
            mae, mse = self.get_mae_mse(user_id, candidate_movie_id, user_movies, K, weighted)

            mae_list.append(mae)
            mse_list.append(mse)

        return np.array(mae_list).mean(), np.array(mse_list).mean()

    def get_average_mae_mse_forKRange(self, user_id, user_movies, weighted=True):
        # movies watched by user
        #         if user_movies is None:
        #             user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

        # mae_list = list()
        # mse_list = list()

        mae_dict = dict()
        mse_dict = dict()

        # each k will have its own mae and mse list dictionaries
        for k in self.K:
            mae_dict[k] = list()
            mse_dict[k] = list()

        for candidate_movie_id in user_movies:
            mae_d, mse_d = self.get_mae_mse_forKRange(user_id, candidate_movie_id, user_movies,
                                                      weighted)

            # update mae and mse for each k from mae_d and mse_d into their respective lists in
            # mae_dict and mse_dict
            for k in self.K:
                mae_list = mae_dict[k]
                mae_list.append(mae_d[k])
                mae_dict[k] = mae_list

                mse_list = mse_dict[k]
                mse_list.append(mse_d[k])
                mse_dict[k] = mse_list

        # average lists of all mae and mse for all k
        for k in self.K:
            mae_dict[k] = np.array(mae_dict[k]).mean()
            mse_dict[k] = np.array(mse_dict[k]).mean()

        return mae_dict, mse_dict


def main():
    l1 = 'movies_lemmatized_threshold_'
    l2 = '_float_movie_genomes_bz2'

    # threshold_0.2_float_movie_genomes_bz2
    l3 = 'threshold_'
    l4 = '_float_movie_genomes_bz2'
    thresholds = [0.25, 0.4, 0.7]

    lemmatized_labels = [(l1 + str(x) + l2) for x in thresholds]

    full_labels = [(l3 + str(x) + l4) for x in thresholds]

    # loading all required data
    user_full_genome_terms_df = pd.read_pickle(output_dir + 'user_full_genome_terms_df_bz2',
                                               compression='bz2')
    user_full_genome_terms_gzip_df = pd.read_pickle(output_dir + 'user_full_genome_terms_df_gzip',
                                                    compression='bz2')

    lemmatized_thresholded_dfs = list()
    full_thresholded_dfs = list()

    for i, t in enumerate(thresholds):
        lemmatized_thresholded_dfs.append(
            pd.read_pickle(output_dir + lemmatized_labels[i], compression='bz2'))
        full_thresholded_dfs.append(
            pd.read_pickle(output_dir + lemmatized_labels[i], compression='bz2'))

    # load term vectors
    genre_binary_terms_df = pd.read_pickle(genre_binary_terms, compression='bz2')
    movies_lemmatized_df = pd.read_pickle(movies_lemmatized, compression='bz2')

    import matplotlib.pyplot as plt
    from time import time

    labels = ['genre_binary', 'genome_full', 'genome_lemmatized']
    all_movie_ids = genre_binary_terms_df.index.values

    K_ranges = [5, 10, 15, 20, 30, 40, 50]

    for index, K in enumerate(K_ranges):
        genre_recommender = ContentBased_Recommender(genre_binary_terms_df, ratings_df, K,
                                                     'jaccard')
        genome_full_recommender = ContentBased_Recommender(genome_scores_df, ratings_df, K,
                                                           'cosine')
        genome_lemmatized_recommender = ContentBased_Recommender(movies_lemmatized_df, ratings_df,
                                                                 K,
                                                                 'cosine')

        lemmatized_recommenders = list()
        full_recommenders = list()
        for i, t in enumerate(thresholds):
            full_recommenders.append(
                ContentBased_Recommender(full_thresholded_dfs[i], ratings_df, K))
            lemmatized_recommenders.append(
                ContentBased_Recommender(lemmatized_thresholded_dfs[i], ratings_df, K))

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

        for user_id in all_answers_user_ids[3:5]:
            start_time = time()
            print('user_id', user_id)

            # movies watched by user
            user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

            mae, mse = genre_recommender.get_average_mae_mse(user_id, user_movies, K=None,
                                                             weighted=True)
            genre_mae_list.append(mae)
            genre_mse_list.append(mse)

            mae, mse = genome_full_recommender.get_average_mae_mse(user_id, user_movies, K=None,
                                                                   weighted=True)
            genome_full_mae_list.append(mae)
            genome_full_mse_list.append(mse)

            mae, mse = genome_lemmatized_recommender.get_average_mae_mse(user_id, user_movies,
                                                                         K=None,
                                                                         weighted=True)
            genome_lemmatized_mae_list.append(mae)
            genome_lemmatized_mse_list.append(mse)

            for i, t in enumerate(thresholds):
                mae, mse = full_recommenders[i].get_average_mae_mse(user_id, user_movies, K=None,
                                                                    weighted=True)
                full_mae_list.append(mae)
                full_mse_list.append(mse)

                mae, mse = lemmatized_recommenders[i].get_average_mae_mse(user_id, user_movies,
                                                                          K=None,
                                                                          weighted=True)
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
                           title='K=' + str(K) + ', avg MAE across all users, for all movies')
        plt.show()
        mse_df.mean().plot(kind='barh',
                           title='K=' + str(K) + ', avg MSE across all users, for all movies')
        plt.show()


def main2():
    l1 = 'movies_lemmatized_threshold_'
    l2 = '_float_movie_genomes_bz2'

    # threshold_0.2_float_movie_genomes_bz2
    l3 = 'threshold_'
    l4 = '_float_movie_genomes_bz2'
    thresholds = [0.25, 0.4, 0.7]

    lemmatized_labels = [(l1 + str(x) + l2) for x in thresholds]

    full_labels = [(l3 + str(x) + l4) for x in thresholds]

    # loading all required data
    user_full_genome_terms_df = pd.read_pickle(output_dir + 'user_full_genome_terms_df_bz2',
                                               compression='bz2')
    user_full_genome_terms_gzip_df = pd.read_pickle(output_dir + 'user_full_genome_terms_df_gzip',
                                                    compression='bz2')

    lemmatized_thresholded_dfs = list()
    full_thresholded_dfs = list()

    for i, t in enumerate(thresholds):
        lemmatized_thresholded_dfs.append(
            pd.read_pickle(output_dir + lemmatized_labels[i], compression='bz2'))
        full_thresholded_dfs.append(
            pd.read_pickle(output_dir + lemmatized_labels[i], compression='bz2'))

    # load term vectors
    genre_binary_terms_df = pd.read_pickle(genre_binary_terms, compression='bz2')
    movies_lemmatized_df = pd.read_pickle(movies_lemmatized, compression='bz2')

    import matplotlib.pyplot as plt
    from time import time

    labels = ['genre_binary', 'genome_full', 'genome_lemmatized']
    all_movie_ids = genre_binary_terms_df.index.values

    K_ranges = [5, 10, 15, 20, 30, 40, 50]

    for index, K in enumerate(K_ranges):
        genre_recommender = ContentBased_Recommender(genre_binary_terms_df, ratings_df, K,
                                                     'jaccard')
        genome_full_recommender = ContentBased_Recommender(genome_scores_df, ratings_df, K,
                                                           'cosine')
        genome_lemmatized_recommender = ContentBased_Recommender(movies_lemmatized_df, ratings_df,
                                                                 K,
                                                                 'cosine')

        lemmatized_recommenders = list()
        full_recommenders = list()
        for i, t in enumerate(thresholds):
            full_recommenders.append(
                ContentBased_Recommender(full_thresholded_dfs[i], ratings_df, K))
            lemmatized_recommenders.append(
                ContentBased_Recommender(lemmatized_thresholded_dfs[i], ratings_df, K))

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

        for user_id in all_answers_user_ids[3:5]:
            start_time = time()
            print('user_id', user_id)

            # movies watched by user
            user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

            mae, mse = genre_recommender.get_average_mae_mse(user_id, user_movies, K=None,
                                                             weighted=True)
            genre_mae_list.append(mae)
            genre_mse_list.append(mse)

            mae, mse = genome_full_recommender.get_average_mae_mse(user_id, user_movies, K=None,
                                                                   weighted=True)
            genome_full_mae_list.append(mae)
            genome_full_mse_list.append(mse)

            mae, mse = genome_lemmatized_recommender.get_average_mae_mse(user_id, user_movies,
                                                                         K=None,
                                                                         weighted=True)
            genome_lemmatized_mae_list.append(mae)
            genome_lemmatized_mse_list.append(mse)

            for i, t in enumerate(thresholds):
                mae, mse = full_recommenders[i].get_average_mae_mse(user_id, user_movies, K=None,
                                                                    weighted=True)
                full_mae_list.append(mae)
                full_mse_list.append(mse)

                mae, mse = lemmatized_recommenders[i].get_average_mae_mse(user_id, user_movies,
                                                                          K=None,
                                                                          weighted=True)
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
                           title='K=' + str(K) + ', avg MAE across all users, for all movies')
        plt.show()
        mse_df.mean().plot(kind='barh',
                           title='K=' + str(K) + ', avg MSE across all users, for all movies')
        plt.show()


def init_mae_mse_df_dict(the_mae_dict=None, the_mse_dict=None, K_ranges=None):
    the_mae_dict = dict()
    the_mse_dict = dict()

    for k in K_ranges:
        the_mae_dict[k] = pd.DataFrame()
        the_mse_dict[k] = pd.DataFrame()

    return the_mae_dict, the_mse_dict


def main3():
    l1 = 'movies_lemmatized_threshold_'
    l2 = '_float_movie_genomes_bz2'

    # threshold_0.2_float_movie_genomes_bz2
    l3 = 'threshold_'
    l4 = '_float_movie_genomes_bz2'
    thresholds = [0.25, 0.4, 0.7]

    lemmatized_labels = [(l1 + str(x) + l2) for x in thresholds]

    full_labels = [(l3 + str(x) + l4) for x in thresholds]

    # loading all required data
    user_full_genome_terms_df = pd.read_pickle(output_dir + 'user_full_genome_terms_df_bz2',
                                               compression='bz2')
    user_full_genome_terms_gzip_df = pd.read_pickle(output_dir + 'user_full_genome_terms_df_gzip',
                                                    compression='bz2')

    lemmatized_thresholded_dfs = list()
    full_thresholded_dfs = list()

    for i, t in enumerate(thresholds):
        lemmatized_thresholded_dfs.append(
            pd.read_pickle(output_dir + lemmatized_labels[i], compression='bz2'))
        full_thresholded_dfs.append(
            pd.read_pickle(output_dir + lemmatized_labels[i], compression='bz2'))

    # load term vectors
    genre_binary_terms_df = pd.read_pickle(genre_binary_terms, compression='bz2')
    movies_lemmatized_df = pd.read_pickle(movies_lemmatized, compression='bz2')

    import matplotlib.pyplot as plt
    from time import time

    labels = ['genre_binary', 'genome_full', 'genome_lemmatized']
    all_movie_ids = genre_binary_terms_df.index.values

    K_ranges = [5, 10, 15, 20, 30, 40, 50]

    # for index, K in enumerate(K_ranges):
    genre_recommender = ContentBased_Recommender(genre_binary_terms_df, ratings_df, K_ranges,
                                                 'jaccard')
    genome_full_recommender = ContentBased_Recommender(genome_scores_df, ratings_df, K_ranges,
                                                       'cosine')
    genome_lemmatized_recommender = ContentBased_Recommender(movies_lemmatized_df, ratings_df,
                                                             K_ranges,
                                                             'cosine')

    # lemmatized_recommenders = list()
    # full_recommenders = list()
    # for i, t in enumerate(thresholds):
    #     full_recommenders.append(
    #         ContentBased_Recommender(full_thresholded_dfs[i], ratings_df, K))
    #     lemmatized_recommenders.append(
    #         ContentBased_Recommender(lemmatized_thresholded_dfs[i], ratings_df, K))

    # dict of dataframes for each k
    genre_mae_df_dict = dict()
    genome_full_mae_df_dict = dict()
    genome_lemmatized_mae_df_dict = dict()

    genre_mse_df_dict = dict()
    genome_full_mse_df_dict = dict()
    genome_lemmatized_mse_df_dict = dict()

    lemmatized_mae_df_dict_list = list()
    full_mae_df_dict_list = list()

    lemmatized_mse_df_dict_list = list()
    full_mse_df_dict_list = list()

    genre_mae_df_dict, genre_mse_df_dict = init_mae_mse_df_dict(genre_mae_df_dict,
                                                                genre_mse_df_dict, K_ranges)
    genome_full_mae_df_dict, genome_full_mse_df_dict = init_mae_mse_df_dict(genome_full_mae_df_dict,
                                                                            genome_full_mse_df_dict,
                                                                            K_ranges)
    genome_lemmatized_mae_df_dict, genome_lemmatized_mse_df_dict = init_mae_mse_df_dict(
        genome_lemmatized_mae_df_dict, genome_lemmatized_mse_df_dict, K_ranges)

    # for i, t in enumerate(thresholds):
        # TODO init all thresholded lemmatized and full mae and mse df's

    for user_id in all_answers_user_ids[3:5]:
        start_time = time()
        print('user_id', user_id)

        # # movies watched by user
        user_movies = ratings_df[ratings_df['userId'] == user_id]['movieId'].values

        # mae, mse = genre_recommender.get_average_mae_mse(user_id, user_movies, K=None,
        #                                                  weighted=True)
        mae_dict, mse_dict = genre_recommender.get_average_mae_mse_forKRange(user_id, user_movies,
                                                                             weighted=True)
        # for k in K_ranges:
        #     genre

        # TODO for each k, store average mae, mse in respective dataframes


        # genre_mae_list.append(mae)
        # genre_mse_list.append(mse)
        #
        # mae, mse = genome_full_recommender.get_average_mae_mse(user_id, user_movies, K=None,
        #                                                        weighted=True)
        # genome_full_mae_list.append(mae)
        # genome_full_mse_list.append(mse)
        #
        # mae, mse = genome_lemmatized_recommender.get_average_mae_mse(user_id, user_movies,
        #                                                              K=None,
        #                                                              weighted=True)
        # genome_lemmatized_mae_list.append(mae)
        # genome_lemmatized_mse_list.append(mse)

        # for i, t in enumerate(thresholds):
        #     mae, mse = full_recommenders[i].get_average_mae_mse(user_id, user_movies, K=None,
        #                                                         weighted=True)
        #     full_mae_list.append(mae)
        #     full_mse_list.append(mse)
        #
        #     mae, mse = lemmatized_recommenders[i].get_average_mae_mse(user_id, user_movies,
        #                                                               K=None,
        #                                                               weighted=True)
        #     lemmatized_mae_list.append(mae)
        #     lemmatized_mse_list.append(mse)

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

    # for i, t in enumerate(thresholds):
    #     mae_df[full_labels[i] + '_MAE'] = full_mae_list[i]
    #     mse_df[full_labels[i] + '_MSE'] = full_mse_list[i]
    #
    #     mae_df[lemmatized_labels[i] + '_MAE'] = lemmatized_mae_list[i]
    #     mse_df[lemmatized_labels[i] + '_MSE'] = lemmatized_mse_list[i]

    mae_df.mean().plot(kind='barh',
                       title='K=' + str(K_ranges) + ', avg MAE across all users, for all movies')
    plt.show()
    mse_df.mean().plot(kind='barh',
                       title='K=' + str(K_ranges) + ', avg MSE across all users, for all movies')
    plt.show()


if __name__ == '__main__':
    answers_df = pd.read_csv(answers)

    # data loading and preprocessing
    genome_scores_df = pd.read_csv(genome_scores).pivot(index='movieId', columns='tagId',
                                                        values='relevance')
    movies_with_genome = genome_scores_df.index.values

    movies_df = pd.read_csv(movies)
    movies_df = movies_df[movies_df['genres'] != '(no genres listed)']
    movies_df = movies_df[movies_df['movieId'].isin(movies_with_genome)]

    all_movie_ids = movies_df['movieId'].unique()

    ratings_df = pd.read_csv(ratings)
    ratings_df = ratings_df[ratings_df['movieId'].isin(all_movie_ids)]
    ratings_df = ratings_df.loc[:, ['userId', 'movieId', 'rating']]

    all_user_ids = ratings_df['userId'].unique()

    # TODO also filter users only inside recommendations or answers dataframe
    count_df = answers_df.groupby('userId').count()
    all_answers_user_ids = count_df[count_df['movieId'] == 5].index.values

    main()
