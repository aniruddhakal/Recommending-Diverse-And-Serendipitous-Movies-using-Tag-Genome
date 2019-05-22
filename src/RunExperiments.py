import numpy as np
from enum import Enum
import pandas as pd
import matplotlib.pyplot as plt

from ContentBased_Recommender import CB_ClusteringBased_Recommender, \
    ContentBased_Baseline_Recommender, \
    BaselineRecommender_VectorType
from DataLoaderPreprocessor import DataLoaderPreprocessor
from sklearn.metrics import pairwise_distances
from time import time
import warnings

warnings.filterwarnings('ignore')

base_dir = '../../datasets/Movielens/'

ml20m = base_dir + 'ml-20m/'
serendipity2018 = base_dir + 'serendipity-sac2018/'

data_dir2 = serendipity2018
answers = serendipity2018 + 'answers.csv'
tag_genomes = serendipity2018 + 'tag_genome.csv'
recommendations = serendipity2018 + 'recommendations.csv'
ratings = serendipity2018 + 'training.csv'

data_output_dir = serendipity2018 + 'output4/'


class Model(Enum):
    main_model_lemmatized = 'main_model_lemmatized'
    main_model_full = 'main_model_full'
    baseline_genre_binary = 'baseline_genre_binary'
    baseline_genre_int = 'baseline_genre_int'
    baseline_genome_lemmatized = 'baseline_genome_lemmatized'
    baseline_genome_full = 'baseline_genome_full'


class RunExperiments:
    def __init__(self, ratings_df, genome_scores_df, movies_df, movie_genre_binary_terms_df,
                 movies_lemmatized_genome_term_vector_df, user_int_genre_terms_df,
                 user_genre_binary_term_vector_df,
                 user_lemmatized_genome_terms_df, user_full_genome_terms_df):
        self.ratings_df = ratings_df
        self.genome_scores_df = genome_scores_df
        self.movies_df = movies_df
        self.movie_genre_binary_terms_df = movie_genre_binary_terms_df
        self.movies_lemmatized_genome_term_vector_df = movies_lemmatized_genome_term_vector_df
        self.user_int_genre_terms_df = user_int_genre_terms_df
        self.user_genre_binary_term_vector_df = user_genre_binary_term_vector_df
        self.user_lemmatized_genome_terms_df = user_lemmatized_genome_terms_df
        self.user_full_genome_terms_df = user_full_genome_terms_df

        self.model_to_genome_df_dict = {
            Model.main_model_lemmatized:
                (
                    self.movies_lemmatized_genome_term_vector_df,
                    self.user_lemmatized_genome_terms_df),
            Model.baseline_genome_lemmatized:
                (
                    self.movies_lemmatized_genome_term_vector_df,
                    self.user_lemmatized_genome_terms_df),
            Model.main_model_full: (self.genome_scores_df, self.user_full_genome_terms_df),
            Model.baseline_genre_binary: (self.genome_scores_df, self.user_full_genome_terms_df),
            Model.baseline_genre_int: (self.genome_scores_df, self.user_full_genome_terms_df),
            Model.baseline_genome_full: (self.genome_scores_df, self.user_full_genome_terms_df)
        }

        self.model_to_vector_dict = {
            Model.baseline_genre_binary: BaselineRecommender_VectorType.GENRE_BINARY,
            Model.baseline_genre_int: BaselineRecommender_VectorType.GENRE_INTEGER,
            Model.baseline_genome_lemmatized: BaselineRecommender_VectorType.GENOME_LEMMATIZED,
            Model.baseline_genome_full: BaselineRecommender_VectorType.GENOME_FULL
        }

    def get_vector_type(self, baseline_model):
        return self.model_to_vector_dict[baseline_model]

    def map_movie_user_terms_df(self, model):
        model = Model(model)

        return self.model_to_genome_df_dict[model]

    def evaluate_recommendations(self, user_id, recommendation_list, N_size, movie_genome_scores_df,
                                 user_genome_terms_df):
        """

        :param user_id:
        :param recommendation_list:
        :param N_size:
        :param movie_genome_scores_df:
        :param user_genome_terms_df:
        :return:
        """
        movie_genomes_df = movie_genome_scores_df.loc[recommendation_list, :]
        user_vector_df = user_genome_terms_df.loc[user_id, :].values.reshape(1, -1)

        model_pairwise_scores_df = pd.DataFrame(index=recommendation_list)
        model_pairwise_scores_df['similarity'] = pairwise_distances(user_vector_df,
                                                                    movie_genomes_df.values,
                                                                    metric='cosine').reshape(-1, 1)
        model_pairwise_scores_df['diversity'] = 1 - model_pairwise_scores_df['similarity']

        all_movies = model_pairwise_scores_df.index.values
        movie_genomes_df = movie_genome_scores_df.loc[all_movies, :]

        # calculating diversity of a list (1-SIM_ij)
        intra_list_distances_df = pd.DataFrame(
            1 - pairwise_distances(movie_genomes_df.values, movie_genomes_df.values,
                                   metric='cosine'), index=all_movies,
            columns=all_movies)
        diversity_of_list = intra_list_distances_df.sum(axis=1).sum() * (
                1 / (N_size * (N_size - 1)))
        similarity_of_list = 1 - diversity_of_list

        average_similarity = model_pairwise_scores_df['similarity'].mean()
        average_diversity = model_pairwise_scores_df['diversity'].mean()

        # print("diversity_of_list: ", diversity_of_list)
        # print("similarity_of_list: ", similarity_of_list)
        # print("average_diversity: ", average_diversity)
        # print("average_similarity: ", average_similarity)

        return diversity_of_list, similarity_of_list, average_diversity, average_similarity

    def append_evaluation_result(self, user_id, model, evaluation_result, evaluation_results_df,
                                 index):
        result_dict = {
            'userId': user_id,
            'model': model,
            'diversity_of_list': evaluation_result[0],
            'similarity_of_list': evaluation_result[1],
            'average_diversity': evaluation_result[2],
            'average_similarity': evaluation_result[3]
        }

        result_ser = pd.Series(result_dict, name=index)

        return evaluation_results_df.append(result_ser, ignore_index=False)

    def evaluate_all_models(self, experimental_users_list, recommendation_results_dict,
                            N_recommendations):
        # DF - user, model, evaluation scores
        evaluation_results_df = pd.DataFrame(
            columns=['userId', 'model', 'diversity_of_list', 'similarity_of_list',
                     'average_diversity',
                     'average_similarity'])

        record_index = 1

        for model in recommendation_results_dict.keys():
            print('\n-------------------Model: ', model, '-------------------')
            for index, user_id in enumerate(experimental_users_list):
                recommendation_list = recommendation_results_dict[model][index]
                #         print("\nUser ID: ", user_id, 'RL: ', recommendation_list)
                #         user_id, recommendation_list, N_size, movie_genome_scores_df, user_genome_terms_df

                movie_terms_df, user_terms_df = self.map_movie_user_terms_df(model)
                # if user_id is 14 and model is 'baseline_genre_binary':
                evaluation_result = self.evaluate_recommendations(user_id, recommendation_list,
                                                                  N_recommendations,
                                                                  movie_terms_df, user_terms_df)
                # print(evaluation_result)

                # TODO update and return this df

                evaluation_results_df = self.append_evaluation_result(user_id, model,
                                                                      evaluation_result,
                                                                      evaluation_results_df,
                                                                      index=record_index)
                record_index += 1

        return evaluation_results_df


def update_recommendation_results_dict(recommendation_results_dict, recommendation_list, key):
    previous_recommendations_list = recommendation_results_dict[key.name]
    previous_recommendations_list.append(recommendation_list)
    recommendation_results_dict[key.name] = previous_recommendations_list


def store_recommendation_results_df(recommendations_df_dict, user_id, recommendation_list, key):
    user_rec_series = pd.Series(recommendation_list)
    user_rec_series.name = user_id

    if type(key) is str:
        target = key
    else:
        target = key.name

    recommendations_df = recommendations_df_dict[target]
    recommendations_df = recommendations_df.append(user_rec_series)
    recommendations_df_dict[target] = recommendations_df


def plot_graph(evaluation_results_df: pd.DataFrame, save_flag=False, save_path=None):
    plt.clf()
    evaluation_results_df.plot(kind='bar')
    plt.tight_layout()
    plt.legend(framealpha=0.2)

    # show or save the graph
    if save_flag:
        plt.savefig(save_path, dpi=300)
    else:
        plt.show()


def main(dataset, K, relevant_movies_threshold, user_list, save_flag, save_path):
    recommendation_results_dict = {
        'main_model_lemmatized': list(),
        'main_model_full': list(),
        'baseline_genre_binary': list(),
        'baseline_genre_int': list(),
        'baseline_genome_lemmatized': list(),
        'baseline_genome_full': list()
    }

    # load all data - unfortunately inefficient for now
    data_loader = DataLoaderPreprocessor(base_dir=base_dir, ml20m='ml-20m/',
                                         serendipity2018='serendipity-sac2018/')
    ratings_df, genome_scores_df, movies_df = data_loader.load_and_preprocess_data(dataset)

    movie_genre_binary_terms_df, movies_lemmatized_genome_term_vector_df, \
    user_int_genre_terms_df, user_genre_binary_term_vector_df, user_lemmatized_genome_terms_df, user_full_genome_terms_df \
        = data_loader.load_and_process_user_data(dataset)

    experiments = RunExperiments(ratings_df, genome_scores_df, movies_df,
                                 movie_genre_binary_terms_df,
                                 movies_lemmatized_genome_term_vector_df, user_int_genre_terms_df,
                                 user_genre_binary_term_vector_df,
                                 user_lemmatized_genome_terms_df, user_full_genome_terms_df)

    # movie_genre_binary_terms_df, movies_genome_term_vector_df, user_int_genre_terms_df,\
    # user_lemmatized_genome_terms_df, user_full_genome_terms_df \

    baseline_models = [Model.baseline_genre_binary, Model.baseline_genre_int,
                       Model.baseline_genome_lemmatized,
                       Model.baseline_genome_full]
    baseline_similarity_metrics = ['jaccard', 'cosine', 'cosine', 'cosine']

    experimental_users_list = range(1, 20)
    experimental_users_list = [9, 10, 11, 12, 13, 14]
    experimental_users_list = user_list

    for user_id in experimental_users_list:
        item_terms = movies_lemmatized_genome_term_vector_df.values
        item_item_distances = pairwise_distances(item_terms, metric='cosine')
        item_item_similarity_df = pd.DataFrame(item_item_distances,
                                               index=movies_lemmatized_genome_term_vector_df.index,
                                               columns=movies_lemmatized_genome_term_vector_df.index)

        recommender_lemmatized = CB_ClusteringBased_Recommender(ratings_df,
                                                                movies_lemmatized_genome_term_vector_df,
                                                                user_lemmatized_genome_terms_df,
                                                                item_item_similarity_df,
                                                                relevant_movies_threshold=relevant_movies_threshold)

        recommended_movies = recommender_lemmatized.recommend_movies3(user_id, K=K)

        # update recommendations for this user
        update_recommendation_results_dict(recommendation_results_dict, recommended_movies,
                                           key=Model.main_model_lemmatized)

        print("\nMain Model Lemmatized results:\n", recommended_movies)

        item_terms = genome_scores_df.values
        item_item_distances = pairwise_distances(item_terms, metric='cosine')
        item_item_similarity_df = pd.DataFrame(item_item_distances, index=genome_scores_df.index,
                                               columns=genome_scores_df.index)

        recommender_full = CB_ClusteringBased_Recommender(ratings_df, genome_scores_df,
                                                          user_full_genome_terms_df,
                                                          item_item_similarity_df,
                                                          relevant_movies_threshold=relevant_movies_threshold)

        recommended_movies = recommender_full.recommend_movies3(user_id, K=K)

        # update recommendations for this user
        update_recommendation_results_dict(recommendation_results_dict, recommended_movies,
                                           key=Model.main_model_full)

        print("\nMain Model full-genome results:\n", recommended_movies)

        # vector_type = BaselineRecommender_VectorType.GENOME_FULL

        # arr = ['genre_binary:\n', 'genre_integer:\n', 'genome_lemmatized:\n', 'genome_full:\n']

        for index, baseline_model in enumerate(baseline_models):
            vector_type = experiments.get_vector_type(baseline_model)

            # baseline_recommender = ContentBased_Baseline_Recommender(dataset):
            baseline_recommender = ContentBased_Baseline_Recommender(dataset,
                                                                     movie_genre_binary_terms_df,
                                                                     movies_lemmatized_genome_term_vector_df,
                                                                     user_int_genre_terms_df,
                                                                     user_genre_binary_term_vector_df,
                                                                     user_lemmatized_genome_terms_df,
                                                                     user_full_genome_terms_df,
                                                                     ratings_df,
                                                                     genome_scores_df, movies_df,
                                                                     similarity_metric=
                                                                     baseline_similarity_metrics[
                                                                         index])
            recommended_movies = baseline_recommender.recommend_k_most_similar_movies(user_id, K,
                                                                                      vector_type=vector_type)
            # print(arr[vector_type - 1], result)
            update_recommendation_results_dict(recommendation_results_dict, recommended_movies,
                                               key=baseline_model)

    print("experimental_users_list: ", experimental_users_list)
    print("recommendation_results_dict dictionary:\n", recommendation_results_dict)

    # evaluate all models and produce results
    evaluation_results_df = experiments.evaluate_all_models(experimental_users_list,
                                                            recommendation_results_dict, K)

    # mean plot
    combined_result_df = evaluation_results_df.groupby(['userId', 'model']).mean()
    combined_result_df = combined_result_df.groupby('model').mean()
    plot_graph(combined_result_df, save_flag, save_path + '_mean_plot')

    # median plot
    combined_result_df = evaluation_results_df.groupby(['userId', 'model']).median()
    combined_result_df = combined_result_df.groupby('model').median()
    plot_graph(combined_result_df, save_flag, save_path + '_median_plot')

    # individual user results
    combined_result_df = evaluation_results_df.groupby(['userId', 'model']).median()
    combined_result_df = combined_result_df.groupby('model').median()
    plot_graph(combined_result_df, save_flag, save_path + '_median_plot')

    # # mode plot
    # combined_result_df = evaluation_results_df.groupby(['userId', 'model']).mode()
    # combined_result_df = combined_result_df.groupby('model').mode()
    # plot_graph(combined_result_df, save_flag, save_path + '_mode_plot')


def store_thresholded_recommendations(user_list, K=8, relevant_movies_threshold=0.2, save_flag=True,
                                      save_path=''):
    recommendations_df_dict = {
        'full_thresholded_0.25': pd.DataFrame(),
        'lemmatized_thresholded_0.25': pd.DataFrame(),
        'full_thresholded_0.4': pd.DataFrame(),
        'lemmatized_thresholded_0.4': pd.DataFrame(),
        'full_thresholded_0.7': pd.DataFrame(),
        'lemmatized_thresholded_0.7': pd.DataFrame(),
    }

    data_loader = DataLoaderPreprocessor(base_dir=base_dir, ml20m='ml-20m/',
                                         serendipity2018='serendipity-sac2018/')
    ratings_df, genome_scores_df, movies_df = data_loader.load_and_preprocess_data(dataset)

    l1 = 'movies_lemmatized_threshold_'
    l2 = '_float_movie_genomes_bz2'

    # threshold_0.2_float_movie_genomes_bz2
    l3 = 'threshold_'
    l4 = '_float_movie_genomes_bz2'

    t_lbl = 'threshold_'
    l5 = '_user_lemmatized_genome_terms_df_bz2'
    l6 = '_user_full_genome_terms_df_bz2'

    thresholds = [0.25, 0.4, 0.7]
    # remove single threshold and keep above 3
    # thresholds = [0.25]

    movies_lemmatized_labels = [(l1 + str(x) + l2) for x in thresholds]
    movies_full_labels = [(l3 + str(x) + l4) for x in thresholds]

    users_lemmatized_labels = [(t_lbl + str(x) + l5) for x in thresholds]
    users_full_labels = [(t_lbl + str(x) + l6) for x in thresholds]

    lemmatized_thresholded_dfs = list()
    full_thresholded_dfs = list()

    # initialize recommenders and append to the list
    lemmatized_recommenders = list()
    full_recommenders = list()

    # load thresholded dataframes
    metric = 'cosine'
    for i, t in enumerate(thresholds):
        lemmatized_genome_terms_df = pd.read_pickle(data_output_dir + movies_lemmatized_labels[
            i], compression='bz2')
        lemmatized_genome_terms_df.fillna(0, inplace=True)
        distances_df = pd.DataFrame(pairwise_distances(lemmatized_genome_terms_df, metric=metric),
                                    index=lemmatized_genome_terms_df.index,
                                    columns=lemmatized_genome_terms_df.index)

        distances_df.fillna(0, inplace=True)

        user_lemmatized_df = pd.read_pickle(data_output_dir + users_lemmatized_labels[i],
                                            compression='bz2')
        user_lemmatized_df.fillna(0, inplace=True)

        lemmatized_recommender = CB_ClusteringBased_Recommender(ratings_df,
                                                                lemmatized_genome_terms_df,
                                                                user_lemmatized_df,
                                                                distances_df,
                                                                relevant_movies_threshold=relevant_movies_threshold)

        lemmatized_recommenders.append(lemmatized_recommender)
        # del target_df

        # lemmatized_thresholded_dfs.append(distances_df)

        full_genome_terms_df = pd.read_pickle(data_output_dir + movies_full_labels[i],
                                              compression='bz2')
        full_genome_terms_df.fillna(0, inplace=True)
        distances_df = pd.DataFrame(pairwise_distances(full_genome_terms_df, metric=metric),
                                    index=full_genome_terms_df.index,
                                    columns=full_genome_terms_df.index)

        distances_df.fillna(0, inplace=True)

        user_full_df = pd.read_pickle(data_output_dir + users_full_labels[i],
                                      compression='bz2')
        user_full_df.fillna(0, inplace=True)

        full_recommender = CB_ClusteringBased_Recommender(ratings_df,
                                                          full_genome_terms_df,
                                                          user_full_df,
                                                          distances_df,
                                                          relevant_movies_threshold=relevant_movies_threshold)
        full_recommenders.append(full_recommender)

    for user_id in user_list:
        print("user under test: ", user_id)

        # for each recommender in the list, get recommendations
        for i, threshold in enumerate(thresholds):
            recommender = lemmatized_recommenders[i]
            recommended_movies = recommender.recommend_movies3(user_id, K=K)

            # update recommendations for this user
            store_recommendation_results_df(recommendations_df_dict, user_id, recommended_movies,
                                            key='lemmatized_thresholded_' + str(threshold))

            recommender = full_recommenders[i]
            recommended_movies = recommender.recommend_movies3(user_id, K=K)

            # store them in appropriate way as done in store_recommendations method.
            # update recommendations for this user
            store_recommendation_results_df(recommendations_df_dict, user_id, recommended_movies,
                                            key='full_thresholded_' + str(threshold))

        # export recommendations using save_flag and export_recommendations_to_csv method
        if save_flag:
            for key in recommendations_df_dict.keys():
                export_recommendations_to_csv(recommendations_df_dict[key], save_path, K,
                                              relevant_movies_threshold, key)


def store_baseline_recommendations(user_list, K=8, relevant_movies_threshold=0.2, save_flag=False,
                                   save_path=''):
    recommendations_df_dict = {
        # 'main_model_lemmatized': pd.DataFrame(),
        # 'main_model_full': pd.DataFrame(),
        'baseline_genre_binary': pd.DataFrame(),
        # 'baseline_genre_int': pd.DataFrame(),
        'baseline_genome_lemmatized': pd.DataFrame(),
        'baseline_genome_full': pd.DataFrame()
    }

    # load all data - unfortunately inefficient for now
    data_loader = DataLoaderPreprocessor(base_dir=base_dir, ml20m='ml-20m/',
                                         serendipity2018='serendipity-sac2018/')
    ratings_df, genome_scores_df, movies_df = data_loader.load_and_preprocess_data(dataset)

    movie_genre_binary_terms_df, movies_lemmatized_genome_term_vector_df, \
    user_int_genre_terms_df, user_genre_binary_term_vector_df, user_lemmatized_genome_terms_df, user_full_genome_terms_df \
        = data_loader.load_and_process_user_data(dataset)

    experiments = RunExperiments(ratings_df, genome_scores_df, movies_df,
                                 movie_genre_binary_terms_df,
                                 movies_lemmatized_genome_term_vector_df, user_int_genre_terms_df,
                                 user_genre_binary_term_vector_df,
                                 user_lemmatized_genome_terms_df, user_full_genome_terms_df)

    baseline_similarity_metrics = ['jaccard', 'cosine', 'cosine']
    baseline_models = [Model.baseline_genre_binary,
                       Model.baseline_genome_lemmatized,
                       Model.baseline_genome_full]

    experimental_users_list = range(1, 20)
    experimental_users_list = [9, 10, 11, 12, 13, 14]
    experimental_users_list = user_list

    for user_id in experimental_users_list:
        print("user under test: ", user_id)

        # TODO uncomment this block for baseline recommendations
        for index, baseline_model in enumerate(baseline_models):
            vector_type = experiments.get_vector_type(baseline_model)

            # baseline_recommender = ContentBased_Baseline_Recommender(dataset):
            baseline_recommender = ContentBased_Baseline_Recommender(dataset,
                                                                     movie_genre_binary_terms_df,
                                                                     movies_lemmatized_genome_term_vector_df,
                                                                     user_int_genre_terms_df,
                                                                     user_genre_binary_term_vector_df,
                                                                     user_lemmatized_genome_terms_df,
                                                                     user_full_genome_terms_df,
                                                                     ratings_df,
                                                                     genome_scores_df, movies_df,
                                                                     similarity_metric=
                                                                     baseline_similarity_metrics[
                                                                         index])
            recommended_movies = baseline_recommender.recommend_k_most_similar_movies(user_id, K,
                                                                                      vector_type=vector_type)
            # store instead update
            store_recommendation_results_df(recommendations_df_dict, user_id, recommended_movies,
                                            key=baseline_model)

        if save_flag:
            for key in recommendations_df_dict.keys():
                export_recommendations_to_csv(recommendations_df_dict[key], save_path, K,
                                              relevant_movies_threshold, key)


def store_recommendations(user_list, K=8, relevant_movies_threshold=0.2, save_flag=False,
                          save_path=''):
    recommendations_df_dict = {
        'main_model_lemmatized': pd.DataFrame(),
        'main_model_full': pd.DataFrame(),
    }

    # load all data - unfortunately inefficient for now
    data_loader = DataLoaderPreprocessor(base_dir=base_dir, ml20m='ml-20m/',
                                         serendipity2018='serendipity-sac2018/')
    ratings_df, genome_scores_df, movies_df = data_loader.load_and_preprocess_data(dataset)

    movie_genre_binary_terms_df, movies_lemmatized_genome_term_vector_df, \
    user_int_genre_terms_df, user_genre_binary_term_vector_df, user_lemmatized_genome_terms_df, user_full_genome_terms_df \
        = data_loader.load_and_process_user_data(dataset)

    # TODO removing because only used for running baselines
    del movie_genre_binary_terms_df, user_int_genre_terms_df, user_genre_binary_term_vector_df

    experimental_users_list = range(1, 20)
    experimental_users_list = [9, 10, 11, 12, 13, 14]
    experimental_users_list = user_list

    movies_lemmatized_genome_term_vector_df.fillna(0, inplace=True)
    item_terms = movies_lemmatized_genome_term_vector_df.values
    item_item_distances = pairwise_distances(item_terms, metric='cosine')
    del item_terms
    item_item_similarity_df = pd.DataFrame(item_item_distances,
                                           index=movies_lemmatized_genome_term_vector_df.index,
                                           columns=movies_lemmatized_genome_term_vector_df.index)
    recommender_lemmatized = CB_ClusteringBased_Recommender(ratings_df,
                                                            movies_lemmatized_genome_term_vector_df,
                                                            user_lemmatized_genome_terms_df,
                                                            item_item_similarity_df,
                                                            relevant_movies_threshold=relevant_movies_threshold)

    genome_scores_df.fillna(0, inplace=True)
    item_terms = genome_scores_df.values
    item_item_distances = pairwise_distances(item_terms, metric='cosine')
    del item_terms
    item_item_similarity_df = pd.DataFrame(item_item_distances, index=genome_scores_df.index,
                                           columns=genome_scores_df.index)

    recommender_full = CB_ClusteringBased_Recommender(ratings_df, genome_scores_df,
                                                      user_full_genome_terms_df,
                                                      item_item_similarity_df,
                                                      relevant_movies_threshold=relevant_movies_threshold)

    for user_id in experimental_users_list:
        print("user under test: ", user_id)

        recommended_movies = recommender_lemmatized.recommend_movies3(user_id, K=K)

        # update recommendations for this user
        store_recommendation_results_df(recommendations_df_dict, user_id, recommended_movies,
                                        key=Model.main_model_lemmatized)
        # TODO store instead update

        print("\nMain Model Lemmatized results:\n", recommended_movies)
        recommended_movies = recommender_full.recommend_movies3(user_id, K=K)

        # update recommendations for this user
        # TODO store instead update
        store_recommendation_results_df(recommendations_df_dict, user_id, recommended_movies,
                                        key=Model.main_model_full)

        print("\nMain Model full-genome results:\n", recommended_movies)

        if save_flag:
            for key in recommendations_df_dict.keys():
                export_recommendations_to_csv(recommendations_df_dict[key], save_path, K,
                                              relevant_movies_threshold, key)


def generate_non_thresholded_recommendations(experimental_users_list):
    for relevant_movies_threshold in [0, 0.2, 0.4]:
        store_recommendations(experimental_users_list, K=K,
                              relevant_movies_threshold=relevant_movies_threshold,
                              save_flag=save_flag,
                              save_path=save_path)


def generate_baseline_recommendations(experimental_users_list):
    for relevant_movies_threshold in [0, 0.2, 0.4]:
        store_baseline_recommendations(experimental_users_list, K=K,
                                       relevant_movies_threshold=relevant_movies_threshold,
                                       save_flag=save_flag,
                                       save_path=save_path)


def generate_thresholded_recommendations(experimental_users_list):
    for relevant_movies_threshold in [0, 0.2, 0.4]:
        store_thresholded_recommendations(experimental_users_list, K=K,
                                          relevant_movies_threshold=relevant_movies_threshold,
                                          save_flag=save_flag,
                                          save_path=save_path)


def export_recommendations_to_csv(df_object: pd.DataFrame, save_path, K,
                                  relevant_movies_threshold, df_name):
    target_file_name = save_path + df_name + '_simMov_serendipity2018_relevantThreshold_' + str(
        relevant_movies_threshold) + \
                       '_K' + str(K) + '.csv'
    df_object.to_csv(target_file_name)


def get_serendipity2018_answers_users(n_users='all'):
    answers_df = pd.read_csv(answers)
    count_df = answers_df.groupby('userId').count()
    all_user_ids = count_df[count_df['movieId'] == 5].index.values

    if n_users is not 'all' and type(n_users) is int:
        return np.random.choice(all_user_ids, n_users)
    else:
        return all_user_ids


def get_serendipity2018_recommendations_users(n_users='all'):
    # experimental_users_list = [108657, 121459, 143149, 144189]
    genome_scores_df = pd.read_csv(tag_genomes).pivot(index='movieId', columns='tagId',
                                                      values='relevance')
    tag_genome_movies = genome_scores_df.index.values

    recommendations_df = pd.read_csv(recommendations)
    all_user_ids = recommendations_df['userId'].unique()

    ratings_df = pd.read_csv(ratings)

    # filter ratings for movies watched only by these users
    ratings_df = ratings_df[ratings_df['userId'].isin(all_user_ids)]

    # filter ratings for movies only having tag-genome scores
    ratings_df = ratings_df[ratings_df['movieId'].isin(tag_genome_movies)]
    count_df = ratings_df.groupby('userId').count()

    # choose users who have watched 2 or more movies
    all_user_ids = count_df[count_df['movieId'] >= 2].index.values

    if n_users is not 'all' and type(n_users) is int:
        return np.random.choice(all_user_ids, n_users)
    else:
        return all_user_ids


if __name__ == '__main__':
    np.random.seed(171450)

    # dataset = 'ml20m'
    dataset = 'serendipity2018'
    K = 8

    # serendipity2018-----------------
    # experimental_users_list = get_serendipity2018_answers_users(5)
    experimental_users_list = get_serendipity2018_recommendations_users('all')
    # serendipity2018-----------------

    # experimental_users_list = range(1, 20)
    # experimental_users_list = [9, 10, 11, 12, 13, 14]
    # experimental_users_list = [148369]

    save_flag = True
    # save_path = ml20m + 'output/for_20_users_relevantMoviesThreshold0_05_highDiv0_8'
    # save_path = ml20m + 'output/recommendations/'
    save_path = serendipity2018 + 'output4/recommendations_algo3_all25/'
    relevant_movies_threshold = 0.2

    # store_recommendations(experimental_users_list, K, relevant_movies_threshold, save_flag,
    #                       save_path)

    # data_loader = DataLoaderPreprocessor(base_dir=base_dir, ml20m='ml-20m/',
    #                                      serendipity2018='serendipity-sac2018/')
    # ratings_df, genome_scores_df, movies_df = data_loader.load_and_preprocess_data(
    #     'serendipity2018')

    # generate_cb_recommendations(experimental_users_list)
    # main(dataset, K, relevant_movies_threshold, experimental_users_list, save_flag, save_path)

    # generate_baseline_recommendations(experimental_users_list)
    generate_non_thresholded_recommendations(experimental_users_list)
    generate_thresholded_recommendations(experimental_users_list)
