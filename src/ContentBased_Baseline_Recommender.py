import numpy as np
import pandas as pd
from sklearn.metrics import pairwise_distances
from sklearn.cluster import KMeans

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


class ContentBased_Baseline_Recommender:

    def __init__(self):
        pass


class CB_ClusteringBased_Recommender:

    def __init__(self, ratings_df, genome_scores_df, user_term_vector_df, item_item_similarities_df, K=20, n_neighbours=20, n_clusters=8):
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
        self.kmeans_instance = KMeans(n_clusters=n_clusters)

    def recommend_movies(self, user_id, K=None):
        # extract list of movies watched by this user
        user_movies_d = self.get_users_watched_movies(user_id)

        # extract tag-genomes for movies watched by user
        user_movie_tags_df = self.genome_scores_df[self.genome_scores_df.index.isin(user_movies_d[user_id])]

        # create all_clusters for movies watched by user
        all_clusters = self.form_clusters(user_id, user_movies_d, user_movie_tags_df)

        # select right all_clusters to target:
        # TODO udpate optimal cluster selection technique
        #   for now just focus on clusters >= median
        target_clusters, cluster_ranks = self.choose_appropriate_clusters_for_diversification(all_clusters)

        # fetch n_neighbors for each movie in target_clusters


        # duplicate processing, keep one with the top cluster rank

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
        below_mean_clusters_df = cluster_size_df[cluster_size_df['size'] <= cluster_size_df['size'].mean()]

        # rank clusters
        below_mean_clusters_df['rank'] = below_mean_clusters_df.rank(method='dense')

        return below_mean_clusters_df.index.values, below_mean_clusters_df['rank'].values

    def form_clusters(self, user_id, user_movies_d, user_movie_tags_df):
        # TODO filter movies only above certain rating threshold
        self.kmeans_instance.fit(user_movie_tags_df.values)
        result = self.kmeans_instance.predict(user_movie_tags_df.values)

        new_df = pd.DataFrame(result, columns=['cluster'])

        new_df['movie'] = user_movies_d[user_id]
        clusters = new_df.groupby('cluster')['movie'].apply(list)

        return clusters

    def get_users_watched_movies(self, user_id):
        user_movies_d = {}

        for uid in range(31, 50):
            user_movies_d[uid] = self.ratings_df[self.ratings_df['userId'] == user_id]['movieId'].values.tolist()

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
    genome_score_movies = genome_scores_df['movieId'].unique()

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

    # movies_vector = genome_scores_df.values
    #
    # # take random N=20 users
    # N_Users = 20
    # all_user_ids = user_genome_vector_df.index.values
    #
    # # randomly choose n_users, using the random seed
    # seed_number = 171450
    # np.random.seed(seed_number)
    #
    # n_users = np.random.choice(all_user_ids, size=N_Users)
    #
    # # find K similar items:
    # K = 20
    #
    # # key - user_id, value - series with movie_id as index and relevance score to user profile as value,
    # # where series name is as same as user_id
    # k_similar_items_dict = dict()
    #
    # for user in n_users:
    #     series = top_K_similar_movies(user, K, movies_vector, user_genome_vector_df, genome_scores_df)
    #     k_similar_items_dict[user] = series
    #
    # print(k_similar_items_dict)


if __name__ == '__main__':
    main()
