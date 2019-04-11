# class Serendipity
import numpy as np
from enum import Enum
import pandas as pd
import matplotlib.pyplot as plt

from ContentBased_Recommender import CB_ClusteringBased_Recommender, ContentBased_Baseline_Recommender, \
    BaselineRecommender_VectorType
from DataLoaderPreprocessor import DataLoaderPreprocessor
from sklearn.metrics import pairwise_distances

base_dir = '../../datasets/Movielens/'

ml20m = base_dir + 'ml-20m/'
serendipity2018 = base_dir + 'serendipity-sac2018/'

data_dir2 = serendipity2018
answers = serendipity2018 + 'answers.csv'

data_output_dir = base_dir + 'output/'


class Model(Enum):
    main_model_lemmatized = 'main_model_lemmatized'
    main_model_full = 'main_model_full'
    baseline_genre_binary = 'baseline_genre_binary'
    baseline_genre_int = 'baseline_genre_int'
    baseline_genome_lemmatized = 'baseline_genome_lemmatized'
    baseline_genome_full = 'baseline_genome_full'


class RunExperiments:
    def __init__(self, ratings_df, genome_scores_df, movies_df, movie_genre_binary_terms_df,
                 movies_lemmatized_genome_term_vector_df, user_int_genre_terms_df, user_genre_binary_term_vector_df,
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
                (self.movies_lemmatized_genome_term_vector_df, self.user_lemmatized_genome_terms_df),
            Model.baseline_genome_lemmatized:
                (self.movies_lemmatized_genome_term_vector_df, self.user_lemmatized_genome_terms_df),
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
        model_pairwise_scores_df['similarity'] = pairwise_distances(user_vector_df, movie_genomes_df.values,
                                                                    metric='cosine').reshape(-1, 1)
        model_pairwise_scores_df['diversity'] = 1 - model_pairwise_scores_df['similarity']

        all_movies = model_pairwise_scores_df.index.values
        movie_genomes_df = movie_genome_scores_df.loc[all_movies, :]

        # calculating diversity of a list (1-SIM_ij)
        intra_list_distances_df = pd.DataFrame(
            1 - pairwise_distances(movie_genomes_df.values, movie_genomes_df.values, metric='cosine'), index=all_movies,
            columns=all_movies)
        diversity_of_list = intra_list_distances_df.sum(axis=1).sum() * (1 / (N_size * (N_size - 1)))
        similarity_of_list = 1 - diversity_of_list

        average_similarity = model_pairwise_scores_df['similarity'].mean()
        average_diversity = model_pairwise_scores_df['diversity'].mean()

        # print("diversity_of_list: ", diversity_of_list)
        # print("similarity_of_list: ", similarity_of_list)
        # print("average_diversity: ", average_diversity)
        # print("average_similarity: ", average_similarity)

        return diversity_of_list, similarity_of_list, average_diversity, average_similarity

    def append_evaluation_result(self, user_id, model, evaluation_result, evaluation_results_df, index):
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

    def evaluate_all_models(self, experimental_users_list, recommendation_results_dict, N_recommendations):
        # DF - user, model, evaluation scores
        evaluation_results_df = pd.DataFrame(
            columns=['userId', 'model', 'diversity_of_list', 'similarity_of_list', 'average_diversity',
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
                evaluation_result = self.evaluate_recommendations(user_id, recommendation_list, N_recommendations,
                                                                  movie_terms_df, user_terms_df)
                # print(evaluation_result)

                # TODO update and return this df

                evaluation_results_df = self.append_evaluation_result(user_id, model, evaluation_result,
                                                                      evaluation_results_df, index=record_index)
                record_index += 1

        return evaluation_results_df


def update_recommendation_results_dict(recommendation_results_dict, recommendation_list, key):
    previous_recommendations_list = recommendation_results_dict[key.name]
    previous_recommendations_list.append(recommendation_list)
    recommendation_results_dict[key.name] = previous_recommendations_list


def plot_graph(evaluation_results_df, save_flag=False, save_path=None):
    combined_result_df = evaluation_results_df.groupby(['userId', 'model']).mean()
    combined_result_df.groupby('model').mean().plot(kind='bar')

    # TODO show or save the graph
    plt.tight_layout()
    plt.legend(framealpha=0.2)

    if save_flag:
        plt.savefig(save_path, dpi=300)
    else:
        plt.show()


def main(dataset, K, user_list, save_flag, save_path):
    recommendation_results_dict = {
        'main_model_lemmatized': list(),
        'main_model_full': list(),
        'baseline_genre_binary': list(),
        'baseline_genre_int': list(),
        'baseline_genome_lemmatized': list(),
        'baseline_genome_full': list()
    }

    data_loader = DataLoaderPreprocessor(base_dir=base_dir, ml20m='ml-20m/',
                                         serendipity2018='serendipity-sac2018/')
    ratings_df, genome_scores_df, movies_df = data_loader.load_and_preprocess_data(dataset)

    movie_genre_binary_terms_df, movies_lemmatized_genome_term_vector_df, \
    user_int_genre_terms_df, user_genre_binary_term_vector_df, user_lemmatized_genome_terms_df, user_full_genome_terms_df \
        = data_loader.load_and_process_user_data(dataset)

    experiments = RunExperiments(ratings_df, genome_scores_df, movies_df, movie_genre_binary_terms_df,
                                 movies_lemmatized_genome_term_vector_df, user_int_genre_terms_df,
                                 user_genre_binary_term_vector_df,
                                 user_lemmatized_genome_terms_df, user_full_genome_terms_df)

    # movie_genre_binary_terms_df, movies_genome_term_vector_df, user_int_genre_terms_df,\
    # user_lemmatized_genome_terms_df, user_full_genome_terms_df \

    baseline_models = [Model.baseline_genre_binary, Model.baseline_genre_int, Model.baseline_genome_lemmatized,
                       Model.baseline_genome_full]

    experimental_users_list = range(1, 20)
    experimental_users_list = [9, 10, 11, 12, 13, 14]
    experimental_users_list = user_list

    for user_id in experimental_users_list:
        item_terms = movies_lemmatized_genome_term_vector_df.values
        item_item_distances = pairwise_distances(item_terms, metric='cosine')
        item_item_similarity_df = pd.DataFrame(item_item_distances, index=movies_lemmatized_genome_term_vector_df.index,
                                               columns=movies_lemmatized_genome_term_vector_df.index)

        recommender_lemmatized = CB_ClusteringBased_Recommender(ratings_df, movies_lemmatized_genome_term_vector_df,
                                                                user_lemmatized_genome_terms_df,
                                                                item_item_similarity_df)

        recommended_movies = recommender_lemmatized.recommend_movies(user_id, K=K)

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
                                                          item_item_similarity_df)

        recommended_movies = recommender_full.recommend_movies(user_id, K=K)

        # update recommendations for this user
        update_recommendation_results_dict(recommendation_results_dict, recommended_movies,
                                           key=Model.main_model_full)

        print("\nMain Model full-genome results:\n", recommended_movies)

        # vector_type = BaselineRecommender_VectorType.GENOME_FULL

        # arr = ['genre_binary:\n', 'genre_integer:\n', 'genome_lemmatized:\n', 'genome_full:\n']

        for baseline_model in baseline_models:
            vector_type = experiments.get_vector_type(baseline_model)

            # baseline_recommender = ContentBased_Baseline_Recommender(dataset):
            baseline_recommender = ContentBased_Baseline_Recommender(dataset, movie_genre_binary_terms_df,
                                                                     movies_lemmatized_genome_term_vector_df,
                                                                     user_int_genre_terms_df,
                                                                     user_genre_binary_term_vector_df,
                                                                     user_lemmatized_genome_terms_df,
                                                                     user_full_genome_terms_df, ratings_df,
                                                                     genome_scores_df, movies_df)
            recommended_movies = baseline_recommender.recommend_k_most_similar_movies(user_id, K,
                                                                                      vector_type=vector_type)
            # print(arr[vector_type - 1], result)
            update_recommendation_results_dict(recommendation_results_dict, recommended_movies,
                                               key=baseline_model)

    print("experimental_users_list: ", experimental_users_list)
    print("recommendation_results_dict dictionary:\n", recommendation_results_dict)

    # evaluate all models and produce results
    evaluation_results_df = experiments.evaluate_all_models(experimental_users_list, recommendation_results_dict, K)
    plot_graph(evaluation_results_df, save_flag, save_path)


if __name__ == '__main__':
    dataset = 'ml20m'
    K = 20

    experimental_users_list = range(1, 20)
    # experimental_users_list = [9, 10, 11, 12, 13, 14]
    # experimental_users_list = [14]
    save_flag = True
    save_path = ml20m + 'output/across_20_users_all_same_weights.png'

    main(dataset, K, experimental_users_list, save_flag, save_path)
