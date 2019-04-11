from enum import Enum
import numpy as np
import pandas as pd
from sklearn.metrics import pairwise_distances, silhouette_score
from sklearn.cluster import KMeans
from sklearn.preprocessing import MinMaxScaler
from sklearn.cluster import AgglomerativeClustering
from DataLoaderPreprocessor import DataLoaderPreprocessor
from time import time

data_base_dir = '../../datasets/Movielens/'
data_dir2 = data_base_dir + 'Movielens Latest/ml-latest/'
data_dir = data_base_dir + 'ml-20m/'
data_dir3 = data_base_dir + 'serendipity-sac2018/'
answers = data_dir3 + 'answers.csv'

data_output_dir = data_base_dir + 'output/'

genome_scores = data_dir + 'genome-scores.csv'
genome_tags = data_dir + 'genome-tags.csv'
movies = data_dir + 'movies.csv'
ratings = data_dir + 'ratings.csv'
tags = data_dir + 'tags.csv'
genres = data_dir + 'u.genre'

user_unstemmed_genome_vector = data_dir + 'user_unstemmed_genome_terms_df_gzip'
user_stemmed_genome_vector = data_dir + 'user_stemmed_genome_terms_df_gzip'


class BaselineRecommender_VectorType:
    # user binary terms, movie binary terms
    GENRE_BINARY = 1

    # user integer terms, movie binary terms
    GENRE_INTEGER = 2

    # user lemmatized terms, movie lemmatized terms
    GENOME_LEMMATIZED = 3

    # user full genome terms, movie full genome terms
    GENOME_FULL = 4


class ContentBased_Baseline_Recommender:
    # TODO recommend using genre binary term vector
    # TODO recommend using genre integer/float normalized term vector
    # TODO recommend using random K movie selection which are not amongst users watched list
    # TODO recommend using tag-genome term vector
    # TODO recommend using lemmatized tag-genome term vector

    def __init__(self, dataset='ml20m', movie_genre_binary_terms_df=None, movies_lemmatized_genome_term_vector_df=None,
                 user_int_genre_terms_df=None, user_genre_binary_term_vector_df=None,
                 user_lemmatized_genome_terms_df=None, user_full_genome_terms_df=None, ratings_df=None,
                 genome_scores_df=None, movies_df=None):
        self.dataset = dataset

        self.movies_genre_binary_term_vector_df = movie_genre_binary_terms_df
        self.movies_lemmatized_genome_vector_df = movies_lemmatized_genome_term_vector_df
        self.movies_full_genome_vector_df = genome_scores_df

        self.user_int_genre_terms_df = user_int_genre_terms_df
        self.user_genre_binary_term_vector_df = user_genre_binary_term_vector_df

        self.user_full_genome_terms_df = user_full_genome_terms_df
        self.user_lemmatized_genome_terms_df = user_lemmatized_genome_terms_df

        self.ratings_df = ratings_df
        self.movies_df = movies_df
        self.movie_average_ratings_df = None

        if self.ratings_df is not None:
            self.movie_average_ratings_df = self.ratings_df.loc[:, ['movieId', 'rating']].groupby('movieId').mean()

        # ml-20m setup
        # load all movies in df,
        # load tag-genome scores df
        # filter movies only under tag-genome df
        # filter-out movies with (no genres listed)
        # store final list of movie ID's
        # udpate genome_scores_df, ratings_df and movies_df to only keep updated movie ID's

    def load_all_data(self):
        data_loader = DataLoaderPreprocessor()
        self.ratings_df, self.movies_full_genome_vector_df, self.movies_df \
            = data_loader.load_and_preprocess_data(self.dataset)

        self.movies_genre_binary_term_vector_df, self.movies_lemmatized_genome_vector_df, self.user_int_genre_terms_df, \
        self.user_genre_binary_term_vector_df, self.user_lemmatized_genome_terms_df, self.user_full_genome_terms_df \
            = data_loader.load_and_process_user_data(self.dataset)

        self.movie_average_ratings_df = self.ratings_df.loc[:, ['movieId', 'rating']].groupby('movieId').mean()

    def get_vector_type_mapping(self, string_vector_type):
        """

        :param string_vector_type:
        :raises: ValueError if there's incorrect value in string_vector_type
        :return:
        """
        vector_types_dict = {
            'genre_binary': BaselineRecommender_VectorType.GENRE_BINARY,
            'genre_int': BaselineRecommender_VectorType.GENRE_INTEGER,
            'genome_lemmatized': BaselineRecommender_VectorType.GENOME_LEMMATIZED,
            'genome_full': BaselineRecommender_VectorType.GENOME_FULL
        }

        vector_type = vector_types_dict[string_vector_type]

        if vector_type is None:
            raise ValueError("%s is invalid argument, please read documentation for right choice of arguments")

        return vector_types_dict[vector_type]

    def recommend_k_most_similar_movies(self, user_id, K, vector_type=BaselineRecommender_VectorType.GENRE_BINARY):
        """

        :param K: Number of best similar movies to recommend
        :param vector_type: string {'genre_binary', 'genre_int', 'genome_lemmatized', 'genome_full'}or enum of type BaselineRecommender_VectorType,
         with possible values for enum being {GENRE_BINARY, GENRE_INTEGER, GENOME_LEMMATIZED, GENOME_FULL}
        :return:
        """
        if self.ratings_df is None:
            self.load_all_data()

        if type(vector_type) is str:
            vector_type = self.get_vector_type_mapping(vector_type)

        recommend_k_similar_movies = {
            BaselineRecommender_VectorType.GENRE_BINARY: self.user_binary_genre_based_recommendations(user_id, K),
            BaselineRecommender_VectorType.GENRE_INTEGER: self.user_integer_genre_based_recommendations(user_id, K),
            BaselineRecommender_VectorType.GENOME_FULL: self.user_full_genome_based_recommendations(user_id, K),
            BaselineRecommender_VectorType.GENOME_LEMMATIZED: self.user_lemmatized_genome_based_recommendations(user_id,
                                                                                                                K)
        }

        return recommend_k_similar_movies[vector_type]

    def user_binary_genre_based_recommendations(self, user_id, K):
        return self.genre_based_term_vec_recommendations(user_id, K, self.user_genre_binary_term_vector_df,
                                                         self.movies_genre_binary_term_vector_df)

    def user_integer_genre_based_recommendations(self, user_id, K):
        return self.genre_based_term_vec_recommendations(user_id, K, self.user_int_genre_terms_df,
                                                         self.movies_genre_binary_term_vector_df)

    def user_full_genome_based_recommendations(self, user_id, K):
        return self.genre_based_term_vec_recommendations(user_id, K, self.user_full_genome_terms_df,
                                                         self.movies_full_genome_vector_df)

    def user_lemmatized_genome_based_recommendations(self, user_id, K):
        return self.genre_based_term_vec_recommendations(user_id, K, self.user_lemmatized_genome_terms_df,
                                                         self.movies_lemmatized_genome_vector_df)

    def genre_based_term_vec_recommendations(self, user_id, K, user_term_vector_df, movies_term_vector_df):
        user_term_vector = user_term_vector_df.loc[user_id, :].values.reshape(1, -1)

        distances = pairwise_distances(user_term_vector, movies_term_vector_df.values,
                                       metric='cosine')

        nearest_movies_df = pd.DataFrame(index=movies_term_vector_df.index.values)
        nearest_movies_df['distances'] = distances.reshape(-1, 1)

        # ties in ranking are breaked based on average rating across all users
        nearest_movies_df['avg_rating'] = self.movie_average_ratings_df['rating']
        nearest_movies_df.sort_values(['distances', 'avg_rating'], ascending=False, inplace=True)

        return nearest_movies_df.index.values[:K]


# TODO create enum to allow selection between ranking algorithms
class RankingEnum:
    pass


class CB_ClusteringBased_Recommender:
    # TODO normalize values in ranking dataframe before reranking them.
    #   and compare results with non-normalized one
    # TODO p-median problem to infer user's taste based on tag-genomes.

    def __init__(self, ratings_df, genome_scores_df, user_term_vector_df, item_item_similarities_df, K=20,
                 n_neighbours=50, n_clusters=8, relevant_movies_threshold=0.2, random_state=171450):
        """

        :param ratings_df: Ratings df, original as read from Movielens dataset
        :param genome_scores_df: Genome scores dataframe,
            pivoted as index='movieId', columns='tagId', values='relevance'
        :param user_term_vector_df: Pandas Dataframe of User Genome Term Vector
        :param K: Recommend top K movies
        :param n_neighbours: Number of neighbor movies to consider for each candidate movie
        :param n_clusters: Number of clusters to be formed
        """
        self.ratings_df = ratings_df
        self.genome_scores_df = genome_scores_df
        self.user_term_vector_df = user_term_vector_df
        self.K = K
        self.n_neighbours = n_neighbours
        self.item_item_similarities_df = item_item_similarities_df
        self.relevant_movies_threshold = relevant_movies_threshold

        # Weighted ranking
        # TODO - remove hardcoding
        self.Rcu_weight = 0.40
        self.Su_weight = 0.20
        self.div_weight = 0.15
        self.Ci_weight = 0.15

        # TODO do all the necessary preprocessing under this method
        self.preprocess_data()

    def set_ranking_weights(self, Rcu_weight, Su_weight, div_weight, Ci_weight):
        self.Rcu_weight = Rcu_weight
        self.Su_weight = Su_weight
        self.div_weight = div_weight
        self.Ci_weight = Ci_weight

    def preprocess_data(self):
        # TODO choose movies only above threshold_rating
        # TODO omit movies without genres (no genres listed) - to compare with genre based approach
        pass

    def recommend_movies(self, user_id, K=None):
        # TODO choose movies only above threshold_rating
        # TODO omit movies without genres (no genres listed) - to compare with genre based approach
        if K is not None:
            self.K = K

        # extract list of movies watched by this user
        user_movies_d = self.get_users_watched_movies(user_id)

        # extract tag-genomes for movies watched by user
        user_movie_tags_df = self.genome_scores_df[self.genome_scores_df.index.isin(user_movies_d[user_id])]

        # create clusters_series for movies watched by user
        clusters_series = self.form_clusters(user_id, user_movies_d, user_movie_tags_df)

        # select right clusters_series to target:
        # TODO udpate optimal cluster selection technique
        target_clusters, cluster_ranks, above_mean_cluster_index, below_mean_cluster_index \
            = self.choose_appropriate_clusters_for_diversification(clusters_series)

        # decide ratio of movies selected from similar clusters to movies selected from sparse clusters
        N_movies_similar = int(self.K * self.relevant_movies_threshold)
        # TODO fix this, when K=8, this is being 0 for user ID 1 on ml20m dataset,
        #  failing only for full-genome df, not for lemmatized, check why not failing for lemmatized
        N_movies_per_dense_cluster = int(N_movies_similar / above_mean_cluster_index.size)

        # existing greedy re-ranking approach for movies in sparse clusters
        N_movies_diverse = self.K - N_movies_similar

        # TODO figure out better way to remove duplicate movies from recommendations

        # RL1 - Recommendation List from Dense clusters
        dense_cluster_recommendations = list()

        # fetch n_neighbors for each movie in target_clusters
        previous_recommendations_count = N_movies_per_dense_cluster  # denotes number of movies recommended from previous cluster
        for cluster in above_mean_cluster_index:
            # find best K movies for each movie in a cluster
            # TODO rank according to highest diversity or decide best approach to re-rank these movies

            # movies from this cluster
            watched_movies = clusters_series[cluster]
            # if less movies are recommended from previous cluster(s), automatically recommend N extra movies
            N_movies = N_movies_per_dense_cluster + max(0, N_movies_per_dense_cluster - previous_recommendations_count)

            recommended_movies = self.find_similar_movies_to_dense_cluster(watched_movies, user_id, N_movies)
            dense_cluster_recommendations.extend(recommended_movies.tolist())

            # actual number of movies recommended from this cluster
            # difference indicates N movies yet to be recommended
            previous_recommendations_count = recommended_movies.size

        # In case if movies recommended form dense clusters are less than intended
        N_movies_diverse = N_movies_diverse + len(dense_cluster_recommendations) - N_movies_similar

        # greedy-re-ranking algorithm, based on rating, diversity, similarity to watched and user profile.
        # movies from this cluster
        # RL2 - Recommendation List from Sparse clusters
        sparse_cluster_recommendations = list()

        # get all watched movies from clusters below mean
        watched_movies = list()
        for cluster in below_mean_cluster_index:
            watched_movies.extend(clusters_series[cluster])

        sparse_cluster_recommendations.extend(
            self.find_similar_movies_to_sparse_cluster(watched_movies, user_id, N_movies_diverse, clusters_series))

        # rank similar movies for each cluster, and select top-N from each cluster
        # duplicate processing, keep one with the top cluster rank
        dense_cluster_recommendations.extend(sparse_cluster_recommendations)

        return dense_cluster_recommendations

    def find_similar_movies_to_sparse_cluster(self, watched_movies, user_id, N_movies_diverse, clusters_series):
        # TODO do experiment by changing R_cu to be average rating across all users rather than
        # TODO figure out better way to remove duplicate movies from recommendations
        # TODO test
        ranking_df = pd.DataFrame()

        for watched_movie_id in watched_movies:
            similar_movies = self.item_item_similarities_df[watched_movie_id].sort_values(ascending=False)[
                             :self.n_neighbours]

            similar_movies_df = pd.DataFrame(similar_movies)
            similar_movies_df['movieId'] = similar_movies_df.index
            similar_movies_df['watched_movie_id'] = similar_movies.name
            similar_movies_df.columns = ['S_c', 'movieId', 'watched_movie_id']

            similar_movies_df.reset_index(drop=True, inplace=True)

            ranking_df = ranking_df.append(similar_movies_df, ignore_index=True)

        movie_ids = ranking_df['movieId'].values

        # extract genome scores for movie_ids
        genome_scores_vector = self.user_term_vector_df.loc[movie_ids, :].values

        # extract user_term vector
        user_vector = self.user_term_vector_df.loc[user_id, :]

        distances_with_user = pairwise_distances(genome_scores_vector, [user_vector], metric='cosine')

        ranking_df['S_u'] = distances_with_user
        ranking_df['diversity'] = 1 - ranking_df['S_u']

        users_ratings = self.ratings_df[self.ratings_df['userId'] == user_id].loc[:, ['movieId', 'rating']]
        candidate_movie_ratings_df = users_ratings[users_ratings['movieId'].isin(watched_movies)]
        candidate_movie_ratings_df.set_index(candidate_movie_ratings_df['movieId'].values, drop=True, inplace=True)

        movie_ratings_dict = candidate_movie_ratings_df['rating'].to_dict()

        def assign_rating(x):
            x['R_cu'] = movie_ratings_dict[x['watched_movie_id']]

            return x

        ranking_df['R_cu'] = None

        ranking_df = ranking_df.apply(lambda x: assign_rating(x), axis=1)

        # add cluster rank as well, remove this line
        # ranks = ranking_df.loc[:, ['S_c', 'S_u', 'diversity', 'R_cu']].rank(method='dense')

        # cluster_size_df
        cluster_size_df = pd.DataFrame(index=clusters_series.index)

        def process(x):
            x['size'] = len(clusters_series[x.name])

            return x

        cluster_size_df['size'] = None
        cluster_size_df = cluster_size_df.apply(lambda x: process(x), axis=1)

        # smaller the cluster size, higher the score
        cluster_size_df['C_i'] = cluster_size_df.rank(method='dense', ascending=False).astype(np.int)

        def assign_cluster_score(x):
            x['C_i'] = self.get_movie_cluster_score(x['watched_movie_id'], clusters_series, cluster_size_df)
            return x

        ranking_df['C_i'] = None
        ranking_df = ranking_df.apply(lambda x: assign_cluster_score(x), axis=1)

        # ranking formula
        # The '\' sign indicates continuation of code from next line
        # TODO rework on this equation,
        #   consider something like (R_cu * rank(R_cu) + diversity * rank(diversity) + (S_u) * rank(S_u) + (S_c) * rank(S_c) + C_i
        # TODO ranking experiment-1
        # ranking_df['composite_score'] = ranking_df['R_cu'] * ranking_df['diversity'] \
        #                                 * ranking_df['S_u'] * ranking_df['S_c'] * ranking_df['C_i']
        #
        # sorted_scores_df = ranking_df.sort_values('composite_score', ascending=False)
        # sorted_scores_df.to_csv(data_output_dir + "ranking_composite1.csv")

        ranking_df['rank(R_cu)'] = ranking_df['R_cu'].rank(method='dense')
        ranking_df['rank(diversity)'] = ranking_df['diversity'].rank(method='dense')
        ranking_df['rank(S_u)'] = ranking_df['S_u'].rank(method='dense')
        ranking_df['rank(S_c)'] = ranking_df['S_c'].rank(method='dense')

        # TODO rework on this equation,
        #   consider something like (R_cu * rank(R_cu) + diversity * rank(diversity) + (S_u) * rank(S_u) + (S_c) * rank(S_c) + C_i
        # TODO check difference in df rank reordering with that from above formula
        # TODO ranking experiment-2
        # ranking_df['composite_score'] = ranking_df['R_cu'] * ranking_df['rank(R_cu)'] + ranking_df['diversity'] * \
        #                                 ranking_df['rank(diversity)'] \
        #                                 + ranking_df['S_u'] * ranking_df['rank(S_u)'] + ranking_df['S_c'] * ranking_df[
        #                                     'rank(S_c)'] + ranking_df['C_i']
        #
        # sorted_scores_df = ranking_df.sort_values('composite_score', ascending=False)
        # sorted_scores_df.to_csv(data_output_dir + "ranking_composite2.csv")
        #
        # # TODO ranking experiment-3:
        # ranking_df.drop(['composite_score', 'rank(R_cu)', 'rank(diversity)', 'rank(S_u)', 'rank(S_c)'], axis=1,
        #                 inplace=True)
        # exp3_df = ranking_df.sort_values(['S_c', 'S_u', 'diversity', 'R_cu', 'C_i'], ascending=False)
        # exp3_df.to_csv(data_output_dir + "ranking_composite3.csv")
        #
        # exp4_df = ranking_df.sort_values(['S_c', 'diversity', 'S_u', 'C_i', 'R_cu'], ascending=False)
        # exp3_df.to_csv(data_output_dir + "ranking_composite4.csv")
        #
        # print("Dataframes similarity:", exp3_df.equals(exp4_df))

        # TODO ranking experiment4:
        ranking_df['composite_score_weighted'] = self.Rcu_weight * ranking_df['rank(R_cu)'] \
                                                 + self.div_weight * ranking_df['rank(diversity)'] \
                                                 + self.Su_weight * ranking_df['rank(S_u)'] \
                                                 + self.Ci_weight * ranking_df['C_i']

        sorted_scores_df = ranking_df.sort_values('composite_score_weighted', ascending=False)

        # drop duplicates
        sorted_scores_df.set_index(sorted_scores_df['movieId'].values, drop=True, inplace=True)
        sorted_scores_df.drop(columns='movieId', inplace=True)
        sorted_scores_df['m_id'] = sorted_scores_df.index.values
        sorted_scores_df.drop_duplicates('m_id', inplace=True)
        sorted_scores_df.drop(columns='m_id', inplace=True)

        return sorted_scores_df.index.values[:N_movies_diverse].reshape(1, -1)[0]

    @staticmethod
    def get_movie_cluster_score(movieId, clusters_series, cluster_size_df):
        for cluster in clusters_series.index.tolist():
            if movieId in clusters_series[cluster]:
                return cluster_size_df.loc[cluster, ['C_i']].values[0]

        return 0

    def find_similar_movies_to_dense_cluster(self, watched_movies, user_id, N_movies_per_dense_cluster):
        # TODO figure out better way to remove duplicate movies from recommendations
        # TODO test
        ranking_df = pd.DataFrame()

        for watched_movie_id in watched_movies:
            # sort by most similar movies on top
            similar_movies = self.item_item_similarities_df[watched_movie_id].sort_values(ascending=False)[:self.K]

            similar_movies_df = pd.DataFrame(similar_movies)
            similar_movies_df['movieId'] = similar_movies_df.index
            # similar_movies_df['watched_movie_id'] = similar_movies.name
            similar_movies_df.columns = ['S_c', 'movieId']
            similar_movies_df.reset_index(drop=True, inplace=True)

            ranking_df = ranking_df.append(similar_movies_df, ignore_index=True)

        movie_ids = ranking_df['movieId'].values

        # extract genome scores for movie_ids
        genome_scores_vector = self.genome_scores_df.loc[movie_ids, :].values

        # extract user_term vector
        user_vector = self.user_term_vector_df.loc[user_id, :]

        distances_with_user = pairwise_distances(genome_scores_vector, [user_vector], metric='cosine')

        # similarity to user profile
        ranking_df['S_u'] = distances_with_user

        # diversity
        ranking_df['diversity'] = 1 - ranking_df['S_u']

        # sort as per highest diversity offered
        # TODO rethink on how to rerank these movies, whether by max diversity, or by similarity to watched_movie or similarity to user profile
        #   or whether multiple columns should be considered while ranking these movies
        ranking_df.sort_values('diversity', ascending=False, inplace=True)

        # TODO replace this approach with better way of dropping duplicates
        ranking_df.set_index(ranking_df['movieId'].values, drop=True, inplace=True)
        ranking_df.drop(columns='movieId', inplace=True)
        ranking_df['m_id'] = ranking_df.index.values
        ranking_df.drop_duplicates('m_id', inplace=True)
        ranking_df.drop(columns='m_id', inplace=True)

        return ranking_df.index.values[:N_movies_per_dense_cluster].reshape(1, -1)[0]

    def fetch_n_neighbors_for_target_clusters(self, target_clusters, all_cluster):
        """

        :param target_clusters:
        :param all_clusters: original all_clusters series
        :return:
        """
        # list all movie id's from target clusters:
        all_candidate_movies = list()

        for cluster in target_clusters:
            all_candidate_movies.extend(all_cluster[cluster].values.tolist())

    def fetch_N_similar_movies(self, candidate_movie_id):
        """
        :param candidate_movie_id:
        :return: Pandas Series with movieId as Index and relevance score to candidate movie as values
        """
        return self.item_item_similarities_df[candidate_movie_id].sort_values(ascending=False)[:self.n_neighbours]

    def choose_appropriate_clusters_for_diversification(self, clusters):
        """
        Choose appropriate cluster to do diversification
        :param clusters:
        :return:Array of cluster number below threshold,
                and
                Array of their respective ranks
        """
        cluster_size_df = pd.DataFrame(index=clusters.index)

        def process(x):
            x['size'] = len(clusters[x.name])

            return x

        cluster_size_df['size'] = None

        # calculate & store size for each cluster
        cluster_size_df.apply(lambda x: process(x), axis=1)

        # choose clusters with only up to median sizes
        # choosing all clusters
        below_mean_clusters_df = cluster_size_df[cluster_size_df['size'] <= cluster_size_df['size'].mean()]
        below_mean_cluster_index = below_mean_clusters_df.index.values

        above_mean_cluster_index = np.setdiff1d(cluster_size_df.index.values, below_mean_cluster_index)

        # rank clusters
        cluster_size_df['rank'] = cluster_size_df.rank(method='dense')

        return cluster_size_df.index.values, cluster_size_df[
            'rank'].values, above_mean_cluster_index, below_mean_cluster_index

    def form_clusters(self, user_id, user_movies_d, user_movie_tags_df):
        # TODO filter movies only above certain rating threshold
        n_movies = user_movie_tags_df.index.size
        highest_score = 0

        best_clustering_result = None

        # exhaustively check silhouette scores for each cluster sizes and select the cluster size with the highest score.
        for cluster_size in range(2, n_movies - 1, 1):
            clustering_result = AgglomerativeClustering(n_clusters=cluster_size, affinity='euclidean',
                                                        linkage='ward').fit_predict(
                user_movie_tags_df.values[:n_movies])
            score = silhouette_score(user_movie_tags_df.values[:n_movies], clustering_result)

            if highest_score < score:
                best_clustering_result = clustering_result
                highest_score = score

        new_df = pd.DataFrame(best_clustering_result, columns=['cluster'])

        new_df['movie'] = user_movies_d[user_id]
        resulting_clusters = new_df.groupby('cluster')['movie'].apply(list)

        return resulting_clusters

    def get_users_watched_movies(self, user_id):
        user_movies_d = {}

        user_movies_d[user_id] = self.ratings_df[self.ratings_df['userId'] == user_id]['movieId'].values.tolist()

        return user_movies_d


def top_K_similar_movies(user_id, K, all_movies_vector, user_genome_vector_df, genome_scores_df):
    all_movies_vector = genome_scores_df.values

    user_vector = user_genome_vector_df.loc[user_id, :].values

    # convert from 1D to 2D array
    user_vector = np.array([user_vector])

    distances = pairwise_distances(all_movies_vector, user_vector, metric='cosine')

    # 2D to 1D
    distances = distances.T[0]

    ser = pd.Series(distances, name=user_id)
    ser.index = genome_scores_df.index

    # top K recommendations, with relevance scores to the user profile
    return ser.sort_values(ascending=False)[:K]


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
    print(item_item_distances)

    # recommender = ContentBased_Baseline_Recommender()
    recommender = CB_ClusteringBased_Recommender(ratings_df, genome_scores_df, user_genome_vector_df,
                                                 item_item_similarity_df, n_neighbours=8)
    # predict ratings for all users in serendipity dataset
    start_time = time()
    for user_id in range(1, 6):
        print(user_id)
        recommended_movies = recommender.recommend_movies(user_id)
        print(recommended_movies)
    finish_time = time() - start_time

    print("Total Time Taken: %f seconds" % finish_time)

    # load df from answers
    # answers_df = pd.read_csv(answers)
    # user_list = answers_df['userId'].unique().tolist()

    # final_recommendations_df = pd.DataFrame(columns=['userId', 'movieId'])
    #
    # for user_id in user_list[:5]:
    #     # predict ratings for all users in serendipity dataset
    #     recommended_movies = recommender.recommend_movies(user_id, K=8)
    #
    #     recommendations_df = pd.DataFrame(index=range(1, 9))
    #     recommendations_df['userId'] = user_id
    #     recommendations_df['movieId'] = recommended_movies
    #
    #     print(recommended_movies)
    #     final_recommendations_df = final_recommendations_df.append(recommendations_df, ignore_index=True)
    #
    # final_recommendations_df.to_csv(data_output_dir + "final_recommendations.csv")
    # print(final_recommendations_df)


if __name__ == '__main__':
    main()
